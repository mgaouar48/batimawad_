'use client';

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StockBadge } from "./StockBadge";
import { UnitBadge } from "./UnitBadge";
import type { Product, ProductVariant } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  variant: ProductVariant;
  onAddToCart?: () => void;
  priority?: boolean;
}

export function ProductCard({ product, variant, onAddToCart, priority = false }: ProductCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      {/* Image */}
      <Link href={`/produit/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {variant.image_url && (variant.image_url.startsWith('http://') || variant.image_url.startsWith('https://') || variant.image_url.startsWith('/')) ? (
            <Image
              src={variant.image_url}
              alt={product.title}
              fill
              priority={priority}
              decoding="async"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 opacity-20" />
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Stock badge */}
        <div className="mb-2">
          <StockBadge stock={variant.stock} />
        </div>

        {/* Title */}
        <Link href={`/produit/${product.slug}`}>
          <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-primary">
            {product.title}
          </h3>
        </Link>

        {/* Variant name */}
        <p className="mb-2 text-xs text-muted-foreground">{variant.attribute_name}</p>

        {/* Unit badge (obligatoire PRD) */}
        <div className="mb-3">
          <UnitBadge unitType={variant.unit_type} />
        </div>

        {/* Price + Action */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">
              {variant.price.toLocaleString('fr-DZ')} <span className="text-xs font-normal text-muted-foreground">DA</span>
            </p>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.();
            }}
            disabled={variant.stock <= 0}
            className="h-8 gap-1 bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-safety-yellow-hover"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
