'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, FolderKanban, BarChart3, LogOut, Loader2, Menu, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check local storage for session
    const session = localStorage.getItem("batimawad_admin_session");
    if (!session && pathname !== "/admin/login") {
      setIsAuthenticated(false);
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("batimawad_admin_session");
    router.push("/admin/login");
  };

  // If loading authentication state, show loader
  if (isAuthenticated === null && pathname !== "/admin/login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Login page doesn't get the admin frame
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  const sidebarLinks = [
    { label: "Tableau de Bord", href: "/admin", icon: LayoutDashboard },
    { label: "Commandes", href: "/admin/commandes", icon: ShoppingBag },
    { label: "Produits", href: "/admin/produits", icon: FolderKanban },
    { label: "Demandes Services", href: "/admin/services", icon: Headset },
    { label: "Stats Annulations", href: "/admin/stats", icon: BarChart3 },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between p-4 bg-card border-r border-border/40">
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="bg-white rounded-lg p-1.5 border border-border/10">
            <img
              src="/logo.png"
              alt="Bati Mawad Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
          <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">ADMIN</span>
        </div>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border/40 pt-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-border/40 bg-card px-4 md:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-1.5 border border-border/10">
              <img
                src="/logo.png"
                alt="Bati Mawad Logo"
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">ADMIN</span>
          </Link>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="p-0 w-64 bg-card">
              <SheetTitle className="sr-only">Menu Admin</SheetTitle>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
