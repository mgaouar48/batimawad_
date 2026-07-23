'use client';

import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StockBadge } from "@/components/storefront/StockBadge";
import { UnitBadge } from "@/components/storefront/UnitBadge";
import { useCart } from "@/hooks/useCart";
import type { Product, ProductVariant } from "@/lib/types";

// Rich fallback descriptions for core BTP products to keep design premium
const DETAILED_DESCRIPTIONS: Record<string, string> = {
  "sikaflex-pro-11-fc": `
## Caractéristiques

- Mastic-colle élastique monocomposant à base de polyuréthane
- Excellente adhérence sur la plupart des matériaux de construction (béton, brique, pierre, métaux, bois, etc.)
- Peut être peint après durcissement complet
- Très haute résistance aux UV, au vieillissement et aux intempéries
- Mouvement de joint admissible de ±25%

## Applications

- Joints de façade et de raccordement en intérieur et extérieur
- Joints de dilatation dans le bâtiment et le génie civil
- Collage élastique d'éléments de construction (tuiles, appuis, plinthes, etc.)
- Étanchéité de fissures et de conduits d'aération

## Données techniques

| Propriété | Valeur |
|---|---|
| Base chimique | Polyuréthane monocomposant |
| Densité | ~1.3 kg/l |
| Température d'application | +5°C à +40°C |
| Allongement à la rupture | ~600% |
  `.trim(),
  "sika-monotop-620-f": `
## Caractéristiques

- Mortier hydraulique prêt à gâcher à base de ciment spécial
- Excellente maniabilité, consistance fluide et application aisée
- Épaisseur d'application de 1,5 à 10 mm par passe
- Résistance élevée aux cycles de gel-dégel et aux agressions chimiques modérées
- Finition très fine, idéale pour le surfaçage

## Applications

- Réparation fine des bétons dégradés (épaufrures, nids d'abeille)
- Ragréage et lissage de supports en béton ou mortier avant peinture
- Surfaçage étanche de piscines, réservoirs ou parois extérieures

## Données techniques

| Propriété | Valeur |
|---|---|
| Base chimique | Ciment, adjuvants spécifiques, fumée de silice |
| Granulométrie | Maximale : 0.4 mm |
| Consommation | ~1.8 kg/m²/mm d'épaisseur |
  `.trim(),
  "sikalatex": `
## Caractéristiques

- Résine de synthèse concentrée améliorant la cohésion et les adhérences
- Rend le mortier plastique et facile à mettre en œuvre (réduction de l'eau de gâchage)
- Améliore considérablement les résistances à la traction et à la flexion
- Rend le mortier étanche et plus résistant aux huiles et carburants
- Limite l'usure par frottement et le poussiérage

## Applications

- Barbotines d'accrochage pour enduits, chapes et reprises de bétonnage
- Mortiers de pose pour revêtements céramiques et dallages
- Enduits étanches et joints de maçonnerie haute résistance

## Données techniques

| Propriété | Valeur |
|---|---|
| Base chimique | Émulsion aqueuse de polymères synthétiques |
| Densité | ~1.02 kg/l |
| pH | ~9 |
  `.trim(),
};

interface ProduitClientProps {
  product: Product;
  variants: ProductVariant[];
}

export function ProduitClient({ product, variants }: ProduitClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(variants[0]?.image_url || null);
  const { addItem } = useCart();

  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    setQuantity(1);
    if (v.image_url) {
      setActiveImage(v.image_url);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;
    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productTitle: product.title,
        variantName: selectedVariant.attribute_name,
        unitType: selectedVariant.unit_type,
        price: selectedVariant.price,
        imageUrl: selectedVariant.image_url,
        stock: selectedVariant.stock,
      },
      quantity
    );
    setQuantity(1);
  };

  // Find all unique images from variants and filter out invalid ones
  const isValidSrc = (src: string | null | undefined): src is string => {
    if (!src) return false;
    const trimmed = src.trim();
    return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/');
  };

  const uniqueImages = Array.from(
    new Set(variants.map((v) => v.image_url).filter(isValidSrc))
  );

  // Fallback description if no detailed one exists
  const productDescription = DETAILED_DESCRIPTIONS[product.slug] || `
## Description du produit

${product.short_desc}

## Informations complémentaires

Pour toute question technique concernant l'utilisation ou l'application de ce produit, n'hésitez pas à nous contacter directement via notre service d'assistance.
  `.trim();

  const rawImage = activeImage || selectedVariant.image_url || (uniqueImages.length > 0 ? uniqueImages[0] : null);
  const displayImage = isValidSrc(rawImage) ? rawImage : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/catalogue" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        Retour au catalogue
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Photo Gallery Area */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-white p-6 flex items-center justify-center shadow-sm">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={product.title}
                fill
                className="object-contain p-4 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingCart className="h-20 w-20 opacity-10 mb-2" />
                <span className="text-xs text-muted-foreground/60">Aucune photo disponible</span>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {uniqueImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {uniqueImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImage(imgUrl);
                    // Automatically select the variant that uses this image, if any
                    const matchingVar = variants.find((v) => v.image_url === imgUrl);
                    if (matchingVar) {
                      setSelectedVariant(matchingVar);
                      setQuantity(1);
                    }
                  }}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-white p-2 transition-all ${
                    displayImage === imgUrl
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border/60 hover:border-primary/45'
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.title} miniature ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details and purchasing options */}
        <div>
          <h1 className="text-3xl font-bold text-foreground leading-tight">{product.title}</h1>
          <p className="mt-2 text-muted-foreground text-sm">{product.short_desc}</p>

          <Separator className="my-6" />

          {/* Variant Selector */}
          {variants.length > 1 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Conditionnement</h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantSelect(v)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      selectedVariant.id === v.id
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:bg-muted/50'
                    } ${v.stock <= 0 ? 'opacity-60' : ''}`}
                  >
                    {v.attribute_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock and Unit Badges */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <StockBadge stock={selectedVariant.stock} />
            <UnitBadge unitType={selectedVariant.unit_type} />
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-foreground">
              {selectedVariant.price.toLocaleString('fr-DZ')} <span className="text-base font-normal text-muted-foreground">DA</span>
            </p>
          </div>

          {/* Quantity Selector + Add to Cart Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={selectedVariant.stock <= 0}
                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-background disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{selectedVariant.stock <= 0 ? 0 : quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                disabled={selectedVariant.stock <= 0 || quantity >= selectedVariant.stock}
                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-background disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={selectedVariant.stock <= 0}
              className="flex-1 gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-safety-yellow-hover disabled:opacity-50"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5" />
              {selectedVariant.stock <= 0 ? 'Rupture de stock' : 'Ajouter au panier'}
            </Button>
          </div>

          <Separator className="my-8" />

          {/* Technical and Detailed Description */}
          <Card className="border-border/50 bg-card">
            <CardContent className="prose prose-slate max-w-none p-6 text-sm text-muted-foreground">
              <h2 className="text-lg font-bold text-foreground mb-4">Description du produit</h2>
              <div className="space-y-4 whitespace-pre-wrap leading-relaxed">{productDescription}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
