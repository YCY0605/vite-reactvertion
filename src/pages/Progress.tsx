import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    FilterFn,
    ColumnFilter,
} from '@tanstack/react-table';
import { isWithinInterval, parseISO, endOfDay } from 'date-fns';
import '../assets/css/ReportTable.css';

// --- 1. 定義資料類型與過濾器類型 ---
interface OrderData {
    startTime: string;
    orderNumber: string;
    status: string;
}

type DateRangeFilterValue = [string | null, string | null];

// 自定義日期範圍過濾函數
const dateRangeFilterFn: FilterFn<OrderData> = (row, columnId, filterValue: DateRangeFilterValue) => {
    const dateFrom = filterValue[0] ? parseISO(filterValue[0]) : null;
    let dateTo = filterValue[1] ? parseISO(filterValue[1]) : null;
    if (dateTo) {
        dateTo = endOfDay(dateTo);
    }
    const cellValue = parseISO(row.getValue(columnId));

    if (!dateFrom && !dateTo) return true;

    return isWithinInterval(cellValue, {
        start: dateFrom || new Date(-8640000000000000),
        end: dateTo || new Date(8640000000000000),
    });
};

const statusOptions = ['所有狀態', '尚未開始', '到達起點', '離開起點', '到達目的', '任務完成'];
var initialData: OrderData[] = [];


const columnHelper = createColumnHelper<OrderData>();

// 將 Columns 定義移到外部，接受回調函式處理點擊
const getColumns = ({ onReportClick }: { onReportClick: (order: string) => void }) => [
    columnHelper.accessor('startTime', {
        header: () => <div className={'headorder'}>開始時間</div>,
        filterFn: dateRangeFilterFn,
    }),
    columnHelper.accessor('orderNumber', {
        header: () => <div className={'headorder'}>任務排程代號</div>,
    }),
    columnHelper.accessor('status', {
        header: () => <div >狀態</div>,
        enableSorting: false,
    }),
    columnHelper.display({
        id: 'actions',
        header: '操作',
        cell: props => (
            <button
                onClick={() => onReportClick(props.row.original.orderNumber)}
                className={'reportbtn'}
            >
                回報
            </button>
        ),
        enableSorting: false,
    }),
];


// dialog
function DoubleCheckDialog({ order, status, isOpen, onClose }: { order: string | null, status: string, isOpen: boolean, onClose: () => void }) {
    const chgState = () => {
        switch (status) {
            case "尚未開始": setNewStatus("到達起點"); break;
            case "到達起點": setNewStatus("離開起點"); break;
            case "離開起點": setNewStatus("到達目的"); break;
            case "到達目的": setNewStatus("任務完成"); break;
            default: setNewStatus("錯誤"); break;
        }
    }
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [newStatus, setNewStatus] = useState("");
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [lngString, setLngString] = useState("取得中");
    const [latString, setLatString] = useState("取得中");
    useEffect(() => {
        chgState();
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    setLng(longitude); // 經度
                    setLat(latitude);  // 緯度
                    setLngString(longitude.toString());
                    setLatString(latitude.toString());
                    console.log(`${longitude}, ${latitude}`);
                },
                (err) => {
                    setLngString("取得失敗");
                    setLatString("取得失敗");
                    console.error(err);
                },
                { enableHighAccuracy: true }
            );
        }
        else {
            alert("瀏覽器不支持地理定位。");
            setLngString("取得失敗");
            setLatString("取得失敗");
        }
    }, [isOpen]);

    return (
        <dialog
            ref={dialogRef}
            className={'dialogwindow'}
            onClose={onClose}
        >
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ marginTop: 0 }}>進度回報</h3>
                <p>
                    正在回報單號：<strong>{order}</strong><br />
                    經緯度：{lngString}, {latString}
                </p>
                {/*<p>座標：<strong>`${lng}, ${lat}`</strong></p>*/}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                        onClick={async () => {
                            console.log({
                                taskScheduleId: parseInt(order!.match(/\d+/)![0], 10),
                                workPunchLng: lng,
                                workPunchLat: lat
                            })
                            const response = await fetch(import.meta.env.VITE_API_URL + '/api/Mover/newprogress', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,

                                },
                                body: JSON.stringify({
                                    taskScheduleId: parseInt(order!.match(/\d+/)![0], 10).toString(),
                                    workRecordContent: newStatus,
                                    workPunchLng: lng.toString(),
                                    workPunchLat: lat.toString()
                                }),
                            }
                            )
                            alert(`${await response.text()}`);
                            onClose();
                        }}
                        className={'dialogbtn'}
                        style={{ color: '#fff', backgroundColor: '#00ba00' }}
                    >
                        提交
                    </button>
                    <button
                        onClick={() => dialogRef.current?.close()}
                        className={'dialogbtn'}
                        style={{ color: '#000', backgroundColor: '#fff' }}
                    >
                        取消
                    </button>
                </div>
            </div>
        </dialog>
    )
}

