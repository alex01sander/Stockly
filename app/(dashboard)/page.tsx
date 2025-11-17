import {
  DollarSign,
  PackageIcon,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import Header from "../_components/header";
import SummaryCard from "./_components/summary-card";
import RevenueChart from "./_components/revenue-chart";
import BestSellingProducts from "./_components/best-selling-products";
import { getDashboardStats } from "../_data-acess/dashboard/get-dashboard-stats";
import { getRevenueChartData } from "../_data-acess/dashboard/get-revenue-chart-data";
import { getBestSellingProducts } from "../_data-acess/dashboard/get-best-selling-products";

export default async function Home() {
  const stats = await getDashboardStats();
  const chartData = await getRevenueChartData();
  const bestSellingProducts = await getBestSellingProducts(4);

  return (
    <div className="mx-8 my-8 w-full space-y-8 rounded-lg p-8 px-8 py-8">
      <Header subtitle="Dashboard" title="Dashboard" />

      {/* Cards de resumo - Primeira linha */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <SummaryCard
          title="Receita total"
          value={stats.totalRevenue}
          icon={<DollarSign size={20} />}
          formatCurrency={true}
        />
        <SummaryCard
          title="Receita hoje"
          value={stats.todayRevenue}
          icon={<DollarSign size={20} />}
          formatCurrency={true}
        />
        <SummaryCard
          title="Vendas totais"
          value={stats.totalSales}
          icon={<ShoppingCart size={20} />}
        />
        <SummaryCard
          title="Total em estoque"
          value={stats.totalStock}
          icon={<PackageIcon size={20} />}
        />
        <SummaryCard
          title="Produtos"
          value={stats.totalProducts}
          icon={<TrendingUp size={20} />}
        />
      </div>

      {/* Gráfico e produtos mais vendidos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={chartData} />
        <BestSellingProducts products={bestSellingProducts} />
      </div>
    </div>
  );
}
