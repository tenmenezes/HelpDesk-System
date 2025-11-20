import { AlertCircle } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function Issues() {
    return (
      <Card className="mt-4 ml-18 mr-4">
      <CardHeader>
        <div className="w-auto flex items-center justify-between">
          <CardTitle>Incidentes</CardTitle>
          <AlertCircle className="h-6 w-6" />
        </div>
        <CardDescription>Página de incidentes</CardDescription>
      </CardHeader>
    </Card>
    );
}