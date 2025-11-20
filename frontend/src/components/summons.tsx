import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketCheckIcon } from "lucide-react";

export default function Summons() {
    return (
        <Card className="mt-4 ml-18 mr-4">
          <CardHeader>
            <div className="w-auto flex items-center justify-between">
              <CardTitle>Chamados</CardTitle>
              <TicketCheckIcon className="h-6 w-6" />
            </div>
            <CardDescription>Página de chamados</CardDescription>
          </CardHeader>
        </Card>
    );
}