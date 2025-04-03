"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessorFn?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  hideOnMobile?: boolean;
  minWidth?: string | number;
}

export interface ResponsiveTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  rowClassName?: (row: T, index: number) => string | undefined;
  onRowClick?: (row: T, index: number) => void;
  emptyState?: ReactNode;
  isLoading?: boolean;
  loadingRows?: number;
  stickyHeader?: boolean;
  cardOnMobile?: boolean;
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  tableClassName,
  theadClassName,
  tbodyClassName,
  rowClassName,
  onRowClick,
  emptyState,
  isLoading,
  loadingRows = 3,
  stickyHeader = false,
  cardOnMobile = true,
}: ResponsiveTableProps<T>) {
  // Générer des données factices pour l'état de chargement
  const loadingData = React.useMemo(() => {
    return Array(loadingRows).fill(null).map((_, i) => ({ id: `loading-${i}` }));
  }, [loadingRows]);

  // Afficher l'état vide si aucune donnée et pas en chargement
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {emptyState || (
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Aucune donnée à afficher</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700", className)}>
      {/* Version standard - tableau pour desktop et tablette */}
      <div className={cardOnMobile ? "table-responsive hidden sm:block" : "table-responsive"}>
        <table className={cn("w-full border-collapse", tableClassName)}>
          <thead className={cn(
            "bg-gray-50 dark:bg-gray-800 text-left text-sm font-medium text-gray-600 dark:text-gray-300",
            stickyHeader && "sticky top-0 z-10",
            theadClassName
          )}>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column, i) => (
                <th 
                  key={column.key} 
                  className={cn(
                    "px-4 py-3",
                    column.hideOnMobile && "hidden sm:table-cell",
                    column.headerClassName
                  )}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={cn("bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", tbodyClassName)}>
            {(isLoading ? loadingData : data).map((row, rowIndex) => (
              <tr 
                key={row.id || `row-${rowIndex}`} 
                className={cn(
                  "text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors",
                  onRowClick && "cursor-pointer",
                  isLoading && "animate-pulse",
                  rowClassName && rowClassName(row, rowIndex)
                )}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
              >
                {columns.map((column, colIndex) => {
                  const cellContent = isLoading 
                    ? <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    : column.accessorFn 
                      ? column.accessorFn(row) 
                      : row[column.key];
                      
                  return (
                    <td 
                      key={`${row.id || rowIndex}-${column.key || colIndex}`}
                      className={cn(
                        "px-4 py-3",
                        column.hideOnMobile && "hidden sm:table-cell",
                        column.cellClassName
                      )}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version carte - pour mobile uniquement */}
      {cardOnMobile && (
        <div className="sm:hidden">
          {(isLoading ? loadingData : data).map((row, rowIndex) => (
            <div 
              key={row.id || `card-${rowIndex}`}
              className={cn(
                "p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 bg-white dark:bg-gray-800",
                onRowClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30",
                isLoading && "animate-pulse",
                rowClassName && rowClassName(row, rowIndex)
              )}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
            >
              {columns
                .filter(col => !col.hideOnMobile)
                .map((column, colIndex) => {
                  const cellContent = isLoading 
                    ? <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    : column.accessorFn 
                      ? column.accessorFn(row) 
                      : row[column.key];

                  return (
                    <div key={`${row.id || rowIndex}-card-${column.key || colIndex}`} className="flex py-2">
                      <div className="w-1/3 font-medium text-gray-600 dark:text-gray-400">{column.header}</div>
                      <div className="w-2/3 text-gray-800 dark:text-gray-200">{cellContent}</div>
                    </div>
                  );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 