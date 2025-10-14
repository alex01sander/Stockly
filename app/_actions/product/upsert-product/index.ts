"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { UpsertProductSchema } from "./schema";

type UpsertProductSchema = z.infer<typeof UpsertProductSchema>;

export const upsertProduct = async (data: UpsertProductSchema) => {
  UpsertProductSchema.parse(data);
  await db.product.upsert({
    where: { id: data.id ?? "" },
    update: data,
    create: data,
  });
  revalidatePath("/products");
};
