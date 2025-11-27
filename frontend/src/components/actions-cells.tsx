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
import { Usuario } from "./usersComponents/columns";
import { EditUserForm } from "./usersComponents/FormActionsComponent/EditUserForm";
import { DeleteUser } from "./usersComponents/FormActionsComponent/DeleteUserModal";

export function ActionsCell({ row }: { row: Row<Usuario> }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const user = row.original;

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

          <DropdownMenuSeparator />

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
                <DialogTitle>{user.nome}</DialogTitle>
              </DialogHeader>

              <EditUserForm user={user} onClose={() => setOpenEdit(false)} />
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

              <DeleteUser
                id={user.id_usuario}
                nome={user.nome}
                onClose={() => setOpenDelete(false)}
              />
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
