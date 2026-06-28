import { Truck, BadgeDollarSign, ShieldCheck } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Livraison 58 Wilayas",
    description: "Nous livrons partout en Algérie avec des transporteurs fiables.",
  },
  {
    icon: BadgeDollarSign,
    title: "Tarifs Professionnels",
    description: "Des prix compétitifs sur les plus grandes marques du BTP.",
  },
  {
    icon: ShieldCheck,
    title: "Expertise Technique",
    description: "Conseil personnalisé par des experts du bâtiment et des travaux publics.",
  },
];

export function ReassuranceBar() {
  return (
    <section className="border-y border-border/40 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="group flex items-start gap-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
