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
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import NotFound from "../NotFound";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ChamadoForm } from "./ChamadoForm";
import { Chamado } from "./types";
import { createColumns } from "./columns";
import { getUserChamados } from "../services/chamados";
import { useAuth } from "@/context/AuthContext";

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

    const { user } = useAuth();
    const userId = Number(user?.id);
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingChamado, setEditingChamado] = useState<Chamado | null>(null);
    const [open, setOpen] = useState(false);

    const loadChamados = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await getUserChamados(user.id);
        setChamados(data);
      } catch (error) {
        console.error("Erro ao carregar chamados:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (user?.id) {
        loadChamados();
      } else {
        setLoading(false);
      }
    }, [user?.id]);

    const handleEdit = (chamado: Chamado) => {
      setEditingChamado(chamado);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setEditingChamado(null);
      loadChamados();
    };

  return (
    <>
      <div className="flex justify-between">
        <Input
          placeholder="Buscar por título..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm mb-4"
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingChamado ? "Editar Chamado" : "Novo Chamado"}
              </DialogTitle>
              <DialogDescription>
                {editingChamado
                  ? "Edite as informações do chamado"
                  : "Preencha os dados para criar um novo chamado"}
              </DialogDescription>
            </DialogHeader>
            <ChamadoForm chamado={editingChamado} onSuccess={handleClose} />
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
