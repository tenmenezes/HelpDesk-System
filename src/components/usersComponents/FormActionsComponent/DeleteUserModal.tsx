"use client";

import { Button } from "@/components/ui/button";
import { mutate } from "swr";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useState } from "react";

interface DeleteUserProps {
  id: number;
  nome: string;
  onClose: () => void;
}

export function DeleteUser({ id, nome, onClose }: DeleteUserProps) {
  const [loading, setLoading] = useState(false);
  console.log("ID recebido no DeleteUserModal:", id);
  async function handleDelete() {
    try {
      setLoading(true);

      const res = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
      });

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
        return toast.error("Erro ao excluir usuário.");
      }
    } finally {
      setLoading(false);
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
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleDelete}
            disabled={loading}
            className="cursor-pointer hover:bg-red-700 transition-colors border"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader className="h-4 w-4 animate-spin transition" />
                <span>Excluindo...</span>
              </div>
            ) : (
              "Excluir"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
