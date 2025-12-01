"use client";

import { Button } from "@/components/ui/button";
import { mutate } from "swr";
import { toast } from "sonner";

interface DeleteUserProps {
  id: number;
  nome: string;
  onClose: () => void;
}

export function DeleteUser({ id, nome, onClose }: DeleteUserProps) {
  console.log("ID recebido no DeleteUserModal:", id);
  async function handleDelete() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/routes/usuarios/delete.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    if (!res) {
      toast.warning("Aviso: Falha ao realizar o fetch de 'handleDelete'.");
      return null;
    }

    const data = await res.json();

    if (data.success) {
      mutate("usuarios");
      toast.success("Usuário excluído.");
      onClose();
    } else {
      return (
        toast.error("Erro ao excluir usuário.")
      );
    }
  }

  return (
    <>
      <div className="space-y-4">
        <p>
          Deseja realmente excluir o usuário <b>{nome}</b>?
          <span className="text-red-600 font-bold"> Essa ação é irreversível.</span>
        </p>

        <div className="flex gap-2 justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancelar
          </Button>

          <Button
            onClick={handleDelete}
            className="cursor-pointer hover:bg-red-700 transition-colors border"
          >
            Excluir
          </Button>
        </div>
      </div>
    </>
  );
}
