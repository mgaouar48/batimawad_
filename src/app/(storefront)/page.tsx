import { HeroBanner } from "@/components/storefront/HeroBanner";
import { ReassuranceBar } from "@/components/storefront/ReassuranceBar";
import { ServicesCarousel } from "@/components/storefront/ServicesCarousel";
import { BestSellers } from "@/components/storefront/BestSellers";
import { BrandMarquee } from "@/components/storefront/BrandMarquee";
import { ClientReviews } from "@/components/storefront/ClientReviews";

export default function HomePage() {
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
      <BestSellers />

      {/* 6. Avis Clients */}
      <ClientReviews />

      {/* 7. Footer — handled in layout */}
    </>
  );
}
