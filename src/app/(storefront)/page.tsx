import { HeroBanner } from "@/components/storefront/HeroBanner";
import { ReassuranceBar } from "@/components/storefront/ReassuranceBar";
import { ServicesCarousel } from "@/components/storefront/ServicesCarousel";
import { BestSellers } from "@/components/storefront/BestSellers";
import { BrandMarquee } from "@/components/storefront/BrandMarquee";
import { ClientReviews } from "@/components/storefront/ClientReviews";
import { getProductsServer } from "@/lib/db-server";

export default async function HomePage() {
  // Fetch products on the server — no client-side network round-trip
  const allProducts = await getProductsServer();
  const featured = allProducts.filter((p) => p.product.is_featured && p.product.is_active);

  return (
    <>
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Marques Partenaires (Marquee) */}
      <BrandMarquee />

      {/* 3. Barre de Réassurance */}
      <ReassuranceBar />

      {/* 4. Carrousel des Services */}
      <ServicesCarousel />

      {/* 5. Grille Meilleures Ventes */}
      <BestSellers initialProducts={featured} />

      {/* 6. Avis Clients */}
      <ClientReviews />

      {/* 7. Footer — handled in layout */}
    </>
  );
}
