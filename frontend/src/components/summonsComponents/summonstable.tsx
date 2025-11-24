import { columns } from "./columns";
import { payments } from "./data";
import { DataTable } from "./data-table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function UsersTable() {
  return (
    <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
      <CardHeader>
        <CardTitle className="text-center">Tabela de chamados</CardTitle>
      </CardHeader>
      <CardContent className="m-2">
        <DataTable columns={columns} data={payments} />
      </CardContent>
    </Card>
  );
}
