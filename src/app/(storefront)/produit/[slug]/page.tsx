import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProductsServer } from "@/lib/db-server";
import { ProduitClient } from "./produit-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProduitPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch all products server-side — fast, no client round-trip
  const allProducts = await getProductsServer();
  const matching = allProducts.filter((item) => item.product.slug === slug);

  if (matching.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground">Produit non trouvé</h2>
        <p className="mt-2 text-muted-foreground">Ce produit n&apos;existe pas ou a été désactivé.</p>
        <Link href="/catalogue" className="mt-6 inline-flex">
          <Button className="bg-primary text-primary-foreground hover:bg-safety-yellow-hover shadow-md">
            Retour au catalogue
          </Button>
        </Link>
      </div>
    );
  }

  const product = matching[0].product;
  const variants = matching.map((item) => item.variant);

  return <ProduitClient product={product} variants={variants} />;
}
