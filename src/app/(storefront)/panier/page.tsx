'use client';

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UnitBadge } from "@/components/storefront/UnitBadge";
import { useCart } from "@/hooks/useCart";

export default function PanierPage() {
  const { cart, isLoaded, updateQuantity, removeItem, totalItems, subtotal } = useCart();

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <ShoppingCart className="mx-auto mb-6 h-16 w-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold text-foreground">Votre panier est vide</h1>
        <p className="mt-3 text-muted-foreground">
          Parcourez notre catalogue pour ajouter des produits
        </p>
        <Link href="/catalogue">
          <Button className="mt-6 gap-2 bg-primary text-primary-foreground hover:bg-safety-yellow-hover">
            Voir le catalogue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">
        Mon Panier <span className="text-lg font-normal text-muted-foreground">({totalItems} article{totalItems > 1 ? 's' : ''})</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <Card key={item.variantId} className="border-border/50 bg-card">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-white p-1 flex items-center justify-center">
                    {item.imageUrl && (item.imageUrl.startsWith('http://') || item.imageUrl.startsWith('https://') || item.imageUrl.startsWith('/')) ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productTitle}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                    ) : (
                      <ShoppingCart className="h-8 w-8 text-muted-foreground/20" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.productTitle}</h3>
                    <p className="text-sm text-muted-foreground">{item.variantName}</p>
                    <div className="mt-1">
                      <UnitBadge unitType={item.unitType} />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.stock !== undefined && item.quantity >= item.stock}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:hover:bg-muted disabled:hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="font-bold text-foreground">
                          {(item.price * item.quantity).toLocaleString('fr-DZ')} <span className="text-xs text-muted-foreground">DA</span>
                        </p>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-20 border-border/50 bg-card">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-bold text-foreground">Récapitulatif</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium text-foreground">{subtotal.toLocaleString('fr-DZ')} DA</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frais de livraison</span>
                  <span className="font-medium text-primary">À définir par téléphone</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Total provisoire</span>
                  <span className="text-xl font-bold text-foreground">{subtotal.toLocaleString('fr-DZ')} DA</span>
                </div>
              </div>

              {/* Avertissement PRD */}
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    Un conseiller vous appellera pour vous communiquer le tarif du transporteur avant expédition.
                  </p>
                </div>
              </div>

              <Link href="/checkout" className="mt-6 block">
                <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-safety-yellow-hover">
                  Valider ma demande
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
