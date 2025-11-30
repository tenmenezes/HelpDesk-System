"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type Summon = {
  id_chamado: number;
  titulo: string;
  usuario: {
    nome: string;
    foto: string;
  };
  setor: string;
  status: "aberto" | "andamento" | "resolvido" | "cancelado";
  prioridade: "baixa" | "media" | "alta";
  criado_em: string;
};

export const columns: ColumnDef<Summon>[] = [
  {
    accessorKey: "usuario",
    header: "Usuário",
    cell: ({ row }) => {
      const { nome, foto } = row.original.usuario;

      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={foto} alt={nome} />
            <AvatarFallback>{nome[0]}</AvatarFallback>
          </Avatar>
          <span>{nome}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "titulo",
    header: "Título",
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
      const p = row.original.prioridade;

      const colors = {
        baixa: "text-gray-600",
        media: "text-yellow-600",
        alta: "text-red-600",
      };

      return <span className={colors[p]}>{p}</span>;
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
      const summon = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>

            <DropdownMenuItem>Atualizar status</DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(summon.id_chamado.toString())
              }
            >
              Copiar ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
