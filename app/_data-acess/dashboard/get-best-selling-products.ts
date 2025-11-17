import "server-only";
import { db } from "@/app/_lib/prisma";

export interface BestSellingProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  totalSold: number;
}

export const getBestSellingProducts = async (
  limit: number = 4,
): Promise<BestSellingProduct[]> => {
  // Buscar todos os produtos com suas vendas
  const products = await db.product.findMany({
    include: {
      saleProducts: true,
    },
  });

  // Calcular total vendido para cada produto
  const productsWithSales = products.map((product) => {
    const totalSold = product.saleProducts.reduce(
      (sum, sp) => sum + sp.quantity,
      0,
    );

    return {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
      totalSold,
    };
  });

  // Ordenar por total vendido (maior para menor) e pegar os top N
  return productsWithSales
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, limit);
};

