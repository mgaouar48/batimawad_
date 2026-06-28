import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Batim Awad — Matériaux BTP & Construction en Algérie",
    template: "%s | Batim Awad",
  },
  description:
    "Votre fournisseur de confiance en matériaux de construction, étanchéité, renforcement structurel et produits BTP. Livraison partout en Algérie. Paiement à la livraison.",
  keywords: [
    "matériaux construction",
    "BTP Algérie",
    "Sika",
    "BASF",
    "étanchéité",
    "renforcement",
    "cuvelage",
    "béton",
    "ciment",
  ],
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: "https://chezbatimawad.com",
    siteName: "Batim Awad",
    title: "Batim Awad — Matériaux BTP & Construction",
    description:
      "Matériaux de construction et produits BTP de qualité professionnelle. Livraison dans les 58 wilayas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
