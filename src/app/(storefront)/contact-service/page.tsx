'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Send, CheckCircle2, Loader2,
  ClipboardCheck, Truck, HardHat, ShieldCheck, Mail, Phone, User, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createServiceRequest } from '@/lib/db';
import { toast, Toaster } from 'sonner';

const SERVICES = [
  { id: 'conseil', label: 'Conseil technique', icon: ClipboardCheck, color: 'from-amber-500/20 to-amber-600/10' },
  { id: 'livraison', label: 'Livraison et logistique', icon: Truck, color: 'from-blue-500/20 to-blue-600/10' },
  { id: 'assistance', label: 'Assistance sur chantier', icon: HardHat, color: 'from-orange-500/20 to-orange-600/10' },
  { id: 'qualite', label: 'Contrôle de qualité', icon: ShieldCheck, color: 'from-green-500/20 to-green-600/10' },
];

function ContactServiceForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceParam = searchParams.get('service') || '';

  const [selectedService, setSelectedService] = useState(serviceParam);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<{ email?: string; service?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (serviceParam) setSelectedService(serviceParam);
  }, [serviceParam]);

  const validate = () => {
    const newErrors: { email?: string; service?: string } = {};
    if (!form.email.trim()) {
      newErrors.email = "L'email est obligatoire.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Adresse email invalide.";
    }
    if (!selectedService) {
      newErrors.service = "Veuillez sélectionner un service.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const serviceLabel = SERVICES.find(s => s.id === selectedService)?.label || selectedService;
      await createServiceRequest({
        serviceName: serviceLabel,
        name: form.name || undefined,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message || undefined,
      });
      setSuccess(true);
    } catch {
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-foreground">Demande envoyée !</h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          Merci pour votre demande. Notre équipe vous contactera dans les plus brefs délais à l'adresse <strong>{form.email}</strong>.
        </p>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />Retour à l'accueil
            </Button>
          </Link>
          <Button onClick={() => { setSuccess(false); setForm({ name: '', email: '', phone: '', message: '' }); }}>
            Nouvelle demande
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
          Nous contacter
        </h1>
        <p className="text-muted-foreground">
          Décrivez votre besoin et notre équipe vous répondra rapidement.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service selector */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-foreground">
            Service concerné <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedService === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => { setSelectedService(service.id); setErrors(e => ({ ...e, service: undefined })); }}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="leading-tight">{service.label}</span>
                </button>
              );
            })}
          </div>
          {errors.service && <p className="mt-2 text-xs text-destructive">{errors.service}</p>}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
          <div className="relative flex justify-center text-xs text-muted-foreground">
            <span className="bg-background px-3">Vos coordonnées</span>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            <span className="flex items-center gap-2"><User className="h-3.5 w-3.5" />Nom complet</span>
          </label>
          <Input
            id="contact-name"
            type="text"
            placeholder="Ex : Ahmed Benali"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="h-11"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            <span className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />Email <span className="text-destructive">*</span>
            </span>
          </label>
          <Input
            id="contact-email"
            type="email"
            placeholder="votre@email.com"
            value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })); }}
            className={`h-11 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          />
          {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />Numéro de téléphone</span>
          </label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="Ex : 06 00 00 00 00"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="h-11"
          />
        </div>

        {/* Message */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            <span className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" />Votre message</span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Décrivez votre besoin, votre projet ou posez vos questions..."
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none transition-colors"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-bold gap-2"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Envoi en cours...</>
          ) : (
            <><Send className="h-4 w-4" />Envoyer ma demande</>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Nous vous répondons généralement sous 24h ouvrées.
        </p>
      </form>
    </div>
  );
}

export default function ContactServicePage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <Toaster richColors position="top-right" />
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <ContactServiceForm />
      </Suspense>
    </div>
  );
}
