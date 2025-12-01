"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteChamado } from "../services/chamados";

interface DeleteChamadoProps {
  id_chamado: number;
  titulo: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteChamado({
  id_chamado,
  titulo,
  onClose,
  onSuccess,
}: DeleteChamadoProps) {
  async function handleDelete() {
    try {
      const res = await deleteChamado(id_chamado);

      if (res.success) {
        toast.success("Chamado excluído com sucesso!");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Erro ao excluir chamado.");
      }
    } catch (error) {
      console.error("Erro ao excluir chamado:", error);
      toast.error("Erro ao excluir chamado.");
    }
  }

  return (
    <>
      <div className="space-y-4">
        <p>
          Deseja realmente excluir o chamado <b>{titulo}</b>?
          <span className="text-red-600 font-bold">
            {" "}
            Essa ação é irreversível.
          </span>
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
            className="cursor-pointer hover:bg-red-700 transition-colors border bg-red-600 text-white"
          >
            Excluir
          </Button>
        </div>
      </div>
    </>
  );
}
