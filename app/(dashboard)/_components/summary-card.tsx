interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  formatCurrency?: boolean;
}

const SummaryCard = ({
  title,
  value,
  icon,
  formatCurrency = false,
}: SummaryCardProps) => {
  const formatValue = (val: number): string => {
    if (formatCurrency) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(val);
    }
    return new Intl.NumberFormat("pt-BR").format(val);
  };

  return (
    <div className="rounded-xl bg-white p-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
        {icon}
      </div>
      <div className="mt-4 space-y-1">
        <h2 className="text-sm font-medium text-slate-600">{title}</h2>
        <p className="text-2xl font-bold">{formatValue(value)}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
