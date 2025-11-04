"use client";
import { SaleDto } from "@/app/_data-acess/sales/get-sales";
import { ColumnDef } from "@tanstack/react-table";
import SalesTableDropdownMenu from "./table-dropdown-menu";

export const SalesTableColumns: ColumnDef<SaleDto>[] = [
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
      <SalesTableDropdownMenu sale={sale} />
    ),
  },
];
