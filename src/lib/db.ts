import { createClient } from './supabase/client';
import type { Category, Product, ProductVariant, Order, OrderStatus, CancelStat, ServiceRequest } from './types';

// Check if Supabase credentials are valid
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    url !== 'your_supabase_url_here' &&
    anonKey &&
    anonKey !== 'your_supabase_anon_key_here'
  );
}

// Helper to generate a valid UUID v4
export function generateUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Initial Demo Categories
const DEMO_CATEGORIES: Category[] = [
  { id: "etancheite", name: "Étanchéité & Cuvelage", slug: "etancheite", description: "Produits pour l'étanchéité des fondations et toitures", icon_url: null, sort_order: 1, created_at: new Date().toISOString() },
  { id: "renforcement", name: "Renforcement Structurel", slug: "renforcement", description: "Solutions de renforcement de structures en béton armé", icon_url: null, sort_order: 2, created_at: new Date().toISOString() },
  { id: "finitions", name: "Pose & Finitions", slug: "finitions", description: "Colles à carrelage, joints et enduits", icon_url: null, sort_order: 3, created_at: new Date().toISOString() },
  { id: "adjuvants", name: "Adjuvants Béton", slug: "adjuvants", description: "Plastifiants, hydrofuges et accélérateurs", icon_url: null, sort_order: 4, created_at: new Date().toISOString() },
  { id: "reparation", name: "Réparation du Béton", slug: "reparation", description: "Mortiers de réparation structurelle", icon_url: null, sort_order: 5, created_at: new Date().toISOString() },
  { id: "protection", name: "Protection & Imperméabilisation", slug: "protection", description: "Revêtements protecteurs pour sols et murs", icon_url: null, sort_order: 6, created_at: new Date().toISOString() },
];

