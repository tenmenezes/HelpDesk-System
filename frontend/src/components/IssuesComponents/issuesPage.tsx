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
import { AlertCircle, LoaderCircle } from "lucide-react";
import { getAllChamados } from "../services/chamados";
import { Issue } from "./types";
import { useEffect, useState } from "react";

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const data = await getAllChamados();
      setIssues(data || []);
    } catch (error) {
      console.error("Erro ao carregar incidentes:", error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const columns = createColumns(loadIssues);

  return (
    <>
      <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4">
        <CardHeader>
          <div className="w-auto flex items-center justify-between">
            <CardTitle>Incidentes</CardTitle>
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardDescription>Página de incidentes</CardDescription>
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
            <DataTable columns={columns} data={issues} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
