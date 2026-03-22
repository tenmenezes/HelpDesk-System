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
import {
  ArrowBigUpDash,
  Percent,
  TagIcon,
  Ticket,
  AlertCircle,
  Loader,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import TicketsPorSetor from "@/components/view";
import { getAllChamados } from "@/components/services/chamados";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    prioridadeAlta: 0,
    ticketsHoje: 0,
    ticketsResolvidos: 0,
    eficiencia: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const chamados = await getAllChamados();

      const agora = new Date();
      const hoje = new Date(agora);
      hoje.setHours(0, 0, 0, 0);

      const ultimas24h = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

      const altaPrioridade = chamados.filter(
        (c: any) => 
          c.prioridade === "alta" &&
          c.status !== "resolvido" &&
          c.status !== "cancelado"
      ).length

      const ticketsHoje = chamados.filter(
        (c: any) => new Date(c.criado_em) >= hoje
      ).length;

      const tickets24h = chamados.filter(
        (c: any) => new Date(c.criado_em) >= ultimas24h
      ).length;

      const resolvidos = chamados.filter(
        (c: any) => c.status === "resolvido"
      ).length;

      const eficiencia =
        chamados.length > 0
          ? Math.round((resolvidos / chamados.length) * 100)
          : 0;

      setStats({
        totalTickets: tickets24h,
        prioridadeAlta: altaPrioridade,
        ticketsHoje,
        ticketsResolvidos: resolvidos,
        eficiencia,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // Atualiza a cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ProtectedRoute roles={["suporte", "admin"]}>
        <Sidebar />
        <main className="sm:ml-14 p-4">
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-red-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl select-none">
                    Alta Prioridade
                  </CardTitle>
                  <AlertCircle className="hidden md:block md:w-8 md:h-8 text-red-600 animate-pulse" />
                </div>
                <CardDescription>Últimas 24h</CardDescription>
                <CardContent>
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <p className="text-base sm:text-lg font-bold text-red-700">
                      {stats.prioridadeAlta}
                    </p>
                  )}
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border border-blue-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl select-none">
                    Total de Tickets
                  </CardTitle>
                  <Ticket className="hidden md:block md:w-8 md:h-8 text-blue-600 animate-pulse" />
                </div>
                <CardDescription>Últimas 24h</CardDescription>
                <CardContent>
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <p className="text-base sm:text-lg font-bold text-blue-700">
                      {stats.totalTickets}
                    </p>
                  )}
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border border-yellow-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl select-none">
                    Tickets de Hoje
                  </CardTitle>
                  <TagIcon className="hidden md:block md:w-8 md:h-8 text-yellow-600 animate-pulse" />
                </div>
                <CardDescription>Total do dia</CardDescription>
                <CardContent>
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <p className="text-base sm:text-lg font-bold text-yellow-700">
                      {stats.ticketsHoje}
                    </p>
                  )}
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border border-green-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl select-none">
                    Tickets Resolvidos
                  </CardTitle>
                  <Percent className="hidden md:block md:w-8 md:h-8 text-green-600 animate-pulse" />
                </div>
                <CardDescription>Eficiência</CardDescription>
                <CardContent className="w-full flex items-center gap-2 text-green-700">
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ArrowBigUpDash className="h-4 w-4" />
                      <p className="text-base sm:text-lg font-bold">
                        {stats.eficiencia}%
                      </p>
                    </>
                  )}
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