// Initial Demo Products and Variants
const INITIAL_PRODUCTS: { product: Product; variant: ProductVariant }[] = [
  {
    product: { id: "1", category_id: "etancheite", title: "Sikaflex® PRO-11 FC", slug: "sikaflex-pro-11-fc", short_desc: "Mastic-colle polyuréthane haute performance", is_active: true, is_featured: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v1", product_id: "1", sku: "SKF-PRO11-300", attribute_name: "Gris - 300ml", unit_type: "cartouche de 300ml", price: 1800, stock: 25, image_url: "https://res.cloudinary.com/dzssyvvmg/image/upload/v1782642007/g1ux5r3rbgxtehjlcduv.webp", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "2", category_id: "reparation", title: "Sika MonoTop®-620 F", slug: "sika-monotop-620-f", short_desc: "Mortier de réparation structurelle fin", is_active: true, is_featured: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v2", product_id: "2", sku: "SMT-620-25", attribute_name: "Sac 25kg", unit_type: "sac de 25kg", price: 4500, stock: 12, image_url: "https://res.cloudinary.com/dzssyvvmg/image/upload/v1782642004/lwag8kodqez43tqnjzpm.jpg", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "3", category_id: "adjuvants", title: "SikaLatex®", slug: "sikalatex", short_desc: "Résine d'accrochage et adjuvant pour mortier", is_active: true, is_featured: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v3", product_id: "3", sku: "SLX-5L", attribute_name: "Bidon 5L", unit_type: "bidon de 5L", price: 3200, stock: 3, image_url: "https://res.cloudinary.com/dzssyvvmg/image/upload/v1782642009/cvceo9kczywy3zxlrmno.webp", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "4", category_id: "renforcement", title: "Sikadur®-31 CF Normal", slug: "sikadur-31-cf-normal", short_desc: "Colle époxydique structurelle", is_active: true, is_featured: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v4", product_id: "4", sku: "SD31-6KG", attribute_name: "Kit 6kg", unit_type: "kit de 6kg", price: 12500, stock: 0, image_url: "https://res.cloudinary.com/dzssyvvmg/image/upload/v1782642006/bltczv0kmemy9fi3tbxu.webp", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "5", category_id: "finitions", title: "SikaCeram®-255 StarFlex", slug: "sikaceram-255-starflex", short_desc: "Colle carrelage haute flexibilité", is_active: true, is_featured: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v5", product_id: "5", sku: "SC255-25", attribute_name: "Sac 25kg", unit_type: "sac de 25kg", price: 2800, stock: 40, image_url: "https://res.cloudinary.com/dzssyvvmg/image/upload/v1782642004/unk4xcxodh39b7nvna84.webp", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "6", category_id: "protection", title: "SikaFloor®-161", slug: "sikafloor-161", short_desc: "Primaire époxydique pour sols", is_active: true, is_featured: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v6", product_id: "6", sku: "SF161-10", attribute_name: "Kit 10kg", unit_type: "kit de 10kg", price: 18500, stock: 8, image_url: "https://res.cloudinary.com/dzssyvvmg/image/upload/v1782642008/eopozeo9qrho2s8e6xnf.webp", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "7", category_id: "adjuvants", title: "Hydrofuge Sika® Liquide", slug: "hydrofuge-sika-liquide", short_desc: "Hydrofuge de masse pour béton et mortier", is_active: true, is_featured: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v7", product_id: "7", sku: "HSL-5L", attribute_name: "Bidon 5L", unit_type: "bidon de 5L", price: 2400, stock: 15, image_url: "https://res.cloudinary.com/dzssyvvmg/image/upload/v1782642000/aihfwkrsrvos17fw3bvs.webp", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "8", category_id: "finitions", title: "SikaCeram®-510 Joint", slug: "sikaceram-510-joint", short_desc: "Mortier de jointoiement haute performance", is_active: true, is_featured: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v8", product_id: "8", sku: "SC510-5", attribute_name: "Sac 5kg - Blanc", unit_type: "sac de 5kg", price: 1200, stock: 50, image_url: "https://res.cloudinary.com/dzssyvvmg/image/upload/v1782642005/pwwzrdthcyikzxn5vvsf.jpg", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "9", category_id: "reparation", title: "Sika MonoTop®-1010", slug: "sika-monotop-1010", short_desc: "Mortier de passivation des armatures", is_active: true, is_featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v9", product_id: "9", sku: "SMT-1010-25", attribute_name: "Sac 25kg", unit_type: "sac de 25kg", price: 5200, stock: 7, image_url: "https://res.cloudinary.com/dzssyvvmg/image/upload/v1782642001/ofafoojehiddxplippsu.webp", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "10", category_id: "finitions", title: "SikaCeram®-200", slug: "sikaceram-200", short_desc: "Colle carrelage standard intérieur", is_active: true, is_featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v10", product_id: "10", sku: "SC200-25", attribute_name: "Sac 25kg", unit_type: "sac de 25kg", price: 1500, stock: 60, image_url: "https://res.cloudinary.com/dzssyvvmg/image/upload/v1782642005/ntijs4gnl6nbgdztdlsk.jpg", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "11", category_id: "etancheite", title: "Master Emaco P 157", slug: "master-emaco-p157", short_desc: "Primaire d'accrochage époxydique sans solvant", is_active: true, is_featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v11", product_id: "11", sku: "MEP157-20L", attribute_name: "Seau 20L", unit_type: "seau de 20L", price: 32000, stock: 4, image_url: "/logos-marques/MasterEmacoP15720LitresPail_378x_35353e36-1dc1-4241-8669-f0b7a78d5a39.webp", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    product: { id: "12", category_id: "etancheite", title: "Membrane Bitumineuse Auto-adhésive", slug: "membrane-bitumineuse", short_desc: "Membrane d'étanchéité auto-adhésive pour fondations", is_active: true, is_featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    variant: { id: "v12", product_id: "12", sku: "MBA-10M", attribute_name: "Rouleau 10m", unit_type: "rouleau de 10m", price: 8500, stock: 0, image_url: "https://cdn.shopify.com/s/files/1/0897/1219/7922/files/sikafill-etancheite-2.jpg?v=1728764980", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
];

// Helper to get from local storage
function getLocalData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Helper to save to local storage
function saveLocalData<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving mock database to localStorage', e);
  }
}

// Get categories
export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (!error && data) return data as Category[];
  }
  return getLocalData<Category[]>('batimawad_categories', DEMO_CATEGORIES);
}

// Get all products (with variants) — only active, for the storefront
export async function getProducts(): Promise<{ product: Product; variant: ProductVariant }[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: products, error: pError } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    const { data: variants, error: vError } = await supabase
      .from('product_variants')
      .select('*');

    if (!pError && !vError && products && variants) {
      const result: { product: Product; variant: ProductVariant }[] = [];
      products.forEach((p: any) => {
        const pVariants = variants.filter((v: any) => v.product_id === p.id);
        pVariants.forEach((v: any) => {
          result.push({
            product: { ...p, category: p.category },
            variant: v,
          });
        });
      });
      return result;
    }
  }
  return getLocalData<{ product: Product; variant: ProductVariant }[]>('batimawad_products', INITIAL_PRODUCTS);
}

