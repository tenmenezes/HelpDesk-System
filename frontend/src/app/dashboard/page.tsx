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
  Users,
  LoaderCircle,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import TicketsPorSetor from "@/components/view";
import { getAllChamados } from "@/components/services/chamados";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    novosUsuarios: 0,
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
        novosUsuarios: 0, // Implementar busca de usuários se necessário
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
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

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
                  {loading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <p className="text-base sm:text-lg font-bold text-blue-700">
                      {stats.totalTickets}
                    </p>
                  )}
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
                  {loading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <p className="text-base sm:text-lg font-bold text-purple-700">
                      {stats.novosUsuarios}
                    </p>
                  )}
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
                  {loading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
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
                  <Percent className="w-6 h-6 text-green-600" />
                </div>
                <CardDescription>Eficiência</CardDescription>
                <CardContent className="w-full flex items-center gap-2 text-green-700">
                  {loading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
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
