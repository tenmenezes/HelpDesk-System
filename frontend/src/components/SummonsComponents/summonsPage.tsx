"use client";

import { createColumns } from "./columns";
import { DataTable } from "./data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TicketCheckIcon, LoaderCircle } from "lucide-react";
import { getAllChamados } from "../services/chamados";
import { Summon } from "./types";
import { useEffect, useState } from "react";

export default function SummonsPage() {
  const [summons, setSummons] = useState<Summon[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSummons = async () => {
    try {
      setLoading(true);
      const data = await getAllChamados();
      setSummons(data || []);
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
      setSummons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummons();
  }, []);

  const columns = createColumns(loadSummons);

  return (
    <>
      <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
        <CardHeader>
          <div className="w-auto flex items-center justify-between">
            <CardTitle>Chamados</CardTitle>
            <TicketCheckIcon className="h-6 w-6" />
          </div>
          <CardDescription>
            Página contendo todos os chamados registrados no sistema.
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
            <DataTable columns={columns} data={summons} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
