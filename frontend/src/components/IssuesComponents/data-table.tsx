"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import { ArrowLeft, ArrowRight, DownloadIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import NotFound from "../NotFound";
import { exportTableToPDF } from "@/utils/exportPDF";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleExportPDF = () => {
    const columnDefs = columns
      .filter((col) => col.id !== "actions" && col.accessorKey)
      .map((col) => ({
        key: col.accessorKey as string,
        label:
          typeof col.header === "function"
            ? "Coluna"
            : (col.header as string) || (col.accessorKey as string),
      }));

    exportTableToPDF(data as any[], columnDefs, "Relatório de Incidentes");
  };

  return (
    <>
      <div className="w-full flex items-center justify-between gap-2">
        <Input
          placeholder="Buscar por nome..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm mb-4"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={handleExportPDF}
            >
              <DownloadIcon className="h-8 w-8 text-green-700" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Exportar em PDF</TooltipContent>
        </Tooltip>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  <NotFound />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center space-x-2 py-4 gap-10">
        <Button
          variant="outline"
          className="cursor-pointer"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <span>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount() === 0
            ? table.getPageCount() + 1
            : table.getPageCount()}
        </span>

        <Button
          variant="outline"
          className="cursor-pointer"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
