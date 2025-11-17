import { db } from "@/app/_lib/prisma";
import { Product } from "@prisma/client";
import "server-only";

export interface ProductDto extends Product {
  status: "IN_STOCK" | "OUT_OF_STOCK";
}

/**
 * @swagger
 * /api/data-access/products:
 *   get:
 *     summary: Lista todos os produtos
 *     description: Retorna uma lista de todos os produtos cadastrados no sistema, incluindo o status do estoque (IN_STOCK ou OUT_OF_STOCK).
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             examples:
 *               success:
 *                 summary: Lista de produtos
 *                 value:
 *                   - id: "123e4567-e89b-12d3-a456-426614174000"
 *                     name: "Produto Exemplo"
 *                     price: 29.99
 *                     stock: 100
 *                     status: "IN_STOCK"
 *                     createdAt: "2024-01-01T00:00:00.000Z"
 *                     updatedAt: "2024-01-01T00:00:00.000Z"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getProducts = async (): Promise<ProductDto[]> => {
  const products = await db.product.findMany({});
  return products.map((product) => ({
    ...product,
    status: product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
  }));
};
