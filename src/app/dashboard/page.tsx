"use client";

import { useEffect, useState } from "react";

import Chart from "@/components/chart";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import {
  PageTransition,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion-primitives";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import { getAllChamados } from "@/components/services/chamados";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TicketsPorSetor from "@/components/view";
import {
  AlertCircle,
  ArrowBigUpDash,
  Loader,
  Percent,
  TagIcon,
  Ticket,
} from "lucide-react";

type DashboardStats = {
  totalTickets: number;
  prioridadeAlta: number;
  ticketsHoje: number;
  ticketsResolvidos: number;
  eficiencia: number;
};

type ChamadoResumo = {
  criado_em: string;
  prioridade: string;
  status: string;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
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
      const chamados = (await getAllChamados()) as ChamadoResumo[];

      const agora = new Date();
      const hoje = new Date(agora);
      hoje.setHours(0, 0, 0, 0);

      const ultimas24h = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

      const altaPrioridade = chamados.filter(
        (chamado) =>
          chamado.prioridade === "alta" &&
          chamado.status !== "resolvido" &&
          chamado.status !== "cancelado"
      ).length;

      const ticketsHoje = chamados.filter(
        (chamado) => new Date(chamado.criado_em) >= hoje
      ).length;

      const tickets24h = chamados.filter(
        (chamado) => new Date(chamado.criado_em) >= ultimas24h
      ).length;

      const resolvidos = chamados.filter(
        (chamado) => chamado.status === "resolvido"
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
      console.error("Erro ao carregar estatisticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ProtectedRoute roles={["suporte", "admin"]}>
      <Sidebar />

      <PageTransition className="sm:ml-14 p-4">
        <StaggerContainer className="space-y-4">
          <StaggerContainer className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StaggerItem>
              <Card className="border border-red-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl sm:text-2xl select-none">
                      Alta Prioridade
                    </CardTitle>
                    <AlertCircle className="hidden text-red-600 md:block md:h-8 md:w-8" />
                  </div>
                  <CardDescription>Ultimas 24h</CardDescription>
                  <CardContent>
                    {loading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <p className="text-base font-bold text-red-700 sm:text-lg">
                        {stats.prioridadeAlta}
                      </p>
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border border-blue-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl sm:text-2xl select-none">
                      Total de Tickets
                    </CardTitle>
                    <Ticket className="hidden text-blue-600 md:block md:h-8 md:w-8" />
                  </div>
                  <CardDescription>Ultimas 24h</CardDescription>
                  <CardContent>
                    {loading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <p className="text-base font-bold text-blue-700 sm:text-lg">
                        {stats.totalTickets}
                      </p>
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border border-yellow-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl sm:text-2xl select-none">
                      Tickets de Hoje
                    </CardTitle>
                    <TagIcon className="hidden text-yellow-600 md:block md:h-8 md:w-8" />
                  </div>
                  <CardDescription>Total do dia</CardDescription>
                  <CardContent>
                    {loading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <p className="text-base font-bold text-yellow-700 sm:text-lg">
                        {stats.ticketsHoje}
                      </p>
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border border-green-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl sm:text-2xl select-none">
                      Tickets Resolvidos
                    </CardTitle>
                    <Percent className="hidden text-green-600 md:block md:h-8 md:w-8" />
                  </div>
                  <CardDescription>Eficiencia</CardDescription>
                  <CardContent className="flex w-full items-center gap-2 text-green-700">
                    {loading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <ArrowBigUpDash className="h-4 w-4" />
                        <p className="text-base font-bold sm:text-lg">
                          {stats.eficiencia}%
                        </p>
                      </>
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            </StaggerItem>
          </StaggerContainer>

          <StaggerItem>
            <section>
              <ChartAreaInteractive />
            </section>
          </StaggerItem>

          <StaggerItem>
            <section className="flex flex-col gap-4 md:flex-row">
              <Chart />
              <TicketsPorSetor filtro="7d" />
            </section>
          </StaggerItem>
        </StaggerContainer>
      </PageTransition>
    </ProtectedRoute>
  );
}
