"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";

interface ChamadoDetailsProps {
  chamado: {
    id_chamado: number;
    titulo: string;
    descricao: string;
    status: string;
    prioridade: string;
    criado_em: string;
    atualizado_em: string;
    setor_nome: string;
    usuario_nome: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChamadoDetailsModal({
  chamado,
  open,
  onOpenChange,
}: ChamadoDetailsProps) {
  const statusColors: Record<string, string> = {
    aberto: "bg-orange-100 text-orange-800 border-orange-200",
    andamento: "bg-blue-100 text-blue-800 border-blue-200",
    resolvido: "bg-green-100 text-green-800 border-green-200",
    cancelado: "bg-red-100 text-red-800 border-red-200",
  };

  const prioridadeColors: Record<string, string> = {
    baixa: "bg-gray-100 text-gray-800 border-gray-200",
    media: "bg-yellow-100 text-yellow-800 border-yellow-200",
    alta: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Chamado #{chamado.id_chamado}</DialogTitle>
          <DialogDescription>
            Informações completas sobre o chamado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">
              Título
            </h3>
            <p className="text-lg">{chamado.titulo}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">
              Descrição
            </h3>
            <p className="text-base whitespace-pre-wrap">{chamado.descricao}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Status
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                  statusColors[chamado.status] || statusColors.aberto
                }`}
              >
                {chamado.status}
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Prioridade
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                  prioridadeColors[chamado.prioridade] || prioridadeColors.media
                }`}
              >
                {chamado.prioridade}
              </span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Setor
              </h3>
              <p>{chamado.setor_nome}</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Usuário
              </h3>
              <p>{chamado.usuario_nome}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Criado em
              </h3>
              <p>
                {new Date(chamado.criado_em).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Atualizado em
              </h3>
              <p>
                {new Date(chamado.atualizado_em).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
