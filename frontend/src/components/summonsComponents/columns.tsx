"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CircleCheck,
  CircleDollarSignIcon,
  Delete,
  DeleteIcon,
  MoreVerticalIcon,
  PenLine,
  TrashIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export type Char = {
  id: string;
  name: string;
  gender: string;
  image: string;
};

export const columns: ColumnDef<Char>[] = [
  {
    accessorKey: "image",
    header: () => "Avatar",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "gender",
    header: () => "Gênero",
  },
  {
    accessorKey: "actions",
    header: "Ações",
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              <PenLine className="h-4 w-4 text-blue-500" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              {" "}
              <span className="text-red-500 w-auto flex gap-2 cursor-pointer items-center">
                <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-700" />{" "}
                Excluir
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// pra uma proxima ocasião

//{
// accessorKey: "status",
// header: () => (
// <div className="w-auto flex gap-2 items-center">
//   <CircleCheck className="h-3 w-3 text-gray-600" /> Status
//   </div>
//   ),
// cell: ({ row }) => {
//     const status = row.original.status;
// const statusColors: Record<string, string> = {
//     pending: "text-orange-600",
//       processing: "text-blue-600",
// success: "text-green-600",
//   failed: "text-red-600",
//   };
//     return (
//       <span className={statusColors[status] || "text-gray-500"}>/
//         {status}
//        </span>
//     );
//   },
// },
