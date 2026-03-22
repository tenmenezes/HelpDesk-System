"use client";

import { CheckCircle, LoaderCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Bar, CartesianGrid, XAxis, BarChart } from "recharts";
import { getAllChamados } from "./services/chamados";
import { useEffect, useState } from "react";

export default function ChartResolvedPending() {
  const [chartData, setChartData] = useState<
    { month: string; resolved: number; pending: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const chamados = await getAllChamados();
        const agora = new Date();
        const ultimos7dias = new Date(
          agora.getTime() - 7 * 24 * 60 * 60 * 1000
        );

        // Agrupar por dia
        const dailyData: Record<string, { resolved: number; pending: number }> =
          {};

        const nomesMeses = [
          "Domingo",
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sábado",
        ];

        chamados.forEach((c: any) => {
          const date = new Date(c.criado_em);
          if (date >= ultimos7dias) {
            const dayKey = date.toISOString().split("T")[0];
            if (!dailyData[dayKey]) {
              dailyData[dayKey] = { resolved: 0, pending: 0 };
            }
            if (c.status === "resolvido") {
              dailyData[dayKey].resolved++;
            } else {
              dailyData[dayKey].pending++;
            }
          }
        });

        const data = Object.entries(dailyData)
          .map(([date, values]) => ({
            month: nomesMeses[new Date(date).getDay()],
            resolved: values.resolved,
            pending: values.pending,
          }))
          .sort((a, b) => {
            const dateA = Object.keys(dailyData).find(
              (d) => nomesMeses[new Date(d).getDay()] === a.month
            );
            const dateB = Object.keys(dailyData).find(
              (d) => nomesMeses[new Date(d).getDay()] === b.month
            );
            return dateA!.localeCompare(dateB!);
          });

        setChartData(data);
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const chartConfig = {
    resolved: {
      label: "Resolvidos",
      color: "#16a34a",
    },
    pending: {
      label: "Pendentes",
      color: "#eab308",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full md:w-1/2 md:max-w[600px]">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg sm:text-xl">
            Chamados Resolvidos x Pendentes
          </CardTitle>
          <CheckCircle className="ml-auto w-8 h-8 text-green-600" />
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <LoaderCircle className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend />
              <Bar dataKey="resolved" fill="var(--color-resolved)" radius={4} />
              <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
