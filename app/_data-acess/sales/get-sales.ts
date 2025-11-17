import "server-only";
import { db } from "@/app/_lib/prisma";
import { Product, SaleProduct } from "@prisma/client";

export interface SaleDto {
  id: string;
  productName: string;
  totalProducts: number;
  totalAmount: number;
  date: Date;
  saleProducts: (SaleProduct & { product: Product })[];
}

/**
 * @swagger
 * /api/data-access/sales:
 *   get:
 *     summary: Lista todas as vendas
 *     description: Retorna uma lista de todas as vendas realizadas, incluindo informações agregadas como valor total, quantidade de produtos e nomes dos produtos.
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: Lista de vendas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 *             examples:
 *               success:
 *                 summary: Lista de vendas
 *                 value:
 *                   - id: "123e4567-e89b-12d3-a456-426614174000"
 *                     date: "2024-01-15T10:00:00.000Z"
 *                     totalAmount: 89.98
 *                     totalProducts: 3
 *                     productName: "Produto 1 - Produto 2"
 *                     saleProducts:
 *                       - id: "sp1"
 *                         saleId: "123e4567-e89b-12d3-a456-426614174000"
 *                         productId: "p1"
 *                         quantity: 2
 *                         unitPrice: 29.99
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getSales = async (): Promise<SaleDto[]> => {
  const sales = await db.sale.findMany({
    include: {
      saleProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  return sales.map((sale) => ({
    id: sale.id,
    date: sale.date,
    productName: sale.saleProducts
      .map((saleProduct) => saleProduct.product.name)
      .join(" - "),
    totalProducts: sale.saleProducts.reduce(
      (acc, saleProduct) => acc + saleProduct.quantity,
      0,
    ),
    totalAmount: sale.saleProducts.reduce(
      (acc, saleProduct) =>
        acc + saleProduct.quantity * Number(saleProduct.unitPrice),
      0,
    ),
    saleProducts: sale.saleProducts,
  }));
};
