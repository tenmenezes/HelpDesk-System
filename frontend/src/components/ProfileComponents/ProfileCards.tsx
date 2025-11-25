import { UserRound } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function ProfileCard() {
    return (
      <Card className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4">
        <CardHeader>
          <div className="w-auto flex items-center justify-between">
            <CardTitle>Perfil do usário</CardTitle>
            <UserRound className="h-6 w-6" />
          </div>
          <CardDescription>Perfil com dados sensíveis do usuário.</CardDescription>
        </CardHeader>
      </Card>
    );
}