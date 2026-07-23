'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import type { Cart } from "@/lib/types";

export function BottomBar() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Listen for cart updates
  useEffect(() => {
    function updateCount() {
      try {
        const stored = localStorage.getItem('batimawad_cart');
        if (stored) {
          const cart: Cart = JSON.parse(stored);
          setCartCount(cart.items.reduce((sum, i) => sum + i.quantity, 0));
        }
      } catch { /* empty */ }
    }

    updateCount();

    function handleCartUpdate(e: Event) {
      const cart = (e as CustomEvent<Cart>).detail;
      setCartCount(cart.items.reduce((sum, i) => sum + i.quantity, 0));
    }

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-slide-up">
      {/* Search bar (expandable) */}
      {searchOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/catalogue?q=${encodeURIComponent(searchQuery)}`);
                setSearchOpen(false);
              }
            }}
          >
            <Input
              autoFocus
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted border-border"
            />
          </form>
        </div>
      )}

      {/* Main bar */}
      <div className="flex items-center justify-around border-t border-border/40 bg-background/95 px-2 py-2 backdrop-blur-xl">
        {/* Search button */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 text-muted-foreground transition-colors hover:text-primary active:scale-95"
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] font-medium">Rechercher</span>
        </button>

        {/* Cart button */}
        <Link
          href="/panier"
          className="relative flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 text-muted-foreground transition-colors hover:text-primary active:scale-95"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-badge-bounce">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Panier</span>
        </Link>
      </div>
    </div>
  );
}
