import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const REVIEWS = [
  {
    name: "Mohamed A.",
    role: "Entrepreneur BTP — Alger",
    rating: 5,
    text: "Excellente qualité de produits. Le SikaLatex et le MonoTop-620 ont parfaitement tenu sur notre chantier de rénovation. Livraison rapide et service client réactif.",
  },
  {
    name: "Karim B.",
    role: "Artisan maçon — Oran",
    rating: 5,
    text: "Je commande régulièrement chez Batim Awad. Les prix sont compétitifs et les produits sont toujours authentiques. Le paiement à la livraison me convient parfaitement.",
  },
  {
    name: "Youcef T.",
    role: "Chef de chantier — Constantine",
    rating: 4,
    text: "Très satisfait du service. L'équipe m'a bien conseillé pour le choix des produits d'étanchéité. La livraison jusqu'à Constantine s'est bien passée.",
  },
];

export function ClientReviews() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Ce que disent nos clients
          </h2>
          <p className="mt-3 text-muted-foreground">
            Des professionnels du BTP nous font confiance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 stagger-children">
          {REVIEWS.map((review) => (
            <Card
              key={review.name}
              className="border-border/50 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
