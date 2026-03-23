"use client";

import { Table } from "@tanstack/react-table";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "./ui/button";

type PaginationProps<TData> = {
  table: Table<TData>;
};

export default function Pagination<TData>({ table }: PaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = Math.max(table.getPageCount(), 1);

  return (
    <div className="flex items-center justify-center gap-10 py-4">
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
        Pagina {currentPage} de {totalPages}
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
  );
}
