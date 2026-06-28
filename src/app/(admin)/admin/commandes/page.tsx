'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone, CheckCircle, XCircle, Clock, Trash2, ShieldAlert, ListFilter, AlertTriangle, Coins, ImageIcon } from "lucide-react";
import { getOrders, validateOrder, cancelOrder, getProducts } from "@/lib/db";
import type { Order, Product, ProductVariant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELED">("PENDING");

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isValiding, setIsValiding] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Details Modal state
  const [selectedDetailsOrder, setSelectedDetailsOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (order: Order) => {
    setSelectedDetailsOrder(order);
    setIsDetailsOpen(true);
  };

  // Form states
  const [deliveryFee, setDeliveryFee] = useState<string>("0");
  const [cancelReason, setCancelReason] = useState<string>("Refus tarif transport");
  const [customReason, setCustomReason] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  const [products, setProducts] = useState<{ product: Product; variant: ProductVariant }[]>([]);

  const getStockIssues = (order: Order | null) => {
    const issues: { title: string; sku: string; requested: number; available: number }[] = [];
    if (!order || !order.items) return issues;
    
    order.items.forEach(item => {
      const match = products.find(p => p.variant.id === item.variant_id);
      const available = match ? match.variant.stock : 0;
      if (available < item.quantity) {
        issues.push({
          title: item.variant?.product?.title || item.variant?.attribute_name || "Produit",
          sku: item.variant?.sku || "",
          requested: item.quantity,
          available
        });
      }
    });
    return issues;
  };

  const fetchOrders = () => {
    setLoading(true);
    Promise.all([getOrders(), getProducts()]).then(([orderData, prodData]) => {
      setOrders(orderData);
      setProducts(prodData);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenValidate = (order: Order) => {
    setSelectedOrder(order);
    setDeliveryFee("1500"); // Standard Alger default fee
    setIsValiding(true);
  };

  const handleOpenCancel = (order: Order) => {
    setSelectedOrder(order);
    setCancelReason("Refus tarif transport");
    setCustomReason("");
    setIsCancelling(true);
  };

  const submitValidate = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);
    const fee = parseFloat(deliveryFee);
    
    if (isNaN(fee) || fee < 0) {
      toast.error("Veuillez saisir un montant de frais de livraison valide.");
      setActionLoading(false);
      return;
    }

    try {
      const success = await validateOrder(selectedOrder.id, fee);
      if (success) {
        toast.success(`Commande de ${selectedOrder.customer_name} validée !`);
        setIsValiding(false);
        fetchOrders();
      } else {
        toast.error("Échec de la validation. Vérifiez si les stocks sont suffisants !");
      }
    } catch (err) {
      toast.error("Une erreur s'est produite lors de la validation.");
    } finally {
      setActionLoading(false);
    }
  };

  const submitCancel = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);

    const finalReason = cancelReason === "Autre" ? customReason : cancelReason;
    if (cancelReason === "Autre" && !customReason.trim()) {
      toast.error("Veuillez spécifier le motif de l'annulation.");
      setActionLoading(false);
      return;
    }

    try {
      const success = await cancelOrder(selectedOrder.id, finalReason);
      if (success) {
        toast.success(`Commande de ${selectedOrder.customer_name} annulée.`);
        setIsCancelling(false);
        fetchOrders();
      } else {
        toast.error("Impossible d'annuler la commande.");
      }
    } catch (err) {
      toast.error("Une erreur s'est produite lors de l'annulation.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter orders by tab
  const filteredOrders = orders.filter((o) => {
    if (activeTab === "ALL") return true;
    return o.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestion des Commandes</h1>
          <p className="text-muted-foreground mt-1">
            Traitez les demandes de devis téléphonique de vos clients.
          </p>
        </div>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          Actualiser la liste
        </Button>
      </div>

      {/* Tabs / Filter Nav */}
      <div className="flex flex-wrap gap-2 border-b border-border/40 pb-px">
        {(["PENDING", "CONFIRMED", "CANCELED", "ALL"] as const).map((tab) => {
          const count = orders.filter(o => tab === "ALL" ? true : o.status === tab).length;
          const label = {
            PENDING: "En Attente",
            CONFIRMED: "Confirmées",
            CANCELED: "Annulées",
            ALL: "Toutes",
          }[tab];

          const colorClass = {
            PENDING: activeTab === "PENDING" ? "border-amber-500 text-amber-500 font-semibold" : "text-muted-foreground hover:text-foreground",
            CONFIRMED: activeTab === "CONFIRMED" ? "border-stock-green text-stock-green font-semibold" : "text-muted-foreground hover:text-foreground",
            CANCELED: activeTab === "CANCELED" ? "border-destructive text-destructive font-semibold" : "text-muted-foreground hover:text-foreground",
            ALL: activeTab === "ALL" ? "border-primary text-primary font-semibold" : "text-muted-foreground hover:text-foreground",
          }[tab];

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm border-b-2 -mb-px transition-colors ${colorClass}`}
            >
              {label} <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-muted">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table view */}
      {loading ? (
        <div className="rounded-lg border border-border/40 bg-card p-20 text-center">
          <Clock className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des commandes en cours...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="border-border/40">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <ListFilter className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg">Aucune commande trouvée</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Il n&apos;y a aucune commande correspondant à ce filtre.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-border/40 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Wilaya & Commune</TableHead>
                <TableHead className="text-right">Sous-total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[180px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">
                    {new Date(order.created_at).toLocaleDateString('fr-DZ')}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{order.customer_name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={order.street_address}>
                      {order.street_address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="inline-flex items-center gap-1.5 font-mono text-sm text-primary hover:underline hover:text-safety-yellow-hover"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {order.customer_phone}
                    </a>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">{order.wilaya}</span>
                    <span className="text-xs text-muted-foreground block">{order.commune}</span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {order.items_subtotal.toLocaleString('fr-DZ')} DA
                  </TableCell>
                  <TableCell>
                    {order.status === 'PENDING' && (
                      <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5">
                        En Attente
                      </Badge>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <div className="space-y-1">
                        <Badge variant="outline" className="border-green-500/30 text-stock-green bg-green-500/5">
                          Confirmée
                        </Badge>
                        {order.delivery_fee !== null && (
                          <div className="text-[10px] text-muted-foreground font-mono">
                            Port : +{order.delivery_fee.toLocaleString('fr-DZ')} DA
                          </div>
                        )}
                      </div>
                    )}
                    {order.status === 'CANCELED' && (
                      <div className="space-y-1">
                        <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/5">
                          Annulée
                        </Badge>
                        {order.cancellation_reason && (
                          <div className="text-[10px] text-muted-foreground max-w-[150px] truncate" title={order.cancellation_reason}>
                            Motif : {order.cancellation_reason}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status === 'PENDING' ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleOpenDetails(order)}
                          variant="outline"
                          className="size-sm text-xs px-2.5 h-8 font-medium"
                        >
                          Détails
                        </Button>
                        <Button
                          onClick={() => handleOpenValidate(order)}
                          className="bg-stock-green text-primary-foreground hover:bg-green-600 size-sm text-xs px-2.5 h-8 font-medium"
                        >
                          Valider
                        </Button>
                        <Button
                          onClick={() => handleOpenCancel(order)}
                          variant="destructive"
                          className="size-sm text-xs px-2.5 h-8 font-medium"
                        >
                          Annuler
                        </Button>
                      </div>
                    ) : order.status === 'CONFIRMED' ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleOpenDetails(order)}
                          variant="outline"
                          className="size-sm text-xs px-2.5 h-8 font-medium"
                        >
                          Détails
                        </Button>
                        <Button
                          onClick={() => handleOpenCancel(order)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 text-xs h-8"
                        >
                          Annuler
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleOpenDetails(order)}
                          variant="outline"
                          className="size-sm text-xs px-2.5 h-8 font-medium"
                        >
                          Détails
                        </Button>
                        <span className="text-xs text-muted-foreground font-medium flex items-center px-2">Traité</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Validation Modal */}
      <Dialog open={isValiding} onOpenChange={setIsValiding}>
        <DialogContent className="sm:max-w-md bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-stock-green" />
              Valider la commande
            </DialogTitle>
            <DialogDescription>
              Entrez les frais de livraison convenus par téléphone avec {selectedOrder?.customer_name}.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 my-2">
              {/* Check stock of each item */}
              {(() => {
                const stockIssues = getStockIssues(selectedOrder);
                if (stockIssues.length > 0) {
                  return (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3 text-xs text-destructive">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                        <div>
                          <strong className="font-semibold block mb-1">Attention : Stock insuffisant</strong>
                          <p>Les articles suivants ne disposent pas d'un stock suffisant pour honorer cette commande :</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 pl-4 border-l border-destructive/20 ml-2">
                        {stockIssues.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white/40 p-2 rounded border">
                            <div className="pr-2">
                              <span className="font-medium text-foreground block">{item.title}</span>
                              <span className="text-[10px] text-muted-foreground">SKU : {item.sku} • Requis : {item.requested} • Dispo : {item.available}</span>
                            </div>
                            <a
                              href={`/admin/produits?search=${encodeURIComponent(item.sku)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] bg-primary text-primary-foreground font-semibold px-2 py-1 rounded hover:bg-safety-yellow-hover shrink-0"
                            >
                              Augmenter le stock ↗
                            </a>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Vous pouvez annuler la commande ou augmenter le stock dans un nouvel onglet ci-dessus.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="bg-background p-4 rounded-lg border border-border/20 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total des articles :</span>
                  <span className="font-mono text-foreground font-bold">{selectedOrder.items_subtotal.toLocaleString('fr-DZ')} DA</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-border/20 pt-2 text-muted-foreground">
                  <span>Destination :</span>
                  <span className="text-foreground font-medium">{selectedOrder.wilaya} - {selectedOrder.commune}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-fee">Frais de livraison négociés (DA)</Label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="delivery-fee"
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    className="pl-9"
                    placeholder="Ex: 1500"
                    min="0"
                    disabled={getStockIssues(selectedOrder).length > 0}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Saisissez 0 si les frais sont offerts ou intégrés.
                </p>
              </div>

              <Separator />

              <div className="flex justify-between items-center bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <span className="text-sm font-semibold text-foreground">Total à régler à la livraison :</span>
                <span className="text-xl font-bold text-primary font-mono">
                  {((selectedOrder.items_subtotal) + (parseFloat(deliveryFee) || 0)).toLocaleString('fr-DZ')} DA
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {selectedOrder && getStockIssues(selectedOrder).length > 0 ? (
              <div className="flex w-full justify-between items-center gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsValiding(false);
                    handleOpenCancel(selectedOrder);
                  }}
                  className="font-medium animate-pulse"
                >
                  Annuler la commande
                </Button>
                <Button variant="outline" onClick={() => setIsValiding(false)}>
                  Fermer
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsValiding(false)} disabled={actionLoading}>
                  Annuler
                </Button>
                <Button
                  onClick={submitValidate}
                  disabled={actionLoading}
                  className="bg-stock-green text-primary-foreground hover:bg-green-600"
                >
                  {actionLoading ? "Validation en cours..." : "✓ Confirmer la commande"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation Modal */}
      <Dialog open={isCancelling} onOpenChange={setIsCancelling}>
        <DialogContent className="sm:max-w-md bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Annuler la commande
            </DialogTitle>
            <DialogDescription>
              Veuillez renseigner le motif d&apos;annulation pour la commande de {selectedOrder?.customer_name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Motif principal *</Label>
              <Select value={cancelReason} onValueChange={(val) => setCancelReason(val || "Refus tarif transport")}>
                <SelectTrigger id="cancel-reason" className="w-full">
                  <SelectValue placeholder="Sélectionner le motif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Refus tarif transport">Refus tarif transport</SelectItem>
                  <SelectItem value="Client injoignable">Client injoignable</SelectItem>
                  <SelectItem value="Doublon">Doublon / Erreur client</SelectItem>
                  <SelectItem value="Rupture de stock">Rupture de stock</SelectItem>
                  <SelectItem value="Autre">Autre motif (spécifier)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {cancelReason === "Autre" && (
              <div className="space-y-2 animate-fade-in-up">
                <Label htmlFor="custom-reason">Description du motif *</Label>
                <Input
                  id="custom-reason"
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Décrivez brièvement la raison..."
                  required
                />
              </div>
            )}

            {selectedOrder?.status === 'CONFIRMED' && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 flex items-start gap-2 text-xs text-destructive">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  <strong>Note importante :</strong> Cette commande est déjà confirmée. L&apos;annuler restaurera automatiquement les stocks des articles en inventaire.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsCancelling(false)} disabled={actionLoading}>
              Retour
            </Button>
            <Button
              onClick={submitCancel}
              disabled={actionLoading}
              variant="destructive"
            >
              {actionLoading ? "Annulation..." : "✗ Confirmer l'annulation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl bg-card border-border/40 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListFilter className="h-5 w-5 text-primary" />
              Détails de la Commande
            </DialogTitle>
            <DialogDescription>
              Fiche récapitulative de la demande client.
            </DialogDescription>
          </DialogHeader>

          {selectedDetailsOrder && (
            <div className="space-y-6 my-2">
              {/* Grid Client Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-background p-4 rounded-lg border border-border/20 space-y-2">
                  <h4 className="font-semibold text-foreground border-b border-border/20 pb-1 text-sm">Informations Client</h4>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p><strong className="text-foreground">Nom :</strong> {selectedDetailsOrder.customer_name}</p>
                    <p><strong className="text-foreground">Téléphone :</strong> {selectedDetailsOrder.customer_phone}</p>
                    <p><strong className="text-foreground">Adresse :</strong> {selectedDetailsOrder.street_address}</p>
                    <p><strong className="text-foreground">Wilaya :</strong> {selectedDetailsOrder.wilaya}</p>
                    <p><strong className="text-foreground">Commune :</strong> {selectedDetailsOrder.commune}</p>
                  </div>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border/20 space-y-2">
                  <h4 className="font-semibold text-foreground border-b border-border/20 pb-1 text-sm">Statut & Historique</h4>
                  <div className="text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Statut actuel :</span>
                      <span>
                        {selectedDetailsOrder.status === 'PENDING' && (
                          <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5">
                            En Attente
                          </Badge>
                        )}
                        {selectedDetailsOrder.status === 'CONFIRMED' && (
                          <Badge variant="outline" className="border-green-500/30 text-stock-green bg-green-500/5">
                            Confirmée
                          </Badge>
                        )}
                        {selectedDetailsOrder.status === 'CANCELED' && (
                          <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/5">
                            Annulée
                          </Badge>
                        )}
                      </span>
                    </div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Date création :</strong> {new Date(selectedDetailsOrder.created_at).toLocaleString('fr-DZ')}</p>
                    {selectedDetailsOrder.status === 'CANCELED' && selectedDetailsOrder.cancellation_reason && (
                      <p className="text-destructive font-medium bg-destructive/5 p-2 rounded border border-destructive/10 text-[11px]">
                        <strong>Motif d'annulation :</strong> {selectedDetailsOrder.cancellation_reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-sm">Articles commandés</h4>
                <div className="rounded-lg border border-border/40 overflow-hidden bg-background">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[60px] text-xs">Photo</TableHead>
                        <TableHead className="text-xs">Produit</TableHead>
                        <TableHead className="text-right text-xs">Prix Unitaire</TableHead>
                        <TableHead className="text-center text-xs">Quantité</TableHead>
                        <TableHead className="text-right text-xs">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDetailsOrder.items && selectedDetailsOrder.items.length > 0 ? (
                        selectedDetailsOrder.items.map((item) => {
                          const title = item.variant?.product?.title || "Produit";
                          const attrName = item.variant?.attribute_name || "Standard";
                          const unitType = item.variant?.unit_type || "";
                          const imgUrl = item.variant?.image_url || null;

                          return (
                            <TableRow key={item.id} className="hover:bg-muted/10 text-xs">
                              <TableCell className="py-2">
                                <div className="relative h-8 w-8 overflow-hidden rounded border border-border bg-white flex items-center justify-center">
                                  {imgUrl && (imgUrl.startsWith('http') || imgUrl.startsWith('/')) ? (
                                    <Image
                                      src={imgUrl}
                                      alt={title}
                                      fill
                                      className="object-contain p-0.5"
                                      sizes="32px"
                                    />
                                  ) : (
                                    <ImageIcon className="h-3 w-3 text-muted-foreground/30" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-2 font-medium">
                                <div className="font-medium text-foreground">{title}</div>
                                <div className="text-[10px] text-muted-foreground">{attrName} {unitType ? `• ${unitType}` : ''}</div>
                              </TableCell>
                              <TableCell className="text-right py-2 font-mono">
                                {item.unit_price.toLocaleString('fr-DZ')} DA
                              </TableCell>
                              <TableCell className="text-center py-2 font-semibold">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right py-2 font-bold font-mono">
                                {item.total_price.toLocaleString('fr-DZ')} DA
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground text-xs">
                            Aucun article trouvé pour cette commande.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Order total info */}
              <div className="bg-muted/20 border rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Sous-total des articles :</span>
                  <span className="font-mono text-foreground font-semibold">{selectedDetailsOrder.items_subtotal.toLocaleString('fr-DZ')} DA</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Frais de livraison :</span>
                  <span className="font-mono text-foreground font-semibold">
                    {selectedDetailsOrder.delivery_fee !== null ? `${selectedDetailsOrder.delivery_fee.toLocaleString('fr-DZ')} DA` : 'Non défini'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm font-bold text-foreground">
                  <span>Total global :</span>
                  <span className="text-primary text-base font-mono">
                    {selectedDetailsOrder.grand_total !== null
                      ? `${selectedDetailsOrder.grand_total.toLocaleString('fr-DZ')} DA`
                      : `${selectedDetailsOrder.items_subtotal.toLocaleString('fr-DZ')} DA`}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 border-t border-border/20 pt-4 mt-2">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Fermer
            </Button>
            {selectedDetailsOrder?.status === 'PENDING' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleOpenCancel(selectedDetailsOrder);
                  }}
                  variant="destructive"
                >
                  Annuler la commande
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleOpenValidate(selectedDetailsOrder);
                  }}
                  className="bg-stock-green text-primary-foreground hover:bg-green-600"
                >
                  Valider la commande
                </Button>
              </div>
            )}
            {selectedDetailsOrder?.status === 'CONFIRMED' && (
              <Button
                onClick={() => {
                  setIsDetailsOpen(false);
                  handleOpenCancel(selectedDetailsOrder);
                }}
                variant="destructive"
              >
                Annuler la commande
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
