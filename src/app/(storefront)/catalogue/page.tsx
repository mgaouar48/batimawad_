'use client';

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useCart } from "@/hooks/useCart";
import type { Product, ProductVariant, Category } from "@/lib/types";
import { getProducts, getCategories } from "@/lib/db";

export default function CataloguePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [products, setProducts] = useState<{ product: Product; variant: ProductVariant }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([prodData, catData]) => {
      setProducts(prodData);
      setCategories(catData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted" />
          <div className="h-10 max-w-md rounded bg-muted" />
          <div className="flex gap-8">
            <div className="hidden w-56 space-y-3 md:block">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 rounded bg-muted" />
              ))}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort — compare by category UUID (from Supabase) or slug (for demo data)
  let filtered = products.filter(({ product }) => {
    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.short_desc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category_id === selectedCategory ||
      // Fallback: match by slug for demo / local data that use slug as category_id
      categories.find((c) => c.id === selectedCategory)?.slug === product.category_id;

    return matchesSearch && matchesCategory;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price_asc": return a.variant.price - b.variant.price;
      case "price_desc": return b.variant.price - a.variant.price;
      case "name": return a.product.title.localeCompare(b.product.title);
      default: return 0;
    }
  });

  const CategoryFilter = () => (
    <div className="space-y-2">
      <button
        onClick={() => setSelectedCategory("all")}
        className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
          selectedCategory === "all"
            ? "bg-primary/10 font-medium text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        Toutes les catégories
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.id)}
          className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            selectedCategory === cat.id
              ? "bg-primary/10 font-medium text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Catalogue</h1>
        <p className="mt-2 text-muted-foreground">
          Parcourez notre sélection de matériaux BTP professionnels
        </p>
      </div>

      {/* Search & Sort bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="sm" className="gap-2 md:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtres
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 bg-background">
              <SheetTitle>Catégories</SheetTitle>
              <div className="mt-6">
                <CategoryFilter />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={(val) => setSortBy(val || "name")}>
            <SelectTrigger className="w-48">
              <div className="flex items-center gap-2">
                <ChevronDown className="h-4 w-4" />
                <SelectValue placeholder="Trier par" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom (A-Z)</SelectItem>
              <SelectItem value="price_asc">Prix croissant</SelectItem>
              <SelectItem value="price_desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
            Catégories
          </h3>
          <CategoryFilter />
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold text-foreground">Aucun produit trouvé</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {filtered.map(({ product, variant }, index) => (
                  <ProductCard
                    key={`${product.id}-${variant.id}`}
                    product={product}
                    variant={variant}
                    priority={index < 6}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
