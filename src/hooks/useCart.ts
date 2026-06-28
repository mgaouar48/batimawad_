'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { Cart, CartItem } from '@/lib/types';

const CART_KEY = 'batimawad_cart';

function getCartFromStorage(): Cart {
  if (typeof window === 'undefined') return { items: [], updatedAt: new Date().toISOString() };
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* empty */ }
  return { items: [], updatedAt: new Date().toISOString() };
}

function saveCartToStorage(cart: Cart) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], updatedAt: new Date().toISOString() });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCart(getCartFromStorage());
    setIsLoaded(true);
  }, []);

  const updateCart = useCallback((updater: (prev: Cart) => Cart) => {
    setCart((prev) => {
      const next = updater(prev);
      next.updatedAt = new Date().toISOString();
      
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          saveCartToStorage(next);
          window.dispatchEvent(new CustomEvent('cart-updated', { detail: next }));
        }, 0);
      }
      
      return next;
    });
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    let limitExceeded = false;
    let finalAddedQty = quantity;

    updateCart((prev) => {
      const existing = prev.items.find((i) => i.variantId === item.variantId);
      const stockMax = item.stock !== undefined ? item.stock : 9999;
      
      if (existing) {
        const potentialQty = existing.quantity + quantity;
        if (potentialQty > stockMax) {
          limitExceeded = true;
          finalAddedQty = Math.max(0, stockMax - existing.quantity);
          return {
            ...prev,
            items: prev.items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: stockMax }
                : i
            ),
          };
        }
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      
      if (quantity > stockMax) {
        limitExceeded = true;
        finalAddedQty = stockMax;
        return {
          ...prev,
          items: [...prev.items, { ...item, quantity: stockMax }],
        };
      }

      return {
        ...prev,
        items: [...prev.items, { ...item, quantity }],
      };
    });

    if (limitExceeded) {
      if (finalAddedQty > 0) {
        toast.warning(`Quantité limitée au stock disponible (${item.stock} unités).`);
      } else {
        toast.error("Stock maximum disponible déjà atteint dans votre panier.");
        return;
      }
    }

    // Notify user with a toast
    toast.success("Produit ajouté au panier", {
      description: `${item.productTitle} - ${item.variantName} (${finalAddedQty} ${finalAddedQty > 1 ? 'articles' : 'article'})`,
      action: {
        label: "Voir le panier",
        onClick: () => {
          window.location.href = "/panier";
        },
      },
    });
  }, [updateCart]);

  const removeItem = useCallback((variantId: string) => {
    updateCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.variantId !== variantId),
    }));
  }, [updateCart]);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    updateCart((prev) => {
      const item = prev.items.find((i) => i.variantId === variantId);
      if (!item) return prev;
      
      const stockMax = item.stock !== undefined ? item.stock : 9999;
      if (quantity > stockMax) {
        toast.error(`Désolé, seulement ${stockMax} articles sont disponibles en stock.`);
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: stockMax } : i
          ),
        };
      }
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.variantId === variantId ? { ...i, quantity } : i
        ),
      };
    });
  }, [updateCart, removeItem]);

  const clearCart = useCallback(() => {
    updateCart(() => ({ items: [], updatedAt: new Date().toISOString() }));
  }, [updateCart]);

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    cart,
    isLoaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  };
}
