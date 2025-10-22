import React from "react";
import { Button } from "../_components/ui/button";
import { Sheet, SheetTrigger } from "../_components/ui/sheet";
import UpsertSheetComponent from "./_components/upsert-sheet-components";
import { getProducts } from "../_data-acess/product/get-produts";

const Sales = async () => {
  const products = await getProducts();
  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));
  return (
    <div className="mx-8 my-8 w-full space-y-8 rounded-lg bg-white p-8 px-8 py-8">
      {/* Esquerda */}
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Gestão de vendas
          </span>
          <h1 className="text-2xl font-bold">Vendas</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Nova venda</Button>
          </SheetTrigger>
          <UpsertSheetComponent
            productOptions={productOptions}
            products={products}
          />
        </Sheet>
      </div>
      {/* <DataTable
        columns={productsTableColumns}
        data={JSON.parse(JSON.stringify(products))}
      /> */}
    </div>
  );
};

export default Sales;