// --- 3. 主要 React 元件 ---
export default function OrderTable() {
    const [data, setData] = useState(initialData);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

    const dataLoading = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/api/Mover/progress', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (response.ok) {
                const rawData = await response.json();

                // 加工資料
                const processedData = rawData.map((item: any) => {
                    const startTime = `${item.taskScheduleStartDate} ${item.taskScheduleStartAt}`;

                    // 2. 判斷進度狀態 (根據 count 遞增)
                    let progressState = "";
                    switch (item.progressUpdateCount) {
                        case 0: progressState = "尚未開始"; break;
                        case 1: progressState = "到達起點"; break;
                        case 2: progressState = "離開起點"; break;
                        case 3: progressState = "到達目的"; break;
                        case 4: progressState = "任務完成"; break;
                        default: progressState = "錯誤"; break;
                    }

                    return {
                        ...item,
                        startTime: startTime,      // 新增組合後的欄位
                        status: progressState,     // 將 count 轉為文字狀態
                        orderNumber: `TS-${item.taskScheduleId.toString().padStart(6, '0')}` // 模擬單號
                    };
                });
                setData(processedData);
            } else {
                const errorText = await response.text();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('無法連線至伺服器');
        }
    };


    // 建立 Table 實例
    const columns = useMemo(() => getColumns({
        onReportClick: (order) => setSelectedOrder(order)
    }), []);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableGlobalFilter: false,
    });

    // 查詢過濾邏輯
    const handleDateRangeChange = (type: 'start' | 'end', date: string) => {
        const currentFilter = table.getColumn('startTime')?.getFilterValue() as DateRangeFilterValue ?? [null, null];
        const newFilter: DateRangeFilterValue = type === 'start' ? [date, currentFilter[1]] : [currentFilter[0], date];
        table.getColumn('startTime')?.setFilterValue(newFilter);
    };

    const handleOrderNumberSearch = (value: string) => {
        table.getColumn('orderNumber')?.setFilterValue(value);
    };

    const handleStatusChange = (value: string) => {
        table.getColumn('status')?.setFilterValue(value === '所有狀態' ? undefined : value);
    };

    const orderNumberFilterValue = (table.getColumn('orderNumber')?.getFilterValue() as string) ?? '';

    useEffect(() => {
        dataLoading();
    }, [])

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
            {/* 查詢區域 */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>從:</span>
                <input
                    type="date"
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    style={{ padding: '6px', border: '1px solid #ccc' }}
                />
                <span>至:</span>
                <input
                    type="date"
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    style={{ padding: '6px', border: '1px solid #ccc' }}
                />
                &nbsp;&nbsp;
                <input
                    type="text"
                    value={orderNumberFilterValue}
                    onChange={e => handleOrderNumberSearch(e.target.value)}
                    placeholder="搜尋單號..."
                    style={{ marginLeft: '20px', padding: '8px', width: '200px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <select
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            {/* 表格區域 */}
            <div className={'tablecontainer'}>
                <table className={'reporttable'}>
                    <thead className={'tablehead'}>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className={'tableheadtext'}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className={'tablerow'}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className={'tableblock'}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 回報彈窗 */}
            <DoubleCheckDialog
                order={selectedOrder}
                status={data.find((d) => d.orderNumber == selectedOrder)?.status ?? ""}
                isOpen={selectedOrder !== null}
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
}
