// ============================================
// Types TypeScript — Batim Awad E-Commerce BTP
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  short_desc: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  category?: Category;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  attribute_name: string;
  unit_type: string;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  commune: string;
  street_address: string;
  items_subtotal: number;
  delivery_fee: number | null;
  grand_total: number | null;
  status: OrderStatus;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  // Joined data
  variant?: ProductVariant & { product?: Product };
}

export interface CancelStat {
  id: string;
  order_id: string;
  reason: string;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  service_name: string;
  name: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  status: 'NEW' | 'READ' | 'DONE';
  created_at: string;
}

// ============================================
// Cart Types (localStorage)
// ============================================

export interface CartItem {
  variantId: string;
  productId: string;
  productTitle: string;
  variantName: string;
  unitType: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  stock?: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

// ============================================
// Stock display helpers
// ============================================

export type StockLevel = 'in_stock' | 'low_stock' | 'out_of_stock';

export function getStockLevel(stock: number, threshold: number = 5): StockLevel {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= threshold) return 'low_stock';
  return 'in_stock';
}

export function getStockLabel(level: StockLevel): string {
  switch (level) {
    case 'in_stock': return 'En stock';
    case 'low_stock': return 'Stock limité';
    case 'out_of_stock': return 'Rupture de stock';
  }
}

export function getStockColor(level: StockLevel): string {
  switch (level) {
    case 'in_stock': return 'text-stock-green';
    case 'low_stock': return 'text-stock-orange';
    case 'out_of_stock': return 'text-stock-gray';
  }
}

// ============================================
// Checkout form
// ============================================

export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  wilaya: string;
  commune: string;
  streetAddress: string;
}

// ============================================
// Cancel reasons
// ============================================

export const CANCEL_REASONS = [
  'Refus tarif transport',
  'Client injoignable',
  'Doublon',
  'Rupture de stock',
  'Autre',
] as const;

export type CancelReason = typeof CANCEL_REASONS[number];
