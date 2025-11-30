import { columns } from "./columns";
import { summons } from "./data";
import { DataTable } from "./data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TicketCheckIcon } from "lucide-react";

export default function SummonsPage() {
  return (
    <>
      <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
        <CardHeader>
          <div className="w-auto flex items-center justify-between">
            <CardTitle>Chamados</CardTitle>
            <TicketCheckIcon className="h-6 w-6" />
          </div>
          <CardDescription>
            Página contendo seus chamados registrados, podendo editar, excluir
            ou inserir novos chamados.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
        <CardContent className="m-2">
          <DataTable columns={columns} data={summons} />
        </CardContent>
      </Card>
    </>
  );
}
