"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Issue } from "./types";
import { useState } from "react";
import { ChamadoDetailsModal } from "../SummonDetailsModal";
import { UpdateStatusModal } from "../UpdateStatusModal";
import { toast } from "sonner";

export const createColumns = (onRefresh: () => void): ColumnDef<Issue>[] => [
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
    accessorKey: "usuario_nome",
    header: "Usuário",
  },
  {
    accessorKey: "setor_nome",
    header: "Setor",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const colors = {
        aberto: "text-orange-600",
        andamento: "text-blue-600",
        resolvido: "text-green-600",
        cancelado: "text-red-600",
      };

      return <span className={colors[status]}>{status}</span>;
    },
  },
  {
    accessorKey: "prioridade",
    header: "Prioridade",
    cell: ({ row }) => {
      const prioridade = row.original.prioridade;

      const colors = {
        baixa: "text-gray-600",
        media: "text-yellow-600",
        alta: "text-red-600",
      };

      return <span className={colors[prioridade]}>{prioridade}</span>;
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
      const issue = row.original;
      const [openDetails, setOpenDetails] = useState(false);
      const [openUpdate, setOpenUpdate] = useState(false);

      return (
        <>
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
                onClick={() => {
                  navigator.clipboard.writeText(issue.id_chamado.toString());
                  toast.success("ID copiado para a área de transferência!");
                }}
              >
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpenDetails(true)}>
                Ver detalhes
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                Atualizar status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ChamadoDetailsModal
            chamado={issue}
            open={openDetails}
            onOpenChange={setOpenDetails}
          />

          <UpdateStatusModal
            chamado={issue}
            open={openUpdate}
            onOpenChange={setOpenUpdate}
            onSuccess={onRefresh}
          />
        </>
      );
    },
  },
];
