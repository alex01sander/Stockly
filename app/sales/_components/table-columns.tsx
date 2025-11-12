"use client";
import { SaleDto } from "@/app/_data-acess/sales/get-sales";
import { ColumnDef } from "@tanstack/react-table";
import SalesTableDropdownMenu from "./table-dropdown-menu";
import { ComboboxOption } from "@/app/_components/ui/combobox";
import { ProductDto } from "@/app/_data-acess/product/get-produts";

interface SaleTableColumns extends SaleDto {
  products: ProductDto[];
  productOptions: ComboboxOption[];
}

export const SalesTableColumns: ColumnDef<SaleTableColumns>[] = [
  {
    accessorKey: "productName",
    header: "Produtos",
  },
  {
    accessorKey: "totalProducts",
    header: "Quantidade de produtos",
  },
  {
    header: "Valor total",
    cell: ({
      row: {
        original: { totalAmount },
      },
    }) =>
      Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(totalAmount),
  },
  {
    header: "Data da venda",
    cell: ({
      row: {
        original: { date },
      },
    }) =>
      Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
      }).format(date),
  },
  {
    header: "Ações",
    cell: ({ row: { original: sale } }) => (
      <SalesTableDropdownMenu
        sale={sale}
        products={sale.products}
        productOptions={sale.productOptions}
      />
    ),
  },
];
