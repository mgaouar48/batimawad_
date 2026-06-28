import { Header } from "@/components/storefront/Header";
import { BottomBar } from "@/components/storefront/BottomBar";
import { Footer } from "@/components/storefront/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomBar />
      <Toaster richColors position="top-right" />
    </>
  );
}
