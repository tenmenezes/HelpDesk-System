"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useState } from "react";
import { updateChamado } from "./services/chamados";
import { toast } from "sonner";

interface UpdateStatusProps {
  chamado: {
    id_chamado: number;
    titulo: string;
    status: string;
    prioridade: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UpdateStatusModal({
  chamado,
  open,
  onOpenChange,
  onSuccess,
}: UpdateStatusProps) {
  const [status, setStatus] = useState(chamado.status);
  const [prioridade, setPrioridade] = useState(chamado.prioridade);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await updateChamado({
        id_chamado: chamado.id_chamado,
        status,
        prioridade,
      });

      if (res.success) {
        toast.success("Chamado atualizado com sucesso!");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(res.message || "Erro ao atualizar chamado");
      }
    } catch (error) {
      toast.error("Erro ao atualizar chamado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Status - {chamado.titulo}</DialogTitle>
          <DialogDescription>
            Altere o status e prioridade do chamado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="andamento">Em Andamento</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Prioridade</Label>
            <Select value={prioridade} onValueChange={setPrioridade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}