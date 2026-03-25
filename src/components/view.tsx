"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TicketsPlane, LoaderCircle } from "lucide-react";
import { getAllChamados } from "./services/chamados";

type TimeFilter = "24h" | "7d" | "1m";

type TicketBySectorItem = {
  criado_em: string;
  setor_nome?: string | null;
};

const chartConfig = {
  total: {
    label: "Tickets",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const FILTER_LABELS: Record<TimeFilter, string> = {
  "24h": "24 horas",
  "7d": "7 dias",
  "1m": "30 dias",
};

function getFilterStart(filter: TimeFilter, now: Date) {
  if (filter === "24h") {
    return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - (filter === "7d" ? 6 : 29));
  return start;
}

function truncateSectorLabel(value: string) {
  if (value.length <= 12) {
    return value;
  }

  return `${value.slice(0, 12)}...`;
}

export default function TicketsPorSetor({
  filtro = "7d",
}: {
  filtro?: TimeFilter;
}) {
  const [chamados, setChamados] = useState<TicketBySectorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAllChamados();
        setChamados(data || []);
      } catch (error) {
        console.error("Erro ao carregar chamados:", error);
        setChamados([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const data = useMemo(() => {
    const rangeStart = getFilterStart(filtro, new Date());
    const porSetor: Record<string, number> = {};

    chamados.forEach((c) => {
      const createdAt = new Date(c.criado_em);

      if (Number.isNaN(createdAt.getTime()) || createdAt < rangeStart) {
        return;
      }

      const setor = c.setor_nome?.trim() || "Sem setor";
      porSetor[setor] = (porSetor[setor] || 0) + 1;
    });

    return Object.entries(porSetor)
      .map(([setor, total]) => ({ setor, total }))
      .sort((a, b) => b.total - a.total);
  }, [chamados, filtro]);

  return (
    <Card className="flex min-w-0 flex-1">
      <CardHeader className="gap-3 px-6 pb-0">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">
              Tickets por setor
            </CardTitle>
            <CardDescription>
              Distribuição de chamados nos últimos {FILTER_LABELS[filtro]}
            </CardDescription>
          </div>
          <TicketsPlane className="h-8 w-8 shrink-0 text-blue-700" />
        </div>
      </CardHeader>

      <CardContent className="px-6">
        {loading ? (
          <div className="flex h-[280px] items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <BarChart accessibilityLayer data={data} barCategoryGap="24%">
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="setor"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                minTickGap={18}
                tickFormatter={truncateSectorLabel}
              />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) => String(value)}
                  />
                }
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="var(--color-total)" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
