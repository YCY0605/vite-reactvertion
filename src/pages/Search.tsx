import React, { useState, useMemo } from 'react';
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
import { isWithinInterval, parseISO, endOfDay } from 'date-fns'; // 引入 date-fns 函式庫
import '../assets/css/ReportTable.css';


// --- 1. 定義資料類型與過濾器類型 ---
interface OrderData {
    startTime: string;
    orderNumber: string;
    status: string;
}

// 定義日期範圍過濾器的值類型
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

    // 檢查儲存格日期是否在範圍內
    return isWithinInterval(cellValue, {
        start: dateFrom || new Date(-8640000000000000), // 如果無起始日，設為極早日期
        end: dateTo || new Date(8640000000000000),    // 如果無結束日，設為極晚日期
    });
};

// 狀態下拉選單的選項
const statusOptions = ['所有狀態', '到達起點', '離開起點', '到達目的', '任務完成'];

// --- 2. 模擬資料 ---
const initialData: OrderData[] = [
    { startTime: '2026-06-06 08:00:00', orderNumber: 'aaa000001', status: '離開起點' },
    { startTime: '2026-06-07 09:00:00', orderNumber: 'aaa000002', status: '到達起點' },
    { startTime: '2026-06-08 10:00:00', orderNumber: 'bbb000003', status: '任務完成' },
    { startTime: '2026-06-09 11:00:00', orderNumber: 'aaa000004', status: '到達目的' },
    { startTime: '2026-06-10 12:00:00', orderNumber: 'ccc000005', status: '離開起點' },
];

const columnHelper = createColumnHelper<OrderData>();

// --- 3. 定義欄位 ( accessor key 對應 TypeScript 介面) ---
const columns = [
    columnHelper.accessor('startTime', {
        header: () => <div className={'headorder'}>開始時間</div>,
        filterFn: dateRangeFilterFn, // 日期範圍過濾器
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
                onClick={() => alert(`查看單號 ${props.row.original.orderNumber} 的詳細資料`)}/* !!! 未完成 */
                className={'detailbtn'}
            >
                詳細資料
            </button>
        ),
        enableSorting: false,
    }),
];

// --- 4. 主要 React 元件 ---
export default function OrderTable() {
    const [data] = useState(initialData);
    const [sorting, setSorting] = useState<SortingState>([]);
    // 使用 columnFilters 替代 globalFilter
    const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // 啟用欄位過濾器
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters, // 綁定欄位過濾 state
        state: {
            sorting,
            columnFilters, // 將 columnFilters state 傳遞給表格實例
        },
        // 停用全域過濾器，只使用欄位過濾
        enableGlobalFilter: false,
    });

    // --- 5. 過濾器處理函數 ---

    // 處理日期範圍變化 (使用欄位 ID 'startTime')
    const handleDateRangeChange = (type: 'start' | 'end', date: string) => {
        // 獲取當前 startTime 的過濾值
        const currentFilter = table.getColumn('startTime')?.getFilterValue() as DateRangeFilterValue ?? [null, null];
        const newFilter: DateRangeFilterValue = type === 'start' ? [date, currentFilter[1]] : [currentFilter[0], date];
        // 更新欄位過濾器
        table.getColumn('startTime')?.setFilterValue(newFilter);
    };

    // 處理單號搜尋變化 (使用欄位 ID 'orderNumber')
    const handleOrderNumberSearch = (value: string) => {
        // 使用預設的 includesString 過濾邏輯，但只針對 'orderNumber' 欄位
        table.getColumn('orderNumber')?.setFilterValue(value);
    };

    // 處理狀態選擇變化 (使用欄位 ID 'status')
    const handleStatusChange = (value: string) => {
        // 如果選擇 '所有狀態' 則清除過濾器，否則設定狀態值
        table.getColumn('status')?.setFilterValue(value === '所有狀態' ? undefined : value);
    };

    // 獲取當前過濾值以設定輸入框 value
    const orderNumberFilterValue = (table.getColumn('orderNumber')?.getFilterValue() as string) ?? '';

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
            {/* 查詢區域 */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>從:
                    <input
                        type="date"
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        style={{ padding: '6px', border: '1px solid #ccc', marginLeft: '10px' }}
                    />
                </span>
                <span>至:
                    <input
                        type="date"
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        style={{ padding: '6px', border: '1px solid #ccc', marginLeft: '10px' }}
                    />
                    &nbsp;&nbsp;
                </span>
                <input
                    type="text"
                    value={orderNumberFilterValue}
                    onChange={e => handleOrderNumberSearch(e.target.value)}
                    placeholder="搜尋單號..."
                    style={{ padding: '8px', width: '200px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
                />
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
                                        {{ asc: ' 🔼', desc: ' 🔽', }[header.column.getIsSorted() as string] ?? null}
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
        </div>
    );
}

