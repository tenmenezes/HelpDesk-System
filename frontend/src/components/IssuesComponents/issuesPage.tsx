"use client"

import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AlertCircle } from "lucide-react";

import { useIssues } from "@/hooks/useIssues";

export default function IssuesPage() {
  const { issues, mutate } = useIssues();

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
        <CardHeader>
          <CardTitle className="text-center">Tabela de ocorrências</CardTitle>
        </CardHeader>
        <CardContent className="m-2">
          <DataTable columns={columns} data={issues} />
        </CardContent>
      </Card>
    </>
  );
}
