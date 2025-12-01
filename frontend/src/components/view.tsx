"use client";

import { useMemo, useEffect, useState } from "react";
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
import { TicketsPlane, LoaderCircle } from "lucide-react";
import { getAllChamados } from "./services/chamados";

export default function TicketsPorSetor({
  filtro = "7d",
}: {
  filtro?: string;
}) {
  const { theme } = useTheme();
  const [chamados, setChamados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === "dark";

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
    const agora = new Date();
    const ultimos7dias = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);

    const chamadosFiltrados = chamados.filter(
      (c: any) => new Date(c.criado_em) >= ultimos7dias
    );

    const porSetor: Record<string, number> = {};

    chamadosFiltrados.forEach((c: any) => {
      const setor = c.setor_nome || "Sem setor";
      porSetor[setor] = (porSetor[setor] || 0) + 1;
    });

    return Object.entries(porSetor)
      .map(([setor, total]) => ({ setor, total }))
      .sort((a, b) => b.total - a.total);
  }, [chamados, filtro]);

  const axisColor = isDark ? "#e5e7eb" : "#374151";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const barColor = isDark ? "#3b82f6" : "#2563eb";
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
        {loading ? (
          <div className="flex items-center justify-center h-72">
            <LoaderCircle className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis
                  dataKey="setor"
                  tick={{ fill: axisColor, fontSize: 12 }}
                />
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
        )}
      </CardContent>
    </Card>
  );
}
