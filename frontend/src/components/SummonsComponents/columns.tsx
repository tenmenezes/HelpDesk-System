"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Settings2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Summon } from "./types";
import { useState } from "react";
import { ChamadoDetailsModal } from "../SummonDetailsModal";
import { UpdateStatusModal } from "../UpdateStatusModal";
import { toast } from "sonner";

export const createColumns = (onRefresh: () => void): ColumnDef<Summon>[] => [
  {
    accessorKey: "usuario_nome",
    header: "Usuário",
    cell: ({ row }) => {
      const summon = row.original;
      const fotoUrl =
        summon.usuario_foto_url ||
        (summon.usuario_foto && summon.usuario_foto !== "default-user.png"
          ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/usuarios/${summon.usuario_foto}`
          : undefined);

      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={fotoUrl} alt={summon.usuario_nome} />
            <AvatarFallback>{summon.usuario_nome[0]}</AvatarFallback>
          </Avatar>
          <span>{summon.usuario_nome}</span>
        </div>
      );
    },
  },
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
      const summon = row.original;
      const [openDetails, setOpenDetails] = useState(false);
      
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
                  navigator.clipboard.writeText(summon.id_chamado.toString());
                  toast.success("ID copiado para a área de transferência!");
                }}
              >
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setOpenDetails(true)}>
                Ver detalhes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ChamadoDetailsModal
            chamado={summon}
            open={openDetails}
            onOpenChange={setOpenDetails}
          />
        </>
      );
    },
  },
];
