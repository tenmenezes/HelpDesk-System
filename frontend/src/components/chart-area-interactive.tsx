"use client";

import * as React from "react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// NOVOS DADOS — Abertos x Resolvidos (mesma quantidade do gráfico original)
const chartData = [
  { date: "2024-05-01", opened: 12, closed: 9 },
  { date: "2024-05-02", opened: 15, closed: 11 },
  { date: "2024-05-03", opened: 18, closed: 16 },
  { date: "2024-05-04", opened: 22, closed: 19 },
  { date: "2024-05-05", opened: 25, closed: 21 },
  { date: "2024-05-06", opened: 30, closed: 26 },
  { date: "2024-05-07", opened: 28, closed: 24 },
  { date: "2024-05-08", opened: 20, closed: 18 },
  { date: "2024-05-09", opened: 32, closed: 29 },
  { date: "2024-05-10", opened: 27, closed: 23 },
  { date: "2024-05-11", opened: 15, closed: 17 },
  { date: "2024-05-12", opened: 19, closed: 16 },
  { date: "2024-05-13", opened: 22, closed: 18 },
  { date: "2024-05-14", opened: 35, closed: 30 },
  { date: "2024-05-15", opened: 41, closed: 38 },
  { date: "2024-05-16", opened: 29, closed: 25 },
  { date: "2024-05-17", opened: 33, closed: 31 },
  { date: "2024-05-18", opened: 21, closed: 18 },
  { date: "2024-05-19", opened: 17, closed: 14 },
  { date: "2024-05-20", opened: 14, closed: 12 },
  { date: "2024-05-21", opened: 19, closed: 16 },
  { date: "2024-05-22", opened: 12, closed: 10 },
  { date: "2024-05-23", opened: 25, closed: 21 },
  { date: "2024-05-24", opened: 27, closed: 22 },
  { date: "2024-05-25", opened: 20, closed: 17 },
  { date: "2024-05-26", opened: 22, closed: 20 },
  { date: "2024-05-27", opened: 31, closed: 28 },
  { date: "2024-05-28", opened: 18, closed: 15 },
  { date: "2024-05-29", opened: 11, closed: 9 },
  { date: "2024-05-30", opened: 24, closed: 20 },
  { date: "2024-05-31", opened: 16, closed: 13 },
  { date: "2024-06-01", opened: 18, closed: 14 },
  { date: "2024-06-02", opened: 28, closed: 25 },
  { date: "2024-06-03", opened: 14, closed: 12 },
  { date: "2024-06-04", opened: 32, closed: 28 },
  { date: "2024-06-05", opened: 12, closed: 10 },
  { date: "2024-06-06", opened: 26, closed: 22 },
  { date: "2024-06-07", opened: 29, closed: 26 },
  { date: "2024-06-08", opened: 31, closed: 29 },
  { date: "2024-06-09", opened: 35, closed: 32 },
  { date: "2024-06-10", opened: 20, closed: 18 },
  { date: "2024-06-11", opened: 14, closed: 12 },
  { date: "2024-06-12", opened: 38, closed: 33 },
  { date: "2024-06-13", opened: 11, closed: 9 },
  { date: "2024-06-14", opened: 34, closed: 30 },
  { date: "2024-06-15", opened: 27, closed: 23 },
  { date: "2024-06-16", opened: 29, closed: 26 },
  { date: "2024-06-17", opened: 41, closed: 37 },
  { date: "2024-06-18", opened: 13, closed: 10 },
  { date: "2024-06-19", opened: 30, closed: 27 },
  { date: "2024-06-20", opened: 33, closed: 29 },
  { date: "2024-06-21", opened: 21, closed: 18 },
  { date: "2024-06-22", opened: 26, closed: 23 },
  { date: "2024-06-23", opened: 38, closed: 34 },
  { date: "2024-06-24", opened: 16, closed: 13 },
  { date: "2024-06-25", opened: 17, closed: 14 },
  { date: "2024-06-26", opened: 33, closed: 30 },
  { date: "2024-06-27", opened: 35, closed: 32 },
  { date: "2024-06-28", opened: 18, closed: 15 },
  { date: "2024-06-29", opened: 14, closed: 12 },
  { date: "2024-06-30", opened: 37, closed: 33 },
];

// CONFIGURAÇÃO DO GRÁFICO (somente troca de labels)
const chartConfig = {
  opened: { label: "Abertos", color: "var(--chart-1)" },
  closed: { label: "Resolvidos", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");

    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Fluxo de Chamados</CardTitle>
          <CardDescription>
            Abertos x Resolvidos — últimos meses
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex cursor-pointer">
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Últimos 3 meses</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
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
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
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
      </CardContent>
    </Card>
  );
}
