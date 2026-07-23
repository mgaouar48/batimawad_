import { createAdminClient } from './supabase/admin';
import type { Category, Product, ProductVariant } from './types';

// Demo data fallback (same as client-side db.ts)
const DEMO_CATEGORIES: Category[] = [
  { id: "etancheite", name: "Étanchéité & Cuvelage", slug: "etancheite", description: "Produits pour l'étanchéité des fondations et toitures", icon_url: null, sort_order: 1, created_at: new Date().toISOString() },
  { id: "renforcement", name: "Renforcement Structurel", slug: "renforcement", description: "Solutions de renforcement de structures en béton armé", icon_url: null, sort_order: 2, created_at: new Date().toISOString() },
  { id: "finitions", name: "Pose & Finitions", slug: "finitions", description: "Colles à carrelage, joints et enduits", icon_url: null, sort_order: 3, created_at: new Date().toISOString() },
  { id: "adjuvants", name: "Adjuvants Béton", slug: "adjuvants", description: "Plastifiants, hydrofuges et accélérateurs", icon_url: null, sort_order: 4, created_at: new Date().toISOString() },
  { id: "reparation", name: "Réparation du Béton", slug: "reparation", description: "Mortiers de réparation structurelle", icon_url: null, sort_order: 5, created_at: new Date().toISOString() },
  { id: "protection", name: "Protection & Imperméabilisation", slug: "protection", description: "Revêtements protecteurs pour sols et murs", icon_url: null, sort_order: 6, created_at: new Date().toISOString() },
];

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

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    url !== 'your_supabase_url_here' &&
    anonKey &&
    anonKey !== 'your_supabase_anon_key_here'
  );
}

import { unstable_cache } from 'next/cache';

// Server-side: fetch active products with variants (cached for 60s for instant route transitions)
export const getProductsServer = unstable_cache(
  async (): Promise<{ product: Product; variant: ProductVariant }[]> => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data: products, error } = await supabase
          .from('products')
          .select('*, category:categories(*), product_variants(*)')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (!error && products) {
          const result: { product: Product; variant: ProductVariant }[] = [];
          products.forEach((p: any) => {
            const pVariants = p.product_variants || [];
            const { product_variants, ...productData } = p;
            pVariants.forEach((v: any) => {
              result.push({
                product: { ...productData, category: productData.category },
                variant: v,
              });
            });
          });
          return result;
        }
      } catch (err) {
        console.error('Server getProducts failed:', err);
      }
    }
    return INITIAL_PRODUCTS;
  },
  ['products-server-cache'],
  { revalidate: 60, tags: ['products'] }
);

// Server-side: fetch categories (cached for 60s for instant route transitions)
export const getCategoriesServer = unstable_cache(
  async (): Promise<Category[]> => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });
        if (!error && data) return data as Category[];
      } catch (err) {
        console.error('Server getCategories failed:', err);
      }
    }
    return DEMO_CATEGORIES;
  },
  ['categories-server-cache'],
  { revalidate: 60, tags: ['categories'] }
);

