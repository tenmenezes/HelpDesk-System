"use client";

import Chart from "@/components/chart";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowBigUpDash, Percent, TagIcon, Ticket, Users } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import TicketsPorSetor from "@/components/view";

export default function Dashboard() {
  return (
    <>
      <ProtectedRoute roles={["suporte", "admin"]}>
        <Sidebar />
        <main className="sm:ml-14 p-4">
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-blue-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl select-none">
                    Total de Tickets
                  </CardTitle>
                  <Ticket className="w-6 h-6 text-blue-600" />
                </div>
                <CardDescription>Últimas 24h</CardDescription>

                <CardContent>
                  <p className="text-base sm:text-lg font-bold text-blue-700">
                    200
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border border-purple-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl select-none">
                    Novos Usuários
                  </CardTitle>
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardDescription>Últimas 24h</CardDescription>

                <CardContent>
                  <p className="text-base sm:text-lg font-bold text-purple-700">
                    20
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border border-yellow-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl select-none">
                    Tickets Hoje
                  </CardTitle>
                  <TagIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <CardDescription>Total do dia</CardDescription>

                <CardContent>
                  <p className="text-base sm:text-lg font-bold text-yellow-700">
                    5
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border border-green-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl select-none">
                    Tickets Resolvidos
                  </CardTitle>
                  <Percent className="w-6 h-6 text-green-600" />
                </div>
                <CardDescription>Eficiência</CardDescription>

                <CardContent className="w-full flex items-center gap-2 text-green-700">
                  <ArrowBigUpDash className="h-4 w-4" />
                  <p className="text-base sm:text-lg font-bold">45%</p>
                </CardContent>
              </CardHeader>
            </Card>
          </section>

          <section className="mt-4">
            <ChartAreaInteractive />
          </section>

          <section className="mt-4 flex flex-col md:flex-row gap-4">
            <Chart />
            <TicketsPorSetor filtro="7d" />
          </section>
        </main>
      </ProtectedRoute>
    </>
  );
}
