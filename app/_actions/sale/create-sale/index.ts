"use server";
import { db } from "@/app/_lib/prisma";
import { CreateSaleSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

export const createSaleAction = actionClient
  .schema(CreateSaleSchema)
  .action(async ({ parsedInput: { products } }) => {
    await db.$transaction(async (trx) => {
      const sale = await trx.sale.create({
        data: {
          date: new Date(),
        },
      });

      for (const product of products) {
        const productFromDb = await db.product.findUnique({
          where: {
            id: product.id,
          },
        });

        if (!productFromDb) {
          returnValidationErrors(CreateSaleSchema, {
            _errors: ["Produto não encontrado"],
          });
        }

        const hasInsufficientStock = productFromDb.stock < product.quantity;

        if (hasInsufficientStock) {
          returnValidationErrors(CreateSaleSchema, {
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
          where: {
            id: product.id,
          },
          data: {
            stock: productFromDb.stock - product.quantity,
          },
        });
      }
    });
    revalidatePath("/products");
  });
