"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "../ui/button";
import Image from "next/image";
import { ActionsCell } from "../actions-cells";


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
    cell: ({ row }) => {
      const imageURL = row.original.image;

      return (
        <Image
          src={imageURL}
          alt={row.original.name}
          quality={100}
          width={60}
          height={60}
          className="rounded-full object-cover"
        />
      );
    },
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
    cell: ({ row }) => <ActionsCell row={row} />,
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
