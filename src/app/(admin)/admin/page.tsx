'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, CheckCircle2, XCircle, Clock, TrendingUp, Phone, ArrowRight, ArrowUpRight, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/lib/db";
import type { Order } from "@/lib/types";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  // Compute stats
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED');
  const cancelledOrders = orders.filter(o => o.status === 'CANCELED');

  const totalSales = confirmedOrders.reduce((sum, o) => sum + (o.grand_total || 0), 0);
  const totalSubtotal = orders.reduce((sum, o) => sum + o.items_subtotal, 0);
  const averageOrderValue = confirmedOrders.length > 0 ? totalSales / confirmedOrders.length : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-10 w-36 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded bg-muted animate-pulse" />
          ))}
        </div>
        <div className="h-96 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos commandes, validez les expéditions et suivez l&apos;activité commerciale.
          </p>
        </div>
        <Link href="/admin/commandes">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-safety-yellow-hover">
            Traiter les Commandes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Counters Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* En Attente */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground font-medium">En Attente</span>
              <p className="text-3xl font-bold text-foreground">{pendingOrders.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Confirmées */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground font-medium">Confirmées</span>
              <p className="text-3xl font-bold text-stock-green">{confirmedOrders.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-stock-green">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Annulées */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground font-medium">Annulées</span>
              <p className="text-3xl font-bold text-destructive">{cancelledOrders.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <XCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Chiffre d'Affaires */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground font-medium">C.A. Confirmé</span>
              <p className="text-2xl font-bold text-foreground truncate">
                {totalSales.toLocaleString('fr-DZ')} <span className="text-xs">DA</span>
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Orders Panel */}
        <Card className="lg:col-span-2 border-border/40 bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Commandes Récentes en Attente</CardTitle>
              <CardDescription>
                Ces demandes de devis doivent être contactées par téléphone.
              </CardDescription>
            </div>
            <Link href="/admin/commandes">
              <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-safety-yellow-hover">
                Voir tout
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-stock-green mb-3 opacity-60" />
                <h3 className="font-semibold text-foreground">Aucune commande en attente</h3>
                <p className="text-xs text-muted-foreground mt-1">Excellent travail ! Tout est traité.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {pendingOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-2 first:pt-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{order.customer_name}</span>
                        <Badge variant="outline" className="text-amber-500 bg-amber-500/5 border-amber-500/20 text-[10px]">
                          Attente appel
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span>Wilaya : <strong className="text-foreground">{order.wilaya}</strong></span>
                        <span>Date : {new Date(order.created_at).toLocaleDateString('fr-DZ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-sm font-bold text-foreground">
                        {order.items_subtotal.toLocaleString('fr-DZ')} DA
                      </span>
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-safety-yellow-hover transition-colors"
                        title="Appeler le client"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Stats Overview */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Indicateurs Standardiste</CardTitle>
            <CardDescription>Indicateurs de performance et statistiques.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-background p-4 border border-border/20 flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Taux d&apos;annulation</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {orders.length > 0 ? ((cancelledOrders.length / orders.length) * 100).toFixed(0) : 0}%
                </span>
                <span className="text-xs text-muted-foreground">de toutes les demandes</span>
              </div>
            </div>

            <div className="rounded-lg bg-background p-4 border border-border/20 flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Panier Moyen Validé</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stock-green">
                  {averageOrderValue.toLocaleString('fr-DZ')} DA
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-background p-4 border border-border/20 flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Total Demandes Reçues</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{orders.length}</span>
                <span className="text-xs text-muted-foreground">devis au total</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
