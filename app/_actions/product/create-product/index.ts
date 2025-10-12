"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { createProductSchema } from "./schema";

type CreateProductSchema = z.infer<typeof createProductSchema>;

export const createProduct = async (data: CreateProductSchema) => {
  createProductSchema.parse(data);
  await db.product.create({
    data,
  });
  revalidatePath("/products");
};
