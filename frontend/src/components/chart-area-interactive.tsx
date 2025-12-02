"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getAllChamados } from "./services/chamados";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

const chartConfig = {
  opened: { label: "Abertos", color: "var(--chart-1)" },
  closed: { label: "Resolvidos", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [chartData, setChartData] = useState<
    { date: string; opened: number; closed: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const chamados = await getAllChamados();
        const horaAtual = new Date();
        const ultimas24h = new Date(horaAtual.getTime() - 24 * 60 * 60 * 1000);

        // Agrupando por hora
        const hourlyData: Record<string, { opened: number; closed: number }> =
          {};

        chamados.forEach((c: any) => {
          const date = new Date(c.criado_em);
          if (date >= ultimas24h) {
            const hourKey = date.toISOString().slice(0, 13) + ":00:00";
            if (!hourlyData[hourKey]) {
              hourlyData[hourKey] = { opened: 0, closed: 0 };
            }
            hourlyData[hourKey].opened++;
            if (c.status === "resolvido") {
              hourlyData[hourKey].closed++;
            }
          }
        });

        const data = Object.entries(hourlyData)
          .map(([date, values]) => ({
            date,
            opened: values.opened,
            closed: values.closed,
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setChartData(data);
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Fluxo de Chamados</CardTitle>
          <CardDescription>
            Abertos x Resolvidos — últimas 24 horas
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <LoaderCircle className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-opened)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-opened)"
                    stopOpacity={0.1}
                  />
                </linearGradient>

                <linearGradient id="fillClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-closed)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-closed)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                  })
                }
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleString("pt-BR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="opened"
                type="natural"
                fill="url(#fillOpened)"
                stroke="var(--color-opened)"
                stackId="a"
              />

              <Area
                dataKey="closed"
                type="natural"
                fill="url(#fillClosed)"
                stroke="var(--color-closed)"
                stackId="a"
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
