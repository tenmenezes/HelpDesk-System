import { UsersRoundIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Users() {
  return (
    <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
      <CardHeader>
        <div className="w-auto flex items-center justify-between">
          <CardTitle>Usuários</CardTitle>
          <UsersRoundIcon className="h-6 w-6" />
        </div>
        <CardDescription>Página de usuários</CardDescription>
      </CardHeader>
    </Card>
  );
}
