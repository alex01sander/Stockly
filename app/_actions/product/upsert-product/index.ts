"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { UpsertProductSchema } from "./schema";

type UpsertProductSchema = z.infer<typeof UpsertProductSchema>;

/**
 * @swagger
 * /api/actions/product/upsert:
 *   post:
 *     summary: Cria ou atualiza um produto
 *     description: Cria um novo produto ou atualiza um produto existente. Se o ID for fornecido, atualiza o produto; caso contrário, cria um novo.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertProductRequest'
 *           examples:
 *             create:
 *               summary: Criar novo produto
 *               value:
 *                 name: "Produto Exemplo"
 *                 price: 29.99
 *                 stock: 100
 *             update:
 *               summary: Atualizar produto existente
 *               value:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 name: "Produto Atualizado"
 *                 price: 39.99
 *                 stock: 150
 *     responses:
 *       200:
 *         description: Produto criado ou atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Dados inválidos
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
export const upsertProduct = async (data: UpsertProductSchema) => {
  UpsertProductSchema.parse(data);
  await db.product.upsert({
    where: { id: data.id ?? "" },
    update: data,
    create: data,
  });
  revalidatePath("/products");
  revalidatePath("/sales");
  revalidatePath("/");
};
