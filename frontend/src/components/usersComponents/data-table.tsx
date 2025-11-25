"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useSWR, { mutate } from "swr";

import { Loader, SearchXIcon, UserPlusIcon } from "lucide-react";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import ProfileForm from "./FormActionsComponent/AddUserForm";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setglobalFilter] = useState("");

  const fetcher = async () => {
    const res = await fetch(
      "http://localhost:8000/routes/usuarios/read.php"
    );
    return res.json();
  };

  const { data, isLoading } = useSWR("usuarios", fetcher);

  const filteredData = data
    ? data.filter((u: any) =>
        Object.values(u)
          .join(" ")
          .toLowerCase()
          .includes(globalFilter.toLowerCase())
      )
    : [];

  const table = useReactTable({
    data: filteredData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setglobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <>
      <div className="w-full flex items-center justify-between gap-2 mb-2">
        <Input
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setglobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-8 w-8 cursor-pointer">
              <UserPlusIcon className="h-8 w-8 text-green-600" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Funcionário</DialogTitle>
            </DialogHeader>

            <ProfileForm />
          </DialogContent>
        </Dialog>
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="w-full flex justify-center items-center">
                    <Loader className="h-8 w-8 animate-spin transition" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
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
                  <div className="w-auto flex items-center justify-center gap-2">
                    <SearchXIcon className="h-6 w-6 text-red-600" />{" "}
                    <span className="text-red-600 font-bold">
                      Nenhum registro encontrado.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