// Get ALL products including inactive — for admin panel
export async function getAllProducts(): Promise<{ product: Product; variant: ProductVariant }[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: products, error: pError } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: true });

    const { data: variants, error: vError } = await supabase
      .from('product_variants')
      .select('*');

    if (!pError && !vError && products && variants) {
      const result: { product: Product; variant: ProductVariant }[] = [];
      products.forEach((p: any) => {
        const pVariants = variants.filter((v: any) => v.product_id === p.id);
        pVariants.forEach((v: any) => {
          result.push({
            product: { ...p, category: p.category },
            variant: v,
          });
        });
        // Include products with no variants too
        if (pVariants.length === 0) {
          result.push({
            product: { ...p, category: p.category },
            variant: { id: '', product_id: p.id, sku: '', attribute_name: 'Standard', unit_type: '', price: 0, stock: 0, image_url: null, created_at: p.created_at, updated_at: p.updated_at },
          });
        }
      });
      return result;
    }
  }
  return getLocalData<{ product: Product; variant: ProductVariant }[]>('batimawad_products', INITIAL_PRODUCTS);
}

// Add/update product and variant — writes to Supabase when configured
export async function saveProduct(product: Product, variant: ProductVariant): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const productId = (!product.id || product.id.startsWith('prod_')) ? generateUUID() : product.id;
      const variantId = (!variant.id || variant.id.startsWith('var_') || variant.id === '') ? generateUUID() : variant.id;

      // Upsert product
      const { error: pError } = await supabase
        .from('products')
        .upsert({
          id: productId,
          category_id: product.category_id,
          title: product.title,
          slug: product.slug,
          short_desc: product.short_desc,
          is_active: product.is_active,
          is_featured: product.is_featured,
        }, { onConflict: 'id' });

      if (pError) throw pError;

      // Upsert variant
      const { error: vError } = await supabase
        .from('product_variants')
        .upsert({
          id: variantId,
          product_id: productId,
          sku: variant.sku,
          attribute_name: variant.attribute_name,
          unit_type: variant.unit_type,
          price: variant.price,
          stock: variant.stock,
          image_url: variant.image_url,
        }, { onConflict: 'id' });

      if (vError) throw vError;
      return;
    } catch (err: any) {
      console.error('Supabase saveProduct failed:', err?.message || err);
      throw err;
    }
  }

  // Fallback to localStorage
  const products = await getProducts();
  const index = products.findIndex(p => p.product.id === product.id && p.variant.id === variant.id);
  if (index >= 0) {
    products[index] = { product, variant };
  } else {
    products.push({ product, variant });
  }
  saveLocalData('batimawad_products', products);
}

// Delete product — removes from Supabase when configured
export async function deleteProduct(productId: string, variantId: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (variantId) {
        const { error: vError } = await supabase
          .from('product_variants')
          .delete()
          .eq('id', variantId);
        if (vError) throw vError;
      }
      // Delete product only if no more variants exist
      const { data: remainingVariants } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', productId);
      if (!remainingVariants || remainingVariants.length === 0) {
        const { error: pError } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        if (pError) throw pError;
      }
      return;
    } catch (err: any) {
      console.error('Supabase deleteProduct failed:', err?.message || err);
      throw err;
    }
  }

  // Fallback to localStorage
  const products = await getProducts();
  const filtered = products.filter(p => !(p.product.id === productId && p.variant.id === variantId));
  saveLocalData('batimawad_products', filtered);
}

// Get orders
export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    // Fetch orders along with nested order items, variant details, and parent product details.
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, variant:product_variants(*, product:products(*)))')
      .order('created_at', { ascending: false });

    if (!error && data) return data as Order[];
  }
  return getLocalData<Order[]>('batimawad_orders', []);
}

