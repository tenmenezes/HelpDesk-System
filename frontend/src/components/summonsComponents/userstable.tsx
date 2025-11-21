import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function UsersTable() {
  return (
    <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
      <CardHeader>
        <CardTitle className="text-center">Personagens de Rick e Morty</CardTitle>
      </CardHeader>
      <CardContent className="m-2">
        <DataTable columns={columns}/>
      </CardContent>
    </Card>
  );
}
