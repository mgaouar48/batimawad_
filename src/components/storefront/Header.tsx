'use client';

import Link from "next/link";
import { Menu, Phone, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Contact", href: "#footer" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 transition-all duration-300">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Bati Mawad Logo"
            className="h-14 md:h-18 w-auto object-contain object-left transition-all"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:+213560085969"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            <span>Appelez-nous</span>
          </a>
          <Link href="/panier">
            <Button variant="outline" size="sm" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Panier
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            }
          />
          <SheetContent side="right" className="w-72 bg-background">
            <div className="mb-6 mt-2">
              <SheetTitle>
                <img
                  src="/logo.png"
                  alt="Bati Mawad Logo"
                  className="h-10 w-auto object-contain object-left"
                />
              </SheetTitle>
            </div>
            <nav className="mt-8 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-4 h-px bg-border" />
              <a
                href="tel:+213560085969"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Phone className="h-5 w-5 text-primary" />
                Appelez-nous
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
