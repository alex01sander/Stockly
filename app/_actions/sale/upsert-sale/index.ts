"use server";
import { db } from "@/app/_lib/prisma";
import { upsertSaleSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

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
