"use server";
import { db } from "@/app/_lib/prisma";
import { upsertSaleSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

/**
 * @swagger
 * /api/actions/sale/upsert:
 *   post:
 *     summary: Cria ou atualiza uma venda
 *     description: |
 *       Cria uma nova venda ou atualiza uma venda existente.
 *       Ao criar uma venda, o estoque dos produtos é automaticamente decrementado.
 *       Ao atualizar, o estoque da venda anterior é restaurado antes de criar a nova.
 *       
 *       **Validações:**
 *       - Todos os produtos devem existir
 *       - O estoque deve ser suficiente para a quantidade solicitada
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertSaleRequest'
 *           examples:
 *             create:
 *               summary: Criar nova venda
 *               value:
 *                 products:
 *                   - id: "123e4567-e89b-12d3-a456-426614174000"
 *                     quantity: 2
 *                   - id: "223e4567-e89b-12d3-a456-426614174000"
 *                     quantity: 1
 *             update:
 *               summary: Atualizar venda existente
 *               value:
 *                 id: "323e4567-e89b-12d3-a456-426614174000"
 *                 products:
 *                   - id: "123e4567-e89b-12d3-a456-426614174000"
 *                     quantity: 3
 *     responses:
 *       200:
 *         description: Venda criada ou atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Dados inválidos ou estoque insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               insufficientStock:
 *                 summary: Estoque insuficiente
 *                 value:
 *                   message: "Estoque insuficiente"
 *                   errors: ["Estoque insuficiente"]
 *               productNotFound:
 *                 summary: Produto não encontrado
 *                 value:
 *                   message: "Produto não encontrado"
 *                   errors: ["Produto não encontrado"]
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const upsertSaleAction = actionClient
  .schema(upsertSaleSchema)
  .action(async ({ parsedInput: { products, id } }) => {
    const isUpdate = Boolean(id);
    let originalDate: Date | null = null;

    await db.$transaction(async (trx) => {
      if (isUpdate) {
        const existingSale = await trx.sale.findUnique({
          where: { id },
          include: {
            saleProducts: true,
          },
        });

        if (existingSale) {
          originalDate = existingSale.date;

          for (const saleProduct of existingSale.saleProducts) {
            await trx.product.update({
              where: { id: saleProduct.productId },
              data: {
                stock: {
                  increment: saleProduct.quantity,
                },
              },
            });
          }

          await trx.sale.delete({
            where: { id },
          });
        }
      }

      const sale = await trx.sale.create({
        data: {
          date: originalDate || new Date(),
        },
      });

      for (const product of products) {
        const productFromDb = await trx.product.findUnique({
          where: { id: product.id },
        });

        if (!productFromDb) {
          returnValidationErrors(upsertSaleSchema, {
            _errors: ["Produto não encontrado"],
          });
        }

        const hasInsufficientStock = productFromDb.stock < product.quantity;
        if (hasInsufficientStock) {
          returnValidationErrors(upsertSaleSchema, {
            _errors: ["Estoque insuficiente"],
          });
        }

        await trx.saleProduct.create({
          data: {
            saleId: sale.id,
            productId: product.id,
            quantity: product.quantity,
            unitPrice: productFromDb.price,
          },
        });

        await trx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: product.quantity,
            },
          },
        });
      }
    });

    revalidatePath("/products");
    revalidatePath("/sales");
  });
