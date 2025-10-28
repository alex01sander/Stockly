"use server";
import { db } from "@/app/_lib/prisma";
import { CreateSaleSchema } from "./schema";
import { revalidatePath } from "next/cache";

export const createSale = async (data: CreateSaleSchema) => {
  CreateSaleSchema.parse(data);
  await db.$transaction(async (trx) => {
    const sale = await trx.sale.create({
      data: {
        date: new Date(),
      },
    });

    for (const product of data.products) {
      const productFromDb = await db.product.findUnique({
        where: {
          id: product.id,
        },
      });

      if (!productFromDb) {
        throw new Error("Produto não encontrado");
      }

      const hasInsufficientStock = productFromDb.stock < product.quantity;

      if (hasInsufficientStock) {
        throw new Error("Estoque insuficiente");
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
    revalidatePath("/products");
  });
};
