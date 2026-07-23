'use client';

import { ProductCard } from "./ProductCard";
import { useCart } from "@/hooks/useCart";
import type { Product, ProductVariant } from "@/lib/types";

interface BestSellersProps {
  initialProducts: { product: Product; variant: ProductVariant }[];
}

export function BestSellers({ initialProducts }: BestSellersProps) {
  const { addItem } = useCart();

  if (initialProducts.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-background to-card/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Meilleures Ventes
          </h2>
          <p className="mt-3 text-muted-foreground">
            Les produits les plus demandés par nos clients professionnels
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 stagger-children">
          {initialProducts.map(({ product, variant }, index) => (
            <ProductCard
              key={`${product.id}-${variant.id}`}
              product={product}
              variant={variant}
              priority={index < 4}
              onAddToCart={() =>
                addItem({
                  variantId: variant.id,
                  productId: product.id,
                  productTitle: product.title,
                  variantName: variant.attribute_name,
                  unitType: variant.unit_type,
                  price: variant.price,
                  imageUrl: variant.image_url,
                  stock: variant.stock,
                })
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
