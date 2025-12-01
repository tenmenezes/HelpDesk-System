"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, ArrowUpDown, Settings2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Chamado } from "./types";
import { updateChamado } from "../services/chamados";
import { toast } from "sonner";
import { DeleteChamado } from "./DeleteSummonModal";
import { useState } from "react";

export const createColumns = (
  onEdit: (chamado: Chamado) => void,
  onRefresh: () => void
): ColumnDef<Chamado>[] => [
  {
    accessorKey: "titulo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "setor_nome",
    header: "Setor",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const chamado = row.original;

      return (
        <Select
          value={chamado.status}
          onValueChange={async (value) => {
            try {
              const res = await updateChamado({
                id_chamado: chamado.id_chamado,
                status: value as Chamado["status"],
              });

              if (res.success) {
                toast.success("Status atualizado com sucesso!");
                onRefresh();
              } else {
                toast.error(res.message || "Erro ao atualizar status");
              }
            } catch (error) {
              toast.error("Erro ao atualizar status");
            }
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aberto">Aberto</SelectItem>
            <SelectItem value="andamento">Em Andamento</SelectItem>
            <SelectItem value="resolvido">Resolvido</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "prioridade",
    header: "Prioridade",
    cell: ({ row }) => {
      const chamado = row.original;

      return (
        <Select
          value={chamado.prioridade}
          onValueChange={async (value) => {
            try {
              const res = await updateChamado({
                id_chamado: chamado.id_chamado,
                prioridade: value as Chamado["prioridade"],
              });

              if (res.success) {
                toast.success("Prioridade atualizada com sucesso!");
                onRefresh();
              } else {
                toast.error(res.message || "Erro ao atualizar prioridade");
              }
            } catch (error) {
              toast.error("Erro ao atualizar prioridade");
            }
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "criado_em",
    header: "Criado em",
    cell: ({ row }) => {
      const date = new Date(row.original.criado_em);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const chamado = row.original;
      const [openDelete, setOpenDelete] = useState(false);

      return (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Abrir menu</span>
                <Settings2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(chamado.id_chamado.toString())
                }
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(chamado)}>
                Editar chamado
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer text-red-600"
                  >
                    Deletar chamado
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar exclusão</DialogTitle>
                  </DialogHeader>
                  <DeleteChamado
                    id_chamado={chamado.id_chamado}
                    titulo={chamado.titulo}
                    onClose={() => setOpenDelete(false)}
                    onSuccess={onRefresh}
                  />
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
