"use client";

import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Bar, CartesianGrid, XAxis, BarChart } from "recharts";

export default function ChartResolvedPending() {
  const chartData = [
    { month: "Janeiro", resolved: 320, pending: 140 },
    { month: "Fevereiro", resolved: 290, pending: 60 },
    { month: "Março", resolved: 410, pending: 90 },
    { month: "Abril", resolved: 380, pending: 300 },
    { month: "Maio", resolved: 450, pending: 150 },
    { month: "Junho", resolved: 395, pending: 60 },
    // { month: "Julho", resolved: 160, pending: 450 },
    // { month: "Agosto", resolved: 640, pending: 550 },
    // { month: "Setembro", resolved: 1245, pending: 439 },
    // { month: "Outubro", resolved: 789, pending: 521 },
    // { month: "Novembro", resolved: 400, pending: 102 },
    // { month: "Dezembro", resolved: 769, pending: 356 },
  ];

  // Configuração visual
  const chartConfig = {
    resolved: {
      label: "Resolvidos",
      color: "#16a34a", // verde
    },
    pending: {
      label: "Pendentes",
      color: "#eab308", // amarelo
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
      </CardContent>
    </Card>
  );
}
