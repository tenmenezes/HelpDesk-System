"use client";

import { CheckCircle, LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Bar, CartesianGrid, XAxis, BarChart } from "recharts";
import { getAllChamados } from "./services/chamados";
import { useEffect, useMemo, useState } from "react";

type ChamadoChartItem = {
  criado_em: string;
  status: string;
};

type DailyChartPoint = {
  timestamp: number;
  resolved: number;
  pending: number;
};

function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function buildLastSevenDaysData(chamados: ChamadoChartItem[]) {
  const now = new Date();
  const rangeStart = getStartOfDay(now);
  rangeStart.setDate(rangeStart.getDate() - 6);

  const buckets = new Map<number, DailyChartPoint>();
  const cursor = new Date(rangeStart);

  for (let index = 0; index < 7; index++) {
    const timestamp = cursor.getTime();
    buckets.set(timestamp, { timestamp, resolved: 0, pending: 0 });
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);
  }

  chamados.forEach((chamado) => {
    const createdAt = new Date(chamado.criado_em);

    if (
      Number.isNaN(createdAt.getTime()) ||
      createdAt < rangeStart ||
      createdAt > now
    ) {
      return;
    }

    const bucketKey = getStartOfDay(createdAt).getTime();
    const bucket = buckets.get(bucketKey);

    if (!bucket) {
      return;
    }

    if (chamado.status === "resolvido") {
      bucket.resolved += 1;
      return;
    }

    bucket.pending += 1;
  });

  return Array.from(buckets.values());
}

function formatShortDate(timestamp: number) {
  return new Date(timestamp)
    .toLocaleDateString("pt-BR", {
      weekday: "short",
    })
    .replace(".", "");
}

function formatLongDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
}

export default function ChartResolvedPending() {
  const [chamados, setChamados] = useState<ChamadoChartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const chartData = useMemo(() => buildLastSevenDaysData(chamados), [chamados]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAllChamados();
        setChamados(data || []);
      } catch {
        toast.error("Erro ao carregar dados do gráfico");
        setChamados([]);
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
    <Card className="flex min-w-0 flex-1">
      <CardHeader className="gap-3 px-6 pb-0">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">
              Incidentes Resolvidos x Pendentes
            </CardTitle>
            <CardDescription>
              Status dos chamados criados nos últimos 7 dias
            </CardDescription>
          </div>
          <CheckCircle className="h-8 w-8 shrink-0 text-green-600" />
        </div>
      </CardHeader>

      <CardContent className="px-6">
        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <BarChart accessibilityLayer data={chartData} barCategoryGap="24%">
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                minTickGap={28}
                tickFormatter={(value) => formatShortDate(Number(value))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) => formatLongDate(Number(value))}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="resolved" fill="var(--color-resolved)" radius={4} />
              <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
