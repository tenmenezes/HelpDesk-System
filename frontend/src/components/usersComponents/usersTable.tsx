import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Card, CardContent} from "../ui/card";

export default function UsersTable() {
  return (
    <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
      <CardContent className="m-2">
        <DataTable columns={columns} />
      </CardContent>
    </Card>
  );
}
