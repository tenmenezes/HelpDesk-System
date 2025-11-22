"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import useSWR from "swr";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader, SearchXIcon, UserPlusIcon } from "lucide-react";
import { getCharService } from "./service";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setglobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data, isValidating } = useSWR([pagination.pageIndex, globalFilter], () => {
    return getCharService(pagination.pageIndex, globalFilter);
  });

  
  
  const table = useReactTable({
    data: data?.results || [],
    columns,
    manualPagination: true,
    rowCount: data?.info?.count || 0,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setglobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
  });

  return (
    <>
      <div className="w-full flex items-center justify-between gap-2 mb-2">
        <Input
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Button className="h-10 w-10 cursor-pointer">
          <UserPlusIcon className="h-8 w-8" />
        </Button>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isValidating ? (
                    <div className="w-full flex justify-center items-center">
                      {" "}
                      <Loader className="h-8 w-8 animate-spin transition" />
                    </div>
                  ) : (
                    <div className="w-auto flex items-center justify-center gap-2">
                      <SearchXIcon className="h-6 w-6 text-red-500" />{" "}
                      <span className=" text-red-600">
                        Nenhum registro encontrado.
                      </span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="mr-4">
          Página {pagination.pageIndex + 1} de 42
        </span>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => table.setPageIndex(table.getPageCount() - 42)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
