"use client";

import { TicketCheckIcon, LoaderCircle, Plus } from "lucide-react"; // Adicionei Plus
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { useAuth } from "@/context/AuthContext";
import { getUserChamados } from "../services/chamados";
import { Chamado } from "./types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Import Button
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components
import { ChamadoForm } from "./SummonForm"; // Import Form

export default function MySummonsPage() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChamado, setEditingChamado] = useState<Chamado | null>(null);
  const [open, setOpen] = useState(false); // Estado do modal controlado aqui

  const loadChamados = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getUserChamados(user.id);
      setChamados(data);
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadChamados();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  // Função chamada ao clicar em Editar na coluna
  const handleEdit = (chamado: Chamado) => {
    setEditingChamado(chamado);
    setOpen(true);
  };

  // Função chamada ao fechar o modal (sucesso ou cancelamento)
  const handleClose = () => {
    setOpen(false);
    setEditingChamado(null);
    loadChamados(); // Atualiza a lista principal
  };

  const columns = createColumns(handleEdit, loadChamados);

  return (
    <>
      <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
        <CardHeader>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Meus Chamados</CardTitle>
              <TicketCheckIcon className="h-6 w-6" />
            </div>

            {/* <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setEditingChamado(null)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingChamado ? "Editar Chamado" : "Novo Chamado"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingChamado
                      ? "Edite as informações do chamado"
                      : "Preencha os dados para criar um novo chamado"}
                  </DialogDescription>
                </DialogHeader>
                <ChamadoForm chamado={editingChamado} onSuccess={handleClose} />
              </DialogContent>
            </Dialog> */}
          </div>
          <CardDescription>
            Todos os chamados cadastrados e enviados por você na plataforma.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
        <CardContent className="m-2">
          {loading ? (
            <div className="text-center py-8 w-auto flex gap-4 items-center justify-center">
              <LoaderCircle className="h-8 w-8 animate-spin" />
              Processando...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={chamados}
              // Passando o Dialog inteiro (novo chamado) como prop
              headerActions={
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="cursor-pointer w-full md:w-auto"
                      variant="outline"
                      onClick={() => setEditingChamado(null)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingChamado ? "Editar Chamado" : "Novo Chamado"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingChamado
                          ? "Edite as informações do chamado"
                          : "Preencha os dados para criar um novo chamado"}
                      </DialogDescription>
                    </DialogHeader>
                    <ChamadoForm
                      chamado={editingChamado}
                      onSuccess={handleClose}
                    />
                  </DialogContent>
                </Dialog>
              }
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
