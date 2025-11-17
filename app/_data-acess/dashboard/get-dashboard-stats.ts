import "server-only";
import { db } from "@/app/_lib/prisma";

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalSales: number;
  totalStock: number;
  totalProducts: number;
}

/**
 * @swagger
 * /api/data-access/dashboard/stats:
 *   get:
 *     summary: Obtém estatísticas do dashboard
 *     description: |
 *       Retorna estatísticas agregadas do sistema para o dashboard:
 *       - Receita total (todas as vendas)
 *       - Receita do dia (vendas realizadas hoje)
 *       - Total de vendas (quantidade de vendas)
 *       - Total em estoque (soma de todos os estoques)
 *       - Total de produtos (quantidade de produtos cadastrados)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 *             examples:
 *               success:
 *                 summary: Estatísticas do dashboard
 *                 value:
 *                   totalRevenue: 15000.50
 *                   todayRevenue: 500.00
 *                   totalSales: 150
 *                   totalStock: 500
 *                   totalProducts: 25
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

