"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { RevenueChartData } from "@/app/_data-acess/dashboard/get-revenue-chart-data";

interface RevenueChartProps {
  data: RevenueChartData[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  // Formatar datas para exibição (apenas dia/mês)
  const formattedData = data.map((item) => {
    const date = new Date(item.date);
    const day = date.getDate();
    const month = date.toLocaleDateString("pt-BR", { month: "short" });
    return {
      ...item,
      label: `${day} ${month}`,
    };
  });

  return (
    <div className="rounded-xl bg-white p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Receita</h2>
        <p className="text-sm text-slate-500">Últimos 14 dias</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                notation: "compact",
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Bar
            dataKey="revenue"
            fill="hsl(var(--chart-2))"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;

