"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type Issue = {
  id_chamado: number;
  titulo: string;
  usuario: string;
  setor: string;
  status: "aberto" | "andamento" | "resolvido" | "cancelado";
  prioridade: "baixa" | "media" | "alta";
  criado_em: string;
};

export const columns: ColumnDef<Issue>[] = [
  {
    accessorKey: "titulo",
    header: "Título",
  },
  {
    accessorKey: "usuario",
    header: "Usuário",
  },
  {
    accessorKey: "setor",
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
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const issue = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(issue.id_chamado.toString())
              }
            >
              Copiar ID
            </DropdownMenuItem>

            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>

            <DropdownMenuItem>Atualizar status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
