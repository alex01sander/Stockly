import "server-only";
import { db } from "@/app/_lib/prisma";

export interface RevenueChartData {
  date: string;
  revenue: number;
}

export const getRevenueChartData = async (): Promise<RevenueChartData[]> => {
  // Buscar vendas dos últimos 14 dias
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const sales = await db.sale.findMany({
    where: {
      date: {
        gte: fourteenDaysAgo,
      },
    },
    include: {
      saleProducts: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  // Agrupar por data
  const revenueByDate = new Map<string, number>();

  sales.forEach((sale) => {
    const saleDate = new Date(sale.date);
    const dateKey = saleDate.toISOString().split("T")[0]; // YYYY-MM-DD

    const saleTotal = sale.saleProducts.reduce(
      (sum, sp) => sum + Number(sp.unitPrice) * sp.quantity,
      0,
    );

    const currentRevenue = revenueByDate.get(dateKey) || 0;
    revenueByDate.set(dateKey, currentRevenue + saleTotal);
  });

  // Preencher todos os últimos 14 dias (mesmo que não tenham vendas)
  const result: RevenueChartData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];

    result.push({
      date: dateKey,
      revenue: revenueByDate.get(dateKey) || 0,
    });
  }

  return result;
};

