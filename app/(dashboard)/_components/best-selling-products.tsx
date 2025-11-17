import { BestSellingProduct } from "@/app/_data-acess/dashboard/get-best-selling-products";
import { Circle } from "lucide-react";

interface BestSellingProductsProps {
  products: BestSellingProduct[];
}

const BestSellingProducts = ({ products }: BestSellingProductsProps) => {
  return (
    <div className="rounded-xl bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Produtos Mais Vendidos</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-3">
            <Circle
              size={8}
              fill="hsl(var(--chart-2))"
              className="text-chart-2"
            />
            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </span>
                <span>•</span>
                <span>
                  {new Intl.NumberFormat("pt-BR").format(product.totalSold)}{" "}
                  vendidos
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellingProducts;

