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
