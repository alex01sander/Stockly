import { DataTable } from "../_components/ui/data-table";
import { productsTableColumns } from "./_components/columns-table";
import { cacheProducts } from "../_data-acess/product/get-produts";
import AddProductButton from "./_components/create-product-button";

const Products = async () => {
  const products = await cacheProducts();
  return (
    <div className="mx-8 my-8 w-full space-y-8 rounded-lg bg-white p-8 px-8 py-8">
      {/* Esquerda */}
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Gestão de produtos
          </span>
          <h1 className="text-2xl font-bold">Produtos</h1>
        </div>
        <AddProductButton />
      </div>
      <DataTable
        columns={productsTableColumns}
        data={JSON.parse(JSON.stringify(products))}
      />
    </div>
  );
};

export default Products;
