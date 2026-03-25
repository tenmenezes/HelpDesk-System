"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllChamados } from "./services/chamados";
import { LoaderCircle } from "lucide-react";

type TimeRange = "24h" | "7d" | "1m";

type ChamadoChartItem = {
  criado_em: string;
  atualizado_em?: string;
  status: string;
};

type ChartPoint = {
  timestamp: number;
  opened: number;
  closed: number;
};

const chartConfig = {
  opened: { label: "Abertos", color: "var(--chart-1)" },
  closed: { label: "Resolvidos", color: "var(--chart-2)" },
} satisfies ChartConfig;

const TIME_RANGE_OPTIONS: {
  value: TimeRange;
  label: string;
  description: string;
}[] = [
  { value: "24h", label: "24H", description: "Últimas 24 horas" },
  { value: "7d", label: "7D", description: "Últimos 7 dias" },
  { value: "1m", label: "1M", description: "Últimos 30 dias" },
];

function getStartOfHour(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    0,
    0,
    0
  );
}

function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getRangeStart(now: Date, range: TimeRange) {
  if (range === "24h") {
    const start = getStartOfHour(now);
    start.setHours(start.getHours() - 23);
    return start;
  }

  const start = getStartOfDay(now);
  start.setDate(start.getDate() - (range === "7d" ? 6 : 29));
  return start;
}

function getBucketStart(date: Date, range: TimeRange) {
  return range === "24h" ? getStartOfHour(date) : getStartOfDay(date);
}

function buildChartData(chamados: ChamadoChartItem[], range: TimeRange) {
  const now = new Date();
  const rangeStart = getRangeStart(now, range);
  const bucketCount = range === "24h" ? 24 : range === "7d" ? 7 : 30;
  const buckets = new Map<number, ChartPoint>();
  const cursor = new Date(rangeStart);

  for (let index = 0; index < bucketCount; index++) {
    const timestamp = cursor.getTime();
    buckets.set(timestamp, { timestamp, opened: 0, closed: 0 });

    if (range === "24h") {
      cursor.setHours(cursor.getHours() + 1, 0, 0, 0);
    } else {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(0, 0, 0, 0);
    }
  }

  chamados.forEach((chamado) => {
    const createdAt = new Date(chamado.criado_em);

    if (
      !Number.isNaN(createdAt.getTime()) &&
      createdAt >= rangeStart &&
      createdAt <= now
    ) {
      const createdKey = getBucketStart(createdAt, range).getTime();
      const bucket = buckets.get(createdKey);

      if (bucket) {
        bucket.opened += 1;
      }
    }

    if (chamado.status !== "resolvido") {
      return;
    }

    const closedAt = chamado.atualizado_em
      ? new Date(chamado.atualizado_em)
      : createdAt;

    if (
      !Number.isNaN(closedAt.getTime()) &&
      closedAt >= rangeStart &&
      closedAt <= now
    ) {
      const closedKey = getBucketStart(closedAt, range).getTime();
      const bucket = buckets.get(closedKey);

      if (bucket) {
        bucket.closed += 1;
      }
    }
  });

  return Array.from(buckets.values());
}

function formatAxisLabel(timestamp: number, range: TimeRange) {
  const date = new Date(timestamp);

  if (range === "24h") {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
    });
  }

  if (range === "7d") {
    return date
      .toLocaleDateString("pt-BR", {
        weekday: "short",
      })
      .replace(".", "");
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function formatTooltipLabel(timestamp: number, range: TimeRange) {
  const date = new Date(timestamp);

  if (range === "24h") {
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (range === "7d") {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    });
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ChartAreaInteractive() {
  const [chamados, setChamados] = useState<ChamadoChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");

  const chartData = useMemo(
    () => buildChartData(chamados, timeRange),
    [chamados, timeRange]
  );

  const activeRange =
    TIME_RANGE_OPTIONS.find((option) => option.value === timeRange) ??
    TIME_RANGE_OPTIONS[0];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAllChamados();
        setChamados(data || []);
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
        setChamados([]);
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
      <CardHeader className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid flex-1 gap-1">
          <CardTitle>Fluxo de Chamados</CardTitle>
          <CardDescription>Abertos x Resolvidos em {activeRange.description.toLowerCase()}</CardDescription>
        </div>

        <Tabs
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            {TIME_RANGE_OPTIONS.map((option) => (
              <TabsTrigger key={option.value} value={option.value}>
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <LoaderCircle className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <AreaChart accessibilityLayer data={chartData}>
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
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={timeRange === "1m" ? 24 : 32}
                tickFormatter={(value) =>
                  formatAxisLabel(Number(value), timeRange)
                }
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      formatTooltipLabel(Number(value), timeRange)
                    }
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="opened"
                type="monotone"
                fill="url(#fillOpened)"
                stroke="var(--color-opened)"
                strokeWidth={2}
              />

              <Area
                dataKey="closed"
                type="monotone"
                fill="url(#fillClosed)"
                stroke="var(--color-closed)"
                strokeWidth={2}
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
