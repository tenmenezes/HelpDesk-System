"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical, CheckCircle, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

import { Chamado } from "./types";

export const columns: ColumnDef<Chamado>[] = [
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-gray-600" />
        Status
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      const mapColors: Record<string, string> = {
        aberto: "text-red-600",
        andamento: "text-yellow-600",
        resolvido: "text-green-600",
        cancelado: "text-gray-500",
      };

      const labels: Record<string, string> = {
        aberto: "Aberto",
        andamento: "Em andamento",
        resolvido: "Resolvido",
        cancelado: "Cancelado",
      };

      return (
        <span className={mapColors[status] ?? "text-gray-500"}>
          {labels[status]}
        </span>
      );
    },
  },

  {
    accessorKey: "titulo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Título
        <ArrowUpDown className="h-4 w-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.titulo}</span>
    ),
  },

  {
    accessorKey: "setor",
    header: "Setor",
    cell: ({ row }) => row.original.setor ?? "-",
  },

  {
    accessorKey: "prioridade",
    header: () => (
      <div className="flex items-center gap-2">
        <Flag className="h-4 w-4 text-gray-600" />
        Prioridade
      </div>
    ),
    cell: ({ row }) => {
      const p = row.original.prioridade;

      const map = {
        baixa: "Baixa",
        media: "Média",
        alta: "Alta",
      };

      const color = {
        baixa: "text-green-600",
        media: "text-yellow-600",
        alta: "text-red-600",
      };

      return <span className={color[p]}>{map[p]}</span>;
    },
  },

  {
    accessorKey: "criado_em",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Criado em
        <ArrowUpDown className="h-4 w-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const d = new Date(row.original.criado_em);
      return (
        <div className="text-sm">
          <span>{d.toLocaleDateString("pt-BR")}</span>
          <div className="text-xs text-gray-500">
            {d.toLocaleTimeString("pt-BR")}
          </div>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const chamado = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                alert("Abrir modal de edição " + chamado.id_chamado)
              }
            >
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => alert("Excluir chamado " + chamado.id_chamado)}
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