// Create order
export async function createOrder(
  customerData: { customerName: string; customerPhone: string; wilaya: string; commune: string; streetAddress: string },
  items: { variantId: string; productId: string; productTitle: string; variantName: string; unitType: string; price: number; quantity: number; imageUrl: string | null }[]
): Promise<Order> {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Use generateUUID() so that order IDs are valid UUIDs for Supabase when it is configured,
  // falling back to local storage seamlessly.
  const isSupabase = isSupabaseConfigured();
  const orderId = isSupabase ? generateUUID() : 'ord_' + Math.random().toString(36).substr(2, 9);
  
  const newOrder: Order = {
    id: orderId,
    customer_name: customerData.customerName,
    customer_phone: customerData.customerPhone,
    wilaya: customerData.wilaya,
    commune: customerData.commune,
    street_address: customerData.streetAddress,
    items_subtotal: subtotal,
    delivery_fee: null,
    grand_total: null,
    status: 'PENDING',
    cancellation_reason: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const orderItems = items.map(item => {
    const itemId = isSupabase ? generateUUID() : 'item_' + Math.random().toString(36).substr(2, 9);
    return {
      id: itemId,
      order_id: newOrder.id,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      variant: {
        id: item.variantId,
        product_id: item.productId,
        sku: '',
        attribute_name: item.variantName,
        unit_type: item.unitType,
        price: item.price,
        stock: 100, // mock stock
        image_url: item.imageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: {
          id: item.productId,
          category_id: null,
          title: item.productTitle,
          slug: '',
          short_desc: '',
          is_active: true,
          is_featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    };
  });

  newOrder.items = orderItems;

  if (isSupabase) {
    try {
      const supabase = createClient();
      
      // Perform insert without select().single() (using minimal return representation)
      // to comply with RLS policies that allow INSERT but restrict SELECT for anonymous users.
      const { error: oError } = await supabase
        .from('orders')
        .insert({
          id: newOrder.id,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          wilaya: newOrder.wilaya,
          commune: newOrder.commune,
          street_address: newOrder.street_address,
          items_subtotal: newOrder.items_subtotal,
          status: 'PENDING'
        });

      if (oError) throw oError;

      const dbItems = orderItems.map(item => ({
        id: item.id,
        order_id: newOrder.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: iError } = await supabase
        .from('order_items')
        .insert(dbItems);

      if (iError) throw iError;
      
      return newOrder;
    } catch (err: any) {
      console.error('Supabase order creation failed, falling back to Mock storage. Error:', err?.message || err);
    }
  }

  // Fallback / Mock
  const orders = await getOrders();
  orders.unshift(newOrder);
  saveLocalData('batimawad_orders', orders);
  return newOrder;
}

// Validate order (Method B: decr stock only here + add shipping fee)
export async function validateOrder(orderId: string, deliveryFee: number): Promise<boolean> {
  // 1. Fetch current order
  const orders = await getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) return false;
  
  const order = orders[orderIndex];
  if (order.status !== 'PENDING') return false;

  // 2. Fetch products to check/decr stock locally (for local fallback)
  const products = await getProducts();
  
  // Verify stock locally
  if (order.items) {
    for (const item of order.items) {
      const pIdx = products.findIndex(p => p.variant.id === item.variant_id);
      if (pIdx !== -1) {
        const availableStock = products[pIdx].variant.stock;
        if (availableStock < item.quantity) {
          // Insufficient stock!
          return false;
        }
      }
    }

    // Deduct stock locally
    for (const item of order.items) {
      const pIdx = products.findIndex(p => p.variant.id === item.variant_id);
      if (pIdx !== -1) {
        products[pIdx].variant.stock -= item.quantity;
      }
    }
  }

  // 3. Update order local properties
  order.status = 'CONFIRMED';
  order.delivery_fee = deliveryFee;
  order.grand_total = order.items_subtotal + deliveryFee;
  order.updated_at = new Date().toISOString();

  // Save changes locally
  saveLocalData('batimawad_orders', orders);
  saveLocalData('batimawad_products', products);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      
      // Update order status in Supabase
      const { error: oError } = await supabase
        .from('orders')
        .update({
          status: 'CONFIRMED',
          delivery_fee: deliveryFee,
          grand_total: order.items_subtotal + deliveryFee,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (oError) throw oError;

      // Update variant stocks in Supabase!
      if (order.items) {
        for (const item of order.items) {
          const { data: vData, error: fError } = await supabase
            .from('product_variants')
            .select('stock')
            .eq('id', item.variant_id)
            .single();
            
          if (!fError && vData) {
            const newStock = Math.max(0, vData.stock - item.quantity);
            const { error: uError } = await supabase
              .from('product_variants')
              .update({ stock: newStock })
              .eq('id', item.variant_id);
            if (uError) throw uError;
          }
        }
      }
    } catch (err: any) {
      console.error('Supabase validation/stock update failed:', err?.message || err);
      throw err;
    }
  }

  return true;
}

// Cancel order (re-increment stock if CONFIRMED)
export async function cancelOrder(orderId: string, reason: string): Promise<boolean> {
  const orders = await getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) return false;
  
  const order = orders[orderIndex];
  const oldStatus = order.status;
  if (oldStatus === 'CANCELED') return false;

  // Re-increment stock locally if it was already confirmed (Method B restoration)
  if (oldStatus === 'CONFIRMED' && order.items) {
    const products = await getProducts();
    for (const item of order.items) {
      const pIdx = products.findIndex(p => p.variant.id === item.variant_id);
      if (pIdx !== -1) {
        products[pIdx].variant.stock += item.quantity;
      }
    }
    saveLocalData('batimawad_products', products);
  }

  // Update order status
  order.status = 'CANCELED';
  order.cancellation_reason = reason;
  order.updated_at = new Date().toISOString();

  // Add to stats
  const cancelStats = getLocalData<CancelStat[]>('batimawad_cancel_stats', []);
  cancelStats.push({
    id: 'stat_' + Math.random().toString(36).substr(2, 9),
    order_id: orderId,
    reason: reason,
    created_at: new Date().toISOString()
  });

  saveLocalData('batimawad_orders', orders);
  saveLocalData('batimawad_cancel_stats', cancelStats);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { error: oError } = await supabase
        .from('orders')
        .update({
          status: 'CANCELED',
          cancellation_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (oError) throw oError;

      const { error: sError } = await supabase
        .from('cancel_stats')
        .insert({
          order_id: orderId,
          reason: reason
        });

      if (sError) throw sError;

      // Restore variant stocks in Supabase if order was CONFIRMED
      if (oldStatus === 'CONFIRMED' && order.items) {
        for (const item of order.items) {
          const { data: vData, error: fError } = await supabase
            .from('product_variants')
            .select('stock')
            .eq('id', item.variant_id)
            .single();
            
          if (!fError && vData) {
            const newStock = vData.stock + item.quantity;
            const { error: uError } = await supabase
              .from('product_variants')
              .update({ stock: newStock })
              .eq('id', item.variant_id);
            if (uError) throw uError;
          }
        }
      }
    } catch (err: any) {
      console.error('Supabase cancel update failed:', err?.message || err);
      throw err;
    }
  }

  return true;
}

// Get cancellation statistics
export async function getCancelStats(): Promise<CancelStat[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.from('cancel_stats').select('*');
    if (!error && data) return data as CancelStat[];
  }
  return getLocalData<CancelStat[]>('batimawad_cancel_stats', []);
}

// ============================================
// Service Requests
// ============================================

export async function createServiceRequest(
  data: { serviceName: string; name?: string; email: string; phone?: string; message?: string }
): Promise<ServiceRequest | null> {
  const newRequest: ServiceRequest = {
    id: 'sr_' + Math.random().toString(36).substr(2, 9),
    service_name: data.serviceName,
    name: data.name || null,
    email: data.email,
    phone: data.phone || null,
    message: data.message || null,
    status: 'NEW',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: inserted, error } = await supabase
        .from('service_requests')
        .insert({
          service_name: newRequest.service_name,
          name: newRequest.name,
          email: newRequest.email,
          phone: newRequest.phone,
          message: newRequest.message,
        })
        .select()
        .single();
      if (!error && inserted) return inserted as ServiceRequest;
    } catch (err) {
      console.error('Failed to save service request to Supabase', err);
    }
  }

  // Fallback localStorage
  const existing = getLocalData<ServiceRequest[]>('batimawad_service_requests', []);
  existing.unshift(newRequest);
  saveLocalData('batimawad_service_requests', existing);
  return newRequest;
}

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as ServiceRequest[];
    } catch (err) {
      console.error('Failed to fetch service requests', err);
    }
  }
  return getLocalData<ServiceRequest[]>('batimawad_service_requests', []);
}

export async function updateServiceRequestStatus(
  id: string,
  status: ServiceRequest['status']
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('service_requests')
        .update({ status })
        .eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.error('Failed to update service request', err);
    }
  }

  // Fallback localStorage
  const requests = getLocalData<ServiceRequest[]>('batimawad_service_requests', []);
  const idx = requests.findIndex(r => r.id === id);
  if (idx !== -1) {
    requests[idx].status = status;
    saveLocalData('batimawad_service_requests', requests);
    return true;
  }
  return false;
}
