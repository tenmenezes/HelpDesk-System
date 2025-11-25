"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings2, UserRoundPen, UserRoundX } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { Char } from "./usersComponents/columns";

export function ActionsCell({ row }: { row: Row<Char>}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const char = row.original;

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <Settings2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          <hr className="mb-1" />

          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <UserRoundPen className="h-4 w-4 text-blue-500" />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{char.name}</DialogTitle>
              </DialogHeader>

              <div>Formulário de edição...</div>
            </DialogContent>
          </Dialog>

          <DropdownMenuSeparator />

          <Dialog open={openDelete} onOpenChange={setOpenDelete}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <UserRoundX className="h-4 w-4 text-red-500" />
                Excluir
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
              </DialogHeader>
              <p>
                Tem certeza que deseja excluir <b>{char.name}</b>?{" "}
                <b className="text-red-600">Esta ação não poderá ser desfeita.</b>
              </p>
              <div className="flex justify-between gap-2 mt-4">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setOpenDelete(false)}
                >
                  Cancelar
                </Button>
                <Button variant="destructive" className="cursor-pointer">Excluir</Button>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
