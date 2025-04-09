// ce fichier gere le tableau de données
// le tableau de données est un tableau qui permet de gerer les données dans les components
// exemple : les tableaux de données dans les pages de gestion des utilisateurs, des produits, des articles, etc.


import React, { useState } from 'react';
// importation de React, useState ce sont des objets qui permettent de gerer les données dans les components
// car on a besoin de gerer les données dans les components
// exemple : les tableaux de données dans les pages de gestion des utilisateurs, des produits, des articles, etc.

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
} 
from '@tanstack/react-table';
import { Input } from '@/components/ui/input'; // importation de Input ce sont des objets provenant de components ui de react
import { Button } from '@/components/ui/button'; // importation de Button ce sont des objets provenant de components ui de react
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  className?: string;
  withColumnVisibility?: boolean;
  onRowClick?: (row: TData) => void;
  noResultsMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder = "Rechercher...",
  className,
  withColumnVisibility = true,
  onRowClick,
  noResultsMessage = "Aucun résultat trouvé."
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});


  // creation du tableau de données
  // on utilise useReactTable pour creer le tableau de données
  // on utilise les objets provenant de @tanstack/react-table pour creer le tableau de données

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // creation de la fonction pour gerer le clic sur une ligne du tableau de données
  // on utilise onRowClick pour gerer le clic sur une ligne du tableau de données
  // on utilise row.original pour acceder aux données de la ligne 
  const handleRowClick = (row: any) => {
    if (onRowClick) {
      onRowClick(row.original);
    }
  };

  // creation du composant DataTable
  // on utilise cn pour gerer les classes css
  // on utilise className pour gerer les classes css
  // on utilise searchColumn pour gerer la recherche dans le tableau de données
  // on utilise searchPlaceholder pour gerer le placeholder de la recherche dans le tableau de données
  // on utilise withColumnVisibility pour gerer la visibilité des colonnes dans le tableau de données
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        {searchColumn && (
          <div className="flex items-center relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchColumn)?.setFilterValue(event.target.value)
              }
              className="pl-9 pr-4 py-2 text-sm border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        )}
        
        {withColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colonnes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-gray-50 dark:bg-gray-800/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b transition-colors border-gray-200 dark:border-gray-800">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleRowClick(row)}
                    className={cn(
                      "border-b transition-colors border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/75",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="h-24 px-4 text-center align-middle text-gray-500 dark:text-gray-400"
                  >
                    {noResultsMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-2 pt-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page {table.getState().pagination.pageIndex + 1} sur{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-0.5 flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Première page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Page précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Page suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Dernière page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 