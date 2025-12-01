"use client";

import { TicketCheckIcon, LoaderCircle } from "lucide-react";
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

export default function MySummonsPage() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChamado, setEditingChamado] = useState<Chamado | null>(null);
  const [open, setOpen] = useState(false);

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

  const handleEdit = (chamado: Chamado) => {
    setEditingChamado(chamado);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingChamado(null);
    loadChamados();
  };

  const columns = createColumns(handleEdit, loadChamados);

  return (
    <>
      <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
        <CardHeader>
          <div className="w-auto flex items-center justify-between">
            <CardTitle>Meus Chamados</CardTitle>
            <TicketCheckIcon className="h-6 w-6" />
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
            <DataTable columns={columns} data={chamados} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
