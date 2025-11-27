"use client"

import { columns } from "./columns";
import { DataTable } from "../SummonsComponents/data-table";
import { payments } from "./data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AlertCircle } from "lucide-react";

export default function IssuesPage() {

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
          <DataTable columns={columns} data={payments} />
        </CardContent>
      </Card>
    </>
  );
}
