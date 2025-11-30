"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TicketsPlane } from "lucide-react";

export default function TicketsPorSetor({
  filtro = "7d",
}: {
  filtro?: string;
}) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // --- Dados simulados (grande volume) ---
  const dataset = {
    "24h": [
      { setor: "Suporte", total: 42 },
      { setor: "Redes", total: 15 },
      { setor: "Financeiro", total: 4 },
      { setor: "RH", total: 6 },
      { setor: "Infra", total: 18 },
      { setor: "Dev", total: 27 },
      { setor: "Compras", total: 2 },
    ],
    "7d": [
      { setor: "Suporte", total: 240 },
      { setor: "Redes", total: 110 },
      { setor: "Financeiro", total: 60 },
      { setor: "RH", total: 45 },
      { setor: "Infra", total: 170 },
      { setor: "Dev", total: 200 },
      { setor: "Compras", total: 30 },
    ],
    "14d": [
      { setor: "Suporte", total: 480 },
      { setor: "Redes", total: 260 },
      { setor: "Financeiro", total: 150 },
      { setor: "RH", total: 110 },
      { setor: "Infra", total: 350 },
      { setor: "Dev", total: 410 },
      { setor: "Compras", total: 70 },
    ],
    "30d": [
      { setor: "Suporte", total: 1050 },
      { setor: "Redes", total: 530 },
      { setor: "Financeiro", total: 350 },
      { setor: "RH", total: 300 },
      { setor: "Infra", total: 720 },
      { setor: "Dev", total: 980 },
      { setor: "Compras", total: 150 },
    ],
  };

  // --- Escolher dados conforme filtro ---
  const data = useMemo(() => dataset[filtro] || dataset["7d"], [filtro]);

  const axisColor = isDark ? "#e5e7eb" : "#374151"; // texto dos eixos
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const barColor = isDark ? "#3b82f6" : "#2563eb"; // azul tema neutro
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipText = isDark ? "#f3f4f6" : "#111827";

  return (
    <Card className="w-full md:w-1/2 md:max-w[600px]">
      <CardHeader>
        <div className="w-full flex items-center justify-between">
          <CardTitle>Tickets por setor ({filtro})</CardTitle>
          <TicketsPlane className="h-8 w-8 text-blue-800" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="setor" tick={{ fill: axisColor, fontSize: 12 }} />
              <YAxis tick={{ fill: axisColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: tooltipText }}
                itemStyle={{ color: tooltipText }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]} fill={barColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
