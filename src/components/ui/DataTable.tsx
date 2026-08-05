import React from 'react';
import { clsx } from 'clsx';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No records found',
  className,
}: DataTableProps<T>) {
  return (
    <div className={clsx('w-full overflow-x-auto rounded-none border border-[#E6E4DF] dark:border-[#27272A] bg-white dark:bg-[#141414] shadow-2xs', className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-[#FAF9F5] dark:bg-[#1A1A1A] text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-[#E6E4DF] dark:border-[#27272A]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={clsx('px-6 py-4', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0EEE8] dark:divide-[#27272A]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 text-xs font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick && onRowClick(row)}
                className={clsx(
                  'transition-colors hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C]',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={clsx('px-6 py-4 whitespace-nowrap text-xs', col.className)}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
