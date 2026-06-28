'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { WILAYAS, getCommunesByWilaya } from "@/lib/wilayas";
import { createOrder } from "@/lib/db";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, isLoaded, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    wilaya: "",
    commune: "",
    streetAddress: "",
  });

  const communes = form.wilaya ? getCommunesByWilaya(form.wilaya) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderItems = cart.items.map(item => ({
        variantId: item.variantId,
        productId: item.productId,
        productTitle: item.productTitle,
        variantName: item.variantName,
        unitType: item.unitType,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));

      await createOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        wilaya: form.wilaya,
        commune: form.commune,
        streetAddress: form.streetAddress,
      }, orderItems);

      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-12 rounded bg-muted" />
          <div className="h-64 rounded bg-muted" />
        </div>
      </div>
    );
  }

  // Confirmation
  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Demande envoyée !</h1>
        <p className="mt-4 text-muted-foreground">
          Votre demande a été envoyée avec succès. Un conseiller vous appellera prochainement pour confirmer votre commande et vous communiquer les frais de livraison.
        </p>
        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 text-primary" />
            Toute modification se fera lors de l&apos;appel de confirmation.
          </div>
        </div>
        <Button
          onClick={() => router.push("/")}
          className="mt-8 gap-2 bg-primary text-primary-foreground hover:bg-safety-yellow-hover"
        >
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  // Empty cart redirect
  if (cart.items.length === 0) {
    router.push("/panier");
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Finaliser ma demande</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="space-y-6 lg:col-span-3">
            {/* Coordonnées */}
            <Card className="border-border/50 bg-card">
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-bold text-foreground">Vos coordonnées</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Nom complet *</Label>
                    <Input
                      id="customerName"
                      required
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      placeholder="ex: Mohamed Benali"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Numéro de téléphone *</Label>
                    <Input
                      id="customerPhone"
                      required
                      type="tel"
                      value={form.customerPhone}
                      onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                      placeholder="ex: 0555 00 00 00"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adresse */}
            <Card className="border-border/50 bg-card">
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-bold text-foreground">Adresse de livraison</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wilaya">Wilaya *</Label>
                    <Select
                      value={form.wilaya}
                      onValueChange={(v) => setForm({ ...form, wilaya: v || "", commune: "" })}
                    >
                      <SelectTrigger id="wilaya" className="mt-1">
                        <SelectValue placeholder="Sélectionner votre wilaya" />
                      </SelectTrigger>
                      <SelectContent>
                        {WILAYAS.map((w) => (
                          <SelectItem key={w.code} value={w.name}>
                            {w.code} - {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {communes.length > 0 && (
                    <div>
                      <Label htmlFor="commune">Commune *</Label>
                      <Select
                        value={form.commune}
                        onValueChange={(v) => setForm({ ...form, commune: v || "" })}
                      >
                        <SelectTrigger id="commune" className="mt-1">
                          <SelectValue placeholder="Sélectionner votre commune" />
                        </SelectTrigger>
                        <SelectContent>
                          {communes.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="streetAddress">Adresse complète *</Label>
                    <Textarea
                      id="streetAddress"
                      required
                      value={form.streetAddress}
                      onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                      placeholder="Rue, numéro, quartier, repères..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-20 border-border/50 bg-card">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold text-foreground">Récapitulatif</h3>

                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.variantId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate max-w-[60%]">
                        {item.productTitle} × {item.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        {(item.price * item.quantity).toLocaleString('fr-DZ')} DA
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">{subtotal.toLocaleString('fr-DZ')} DA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-medium text-primary">À définir par téléphone</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between">
                  <span className="font-bold">Total provisoire</span>
                  <span className="text-xl font-bold">{subtotal.toLocaleString('fr-DZ')} DA</span>
                </div>

                {/* Avertissement PRD */}
                <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-xs text-muted-foreground">
                      Un conseiller vous appellera pour vous communiquer le tarif du transporteur avant expédition.
                    </p>
                  </div>
                </div>

                {/* Bouton PRD: "Envoyer ma demande" (PAS "Payer" / "Commander") */}
                <Button
                  type="submit"
                  disabled={submitting || !form.customerName || !form.customerPhone || !form.wilaya || !form.commune || !form.streetAddress}
                  className="mt-6 w-full gap-2 bg-primary text-primary-foreground hover:bg-safety-yellow-hover disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer ma demande
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
