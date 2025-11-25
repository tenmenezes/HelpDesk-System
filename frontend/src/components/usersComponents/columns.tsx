"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActionsCell } from "../actions-cells";

export type Usuario = {
  id_usuario: number;
  nome: string;
  email: string;
  telefone: string;
  id_setor: string;
  tipo: "comum" | "suporte" | "admin";
  foto_url: string | null;
};

export const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "foto_url",
    header: () => "Perfil",
    cell: ({ row }) => {
      const foto = row.original.foto_url;

      return (
        <Avatar className="w-12 h-12">
          {foto ? (
            <AvatarImage src={foto} alt={row.original.nome} />
          ) : (
            <AvatarFallback>
              <User className="w-6 h-6" />
            </AvatarFallback>
          )}
        </Avatar>
      );
    },
  },
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: () => "E-mail",
  },
  {
    accessorKey: "telefone",
    header: () => "Telefone",
  },
  {
    accessorKey: "setor",
    header: () => "Setor",
  },
  {
    accessorKey: "tipo",
    header: () => "Tipo",
    cell: ({ row }) => {
      const tipo = row.original.tipo;
      const CorTipo: Record<string, string> = {
        comum: "text-green-600",
        suporte: "text-blue-600",
        admin: "text-red-800",
      };
      return <span className={CorTipo[tipo] || "text-gray-500"}>{tipo}</span>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
