import { getStockLevel, getStockLabel } from "@/lib/types";

interface StockBadgeProps {
  stock: number;
  threshold?: number;
}

export function StockBadge({ stock, threshold = 5 }: StockBadgeProps) {
  const level = getStockLevel(stock, threshold);
  const label = getStockLabel(level);

  const styles = {
    in_stock: "bg-green-500/10 text-green-400 border-green-500/20",
    low_stock: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    out_of_stock: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  const dots = {
    in_stock: "bg-green-400",
    low_stock: "bg-orange-400",
    out_of_stock: "bg-gray-400",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[level]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[level]}`} />
      {label}
    </span>
  );
}
