import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer id="footer" className="border-t border-border/40 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Contact & Adresse (obligatoire PRD) */}
          <div className="flex flex-col items-start">
            <div className="mb-4 bg-white/80 rounded-xl p-1.5 border border-border/10">
              <img
                src="/logo.png"
                alt="Bati Mawad Logo"
                className="h-11 md:h-12 w-auto object-contain"
              />
            </div>
            <p className="mb-4 text-sm text-muted-foreground text-left">
              Votre fournisseur de confiance en matériaux de construction et produits BTP en Algérie.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+213560085969"
                className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 text-primary" />
                0560 08 59 69
              </a>
              <a
                href="tel:+213560085970"
                className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 text-primary" />
                0560 08 59 70
              </a>
              <a
                href="mailto:batimawad@yahoo.fr"
                className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 text-primary" />
                batimawad@yahoo.fr
              </a>
            </div>
          </div>

          {/* Adresse du dépôt (obligatoire PRD) */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
              Notre Dépôt
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  Projet 432 Lofts LPP Semrouni 01
                  <br />
                  Local 10 Bt 08 Ouled Fayet (Alger)
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <p>Sam - Jeu : 8h00 - 17h00</p>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
              Liens Rapides
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Accueil
              </Link>
              <Link href="/catalogue" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Catalogue
              </Link>
              <Link href="/panier" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Mon Panier
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Batim Awad. Tous droits réservés.</p>
          <p className="mt-1">Paiement à la livraison exclusif — Livraison dans les 58 wilayas</p>
        </div>
      </div>
    </footer>
  );
}
