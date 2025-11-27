"use client";

import { TicketCheckIcon, TicketMinusIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { DataTableChamados } from "./data-table";
import { columns } from "./columns";
import { useAuth } from "@/context/AuthContext";
import { getUserChamados } from "../services/chamados";

export default function MySummonsPage() {
  const { user } = useAuth();
  const userId = Number(user?.id);

  return (
    <>
      {/* Card 1 - Cabeçalho */}
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

      {/* Card 2 - Tabela */}
      <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
        <CardHeader>
          <div className="w-auto flex items-center justify-between">
            <CardTitle>Tabela de Chamados</CardTitle>
            <TicketMinusIcon className="h-6 w-6" />
          </div>
        </CardHeader>

        <CardContent className="m-2">
          <DataTableChamados
            columns={columns}
            swrKey={user ? `/chamados/user/${user.id}` : null}
            fetcher={(id) => getUserChamados(id)}
            userId={userId}
          />
        </CardContent>
      </Card>
    </>
  );
}
