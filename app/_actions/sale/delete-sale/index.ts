"use server";
import { actionClient } from "@/app/_lib/safe-action";
import { deleteSaleSchema } from "./schema";
import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * @swagger
 * /api/actions/sale/delete:
 *   delete:
 *     summary: Deleta uma venda
 *     description: |
 *       Remove uma venda do sistema pelo seu ID. 
 *       Ao deletar uma venda, o estoque dos produtos é automaticamente restaurado.
 *       Esta operação é irreversível.
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da venda a ser deletada
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Venda deletada com sucesso e estoque restaurado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: ID inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Venda não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const deleteSale = actionClient
  .schema(deleteSaleSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.$transaction(async (trx) => {
      // Buscar a venda com seus produtos
      const sale = await trx.sale.findUnique({
        where: { id },
        include: {
          saleProducts: true,
        },
      });

      if (!sale) {
        throw new Error("Venda não encontrada");
      }

      // Devolver cada produto ao estoque
      for (const saleProduct of sale.saleProducts) {
        await trx.product.update({
          where: { id: saleProduct.productId },
          data: {
            stock: {
              increment: saleProduct.quantity,
            },
          },
        });
      }

      // Deletar a venda (os saleProducts serão deletados em cascade)
      await trx.sale.delete({
        where: { id },
      });
    });

    revalidatePath("/sales");
    revalidatePath("/products");
    revalidatePath("/");
  });
