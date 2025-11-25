"use client";

import { UsersRoundIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function UsersPage() {
  return (
    <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
      <CardHeader>
        <div className="w-auto flex items-center justify-between">
          <CardTitle>Usuários</CardTitle>
          <UsersRoundIcon className="h-6 w-6" />
        </div>
        <CardDescription>Aba com todos os usuários cadastrados no sistema, podendo ser feito a adição, edição ou deleção de algum usuário.</CardDescription>
      </CardHeader>

      <CardContent className="m-2">
        <DataTable columns={columns} />
      </CardContent>
    </Card>
  );
}
