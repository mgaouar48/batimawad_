import Link from "next/link";
import { ArrowRight, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-background min-h-[60vh] flex items-center">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg-btp.png"
          alt="BTP Construction background"
          fill
          priority
          className="object-cover object-center opacity-75 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.05] z-0">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Glow effects */}
      <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] z-0" />
      <div className="absolute -bottom-20 right-0 h-60 w-60 rounded-full bg-accent/10 blur-[100px] z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:py-32 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in-up">
            <HardHat className="h-4 w-4" />
            Matériaux BTP de qualité professionnelle
          </div>

          {/* Title */}
          <h1 className="mb-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Construisez avec{' '}
            <span className="bg-gradient-to-r from-primary via-safety-yellow to-work-orange bg-clip-text text-transparent">
              confiance
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-xl text-lg text-muted-foreground md:text-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Étanchéité, renforcement structurel, produits de cure et réparation.
            Livraison dans les 58 wilayas d&apos;Algérie.
          </p>

          {/* CTA */}
          <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/catalogue">
              <Button
                size="lg"
                className="group gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-safety-yellow-hover animate-pulse-glow"
              >
                Voir le catalogue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="tel:+213560085969">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-border hover:border-primary hover:text-primary"
              >
                Nous contacter
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {[
              { value: "500+", label: "Produits" },
              { value: "58", label: "Wilayas" },
              { value: "100%", label: "Paiement à la livraison" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
