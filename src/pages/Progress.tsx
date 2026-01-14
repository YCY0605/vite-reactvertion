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

const statusOptions = ['所有狀態', '到達起點', '離開起點', '到達目的', '任務完成'];

// --- 2. 模擬資料 ---
const initialData: OrderData[] = [
    { startTime: '2026-06-06 08:00:00', orderNumber: 'aaa000001', status: '離開起點' },
    { startTime: '2026-06-07 09:00:00', orderNumber: 'aaa000002', status: '到達起點' },
    { startTime: '2026-06-08 10:00:00', orderNumber: 'bbb000003', status: '任務完成' },
    { startTime: '2026-06-09 11:00:00', orderNumber: 'aaa000004', status: '到達目的' },
    { startTime: '2026-06-10 12:00:00', orderNumber: 'ccc000005', status: '離開起點' },
    { startTime: '2026-06-10 12:00:00', orderNumber: 'ccc000005', status: '離開起點' },
    { startTime: '2026-06-10 12:00:00', orderNumber: 'ccc000005', status: '離開起點' },
    { startTime: '2026-06-10 12:00:00', orderNumber: 'ccc000005', status: '離開起點' },
    { startTime: '2026-06-10 12:00:00', orderNumber: 'ccc000005', status: '離開起點' },
    { startTime: '2026-06-10 12:00:00', orderNumber: 'ccc000005', status: '離開起點' },
];

const columnHelper = createColumnHelper<OrderData>();

// 將 Columns 定義移到外部，接受回調函式處理點擊
const getColumns = ({ onReportClick }: { onReportClick: (order: string) => void }) => [
    columnHelper.accessor('startTime', {
        header: () => <div className={'headorder'}>開始時間</div>,
        filterFn: dateRangeFilterFn,
    }),
    columnHelper.accessor('orderNumber', {
        header: () => <div className={'headorder'}>單號</div>,
    }),
    columnHelper.accessor('status', {
        header: () => <div className={'headorder'}>狀態</div>,
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
function DoubleCheckDialog({ order, isOpen, onClose }: { order: string | null, isOpen: boolean, onClose: () => void }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
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
                <p>您正在回報單號：<br /><strong>{order}</strong></p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                        onClick={() => {
                            alert(`已提交回報：${order}`);
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
    const [data] = useState(initialData);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

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
            <div className={ 'tablecontainer' }>
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
                order={ selectedOrder }
                isOpen={selectedOrder !== null}
                onClose={() => setSelectedOrder(null) }
            />
        </div>
    );
}
