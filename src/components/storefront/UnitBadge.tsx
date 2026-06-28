import { Package } from "lucide-react";

interface UnitBadgeProps {
  unitType: string;
}

export function UnitBadge({ unitType }: UnitBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
      <Package className="h-3 w-3" />
      Vendu au {unitType}
    </span>
  );
}
