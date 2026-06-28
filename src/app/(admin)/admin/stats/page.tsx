'use client';

import { useEffect, useState } from "react";
import { BarChart3, AlertTriangle, ArrowLeft, TrendingDown, Clock, ShieldAlert, ShoppingBag, Ban } from "lucide-react";
import { getOrders, getCancelStats } from "@/lib/db";
import type { Order, CancelStat } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReasonCount {
  reason: string;
  count: number;
  percentage: number;
  color: string;
}

export default function AdminStats() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cancelStats, setCancelStats] = useState<CancelStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getCancelStats()]).then(([ordersData, statsData]) => {
      setOrders(ordersData);
      setCancelStats(statsData);
      setLoading(false);
    });
  }, []);

  const cancelledOrders = orders.filter(o => o.status === 'CANCELED');
  const totalOrders = orders.length;
  const cancellationRate = totalOrders > 0 ? (cancelledOrders.length / totalOrders) * 100 : 0;

  // Process reason counts
  const reasonsMap: Record<string, number> = {};
  cancelStats.forEach(stat => {
    reasonsMap[stat.reason] = (reasonsMap[stat.reason] || 0) + 1;
  });

  // Also extract reasons directly from canceled orders as fallback if stats is empty
  if (cancelStats.length === 0 && cancelledOrders.length > 0) {
    cancelledOrders.forEach(o => {
      if (o.cancellation_reason) {
        reasonsMap[o.cancellation_reason] = (reasonsMap[o.cancellation_reason] || 0) + 1;
      }
    });
  }

  const COLORS = [
    "bg-red-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-gray-500",
  ];

  const totalCancellations = Object.values(reasonsMap).reduce((sum, count) => sum + count, 0) || cancelledOrders.length || 1;

  const processedReasons: ReasonCount[] = Object.entries(reasonsMap)
    .map(([reason, count], idx) => ({
      reason,
      count,
      percentage: Math.round((count / totalCancellations) * 100),
      color: COLORS[idx % COLORS.length],
    }))
    .sort((a, b) => b.count - a.count);

  const topReason = processedReasons[0]?.reason || "Aucun motif enregistré";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Statistiques d&apos;Annulations</h1>
        <p className="text-muted-foreground mt-1">
          Analysez les motifs de perte de commandes pour optimiser vos tarifs ou votre logistique.
        </p>
      </div>

      {/* Summary Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Annulations */}
        <Card className="border-border/40 bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground font-medium">Commandes Annulées</span>
              <p className="text-3xl font-bold text-destructive">{cancelledOrders.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Ban className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Taux de Perte */}
        <Card className="border-border/40 bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground font-medium">Taux d&apos;Annulation</span>
              <p className="text-3xl font-bold text-foreground">
                {cancellationRate.toFixed(1)}%
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <TrendingDown className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Motif Principal */}
        <Card className="border-border/40 bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1 overflow-hidden">
              <span className="text-sm text-muted-foreground font-medium block">Motif Récurrent</span>
              <p className="text-lg font-bold text-foreground truncate max-w-[200px]" title={topReason}>
                {topReason}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Reasons Chart Card */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Distribution des Motifs d&apos;Annulation</CardTitle>
            <CardDescription>
              Fréquence relative de chaque motif d&apos;annulation enregistré.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {processedReasons.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucune donnée d&apos;annulation disponible pour le moment.
              </div>
            ) : (
              processedReasons.map((item) => (
                <div key={item.reason} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.reason}</span>
                    <span className="text-muted-foreground font-mono">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Cancellations Log */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Journal des Annulations</CardTitle>
            <CardDescription>
              Historique chronologique des dernières commandes annulées.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cancelledOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucune commande annulée dans le journal.
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 divide-y divide-border/40">
                {cancelledOrders.slice(0, 10).map((order, idx) => (
                  <div key={order.id} className="pt-3 first:pt-0 flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{order.customer_name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(order.updated_at).toLocaleDateString('fr-DZ')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Motif : <strong className="text-destructive font-medium">{order.cancellation_reason || "Non spécifié"}</strong>
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Wilaya : {order.wilaya} • Total article : {order.items_subtotal.toLocaleString('fr-DZ')} DA
                      </p>
                    </div>
                    <Badge variant="outline" className="border-destructive/20 text-destructive bg-destructive/5 text-[10px] shrink-0">
                      Canceled
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
