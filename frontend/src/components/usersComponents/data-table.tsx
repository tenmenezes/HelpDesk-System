"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
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
import useSWR from "swr";

import { CircleFadingPlus, Loader, SearchXIcon, UserPlusIcon } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import ProfileForm from "./FormActionsComponent/AddUserForm";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const fetcher = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/routes/usuarios/read.php`
    );

    if (!res) {
      toast.error("Falha ao realizar fetch, dados não salvos na varável 'res' em data-table.tsx 'fetcher'.")
    }

    return res.json();
  };

  const { data, isLoading } = useSWR("usuarios", fetcher);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
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
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer" variant="ghost">
              <CircleFadingPlus className="h-40 w-40 text-green-600" />
            </Button>
          </DialogTrigger>

          <DialogContent className="w-auto h-auto flex items-center flex-col justify-center">
              <DialogHeader>
                <DialogTitle>Novo Usuário</DialogTitle>
                <DialogDescription>
                  Formulário para adicionar novos usuários da empresa
                </DialogDescription>
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
                  <div className="w-auto h-auto flex justify-center items-center">
                    <Loader className="h-8 w-8 animate-spin transition" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
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
                    <SearchXIcon className="h-6 w-6 text-red-600" />
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
