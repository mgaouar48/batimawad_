import { getProductsServer, getCategoriesServer } from "@/lib/db-server";
import { CatalogueClient } from "./catalogue-client";

export default async function CataloguePage() {
  // Fetch on the server — data arrives with the initial HTML
  const [products, categories] = await Promise.all([
    getProductsServer(),
    getCategoriesServer(),
  ]);

  return <CatalogueClient initialProducts={products} initialCategories={categories} />;
}
