import Image from "next/image";

const BRANDS = [
  { name: "Sika", src: "/logos-marques/Sika.svg" },
  { name: "BASF", src: "/logos-marques/BASF-Logo.wine.webp" },
  { name: "Neoquim", src: "/logos-marques/NEOQUIM-LOGO-1.avif" },
  { name: "MasterEmaco", src: "/logos-marques/MasterEmacoP15720LitresPail_378x_35353e36-1dc1-4241-8669-f0b7a78d5a39.webp" },
  { name: "Marque 5", src: "/logos-marques/237482702_368958174639134_4558340341276487130_n-removebg-preview.webp" },
  { name: "Marque 6", src: "/logos-marques/287918451_8189803341060290_937577361437842272_n-removebg-preview.webp" },
  { name: "Marque 7", src: "/logos-marques/326278089_5855010624579489_756974369783145518_n-removebg-preview.webp" },
  { name: "Marque 8", src: "/logos-marques/348254029_961885844834886_5118812912126308412_n-removebg-preview.webp" },
  { name: "Marque 9", src: "/logos-marques/419945556_1449565169184117_3050070360332846690_n.webp" },
];

export function BrandMarquee() {
  // Triple the brands for smooth infinite scroll
  const tripled = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section className="overflow-hidden border-y border-border/40 bg-card/30 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Nos Marques Partenaires
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Des fabricants de renommée mondiale
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-background to-transparent" />

        {/* Scrolling row */}
        <div className="flex animate-marquee items-center gap-4 py-3">
          {tripled.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex h-20 w-32 shrink-0 items-center justify-center sm:h-24 sm:w-44"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={160}
                height={80}
                className="max-h-16 w-auto object-contain sm:max-h-20"
                style={{ filter: 'none' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
