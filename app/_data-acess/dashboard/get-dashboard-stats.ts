import "server-only";
import { db } from "@/app/_lib/prisma";

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalSales: number;
  totalStock: number;
  totalProducts: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Buscar todas as vendas com seus produtos
  const sales = await db.sale.findMany({
    include: {
      saleProducts: true,
    },
  });

  // Calcular receita total
  const totalRevenue = sales.reduce((acc, sale) => {
    const saleTotal = sale.saleProducts.reduce(
      (sum, sp) => sum + Number(sp.unitPrice) * sp.quantity,
      0,
    );
    return acc + saleTotal;
  }, 0);

  // Calcular receita de hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayRevenue = sales
    .filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= today && saleDate < tomorrow;
    })
    .reduce((acc, sale) => {
      const saleTotal = sale.saleProducts.reduce(
        (sum, sp) => sum + Number(sp.unitPrice) * sp.quantity,
        0,
      );
      return acc + saleTotal;
    }, 0);

  // Total de vendas (quantidade de vendas)
  const totalSales = sales.length;

  // Buscar todos os produtos para calcular estoque total
  const products = await db.product.findMany({
    select: {
      stock: true,
    },
  });

  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);
  const totalProducts = products.length;

  return {
    totalRevenue,
    todayRevenue,
    totalSales,
    totalStock,
    totalProducts,
  };
};

