'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Search, SlidersHorizontal, Package, Check, X, ShieldAlert, ImageIcon } from "lucide-react";
import { getAllProducts, getCategories, saveProduct, deleteProduct, generateUUID } from "@/lib/db";
import type { Product, ProductVariant, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";

export default function AdminProducts() {
  const [products, setProducts] = useState<{ product: Product; variant: ProductVariant }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Form / Modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<{ product: Product; variant: ProductVariant } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{ productId: string; variantId: string; title: string } | null>(null);

  // Form Fields state
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [attributeName, setAttributeName] = useState("");
  const [unitType, setUnitType] = useState("");
  const [price, setPrice] = useState("0");
  const [stock, setStock] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.url) {
        setImageUrl(data.url);
        toast.success("Image téléversée avec succès !");
      } else {
        toast.error(data.error || "Échec du téléversement de l'image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue lors de l'envoi du fichier.");
    } finally {
      setUploading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([getAllProducts(), getCategories()]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      toast.error("Erreur de chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const search = params.get('search');
      if (search) {
        setSearchQuery(search);
      }
    }
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle("");
    setShortDesc("");
    setCategoryId(categories[0]?.id || "");
    setSku("");
    setAttributeName("Standard");
    setUnitType("sac de 25kg");
    setPrice("0");
    setStock("0");
    setImageUrl("");
    setIsActive(true);
    setIsFeatured(false);
    setIsEditing(true);
  };

  const handleOpenEdit = (item: { product: Product; variant: ProductVariant }) => {
    setEditingItem(item);
    setTitle(item.product.title);
    setShortDesc(item.product.short_desc);
    setCategoryId(item.product.category_id || "");
    setSku(item.variant.sku);
    setAttributeName(item.variant.attribute_name);
    setUnitType(item.variant.unit_type);
    setPrice(item.variant.price.toString());
    setStock(item.variant.stock.toString());
    setImageUrl(item.variant.image_url || "");
    setIsActive(item.product.is_active);
    setIsFeatured(item.product.is_featured);
    setIsEditing(true);
  };

  const handleOpenDelete = (item: { product: Product; variant: ProductVariant }) => {
    setDeletingItem({
      productId: item.product.id,
      variantId: item.variant.id,
      title: `${item.product.title} (${item.variant.attribute_name})`,
    });
    setIsDeleting(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !unitType.trim() || !sku.trim()) {
      toast.error("Veuillez remplir les champs obligatoires (Titre, SKU, Unité).");
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);

    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Prix invalide.");
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error("Stock invalide.");
      return;
    }

    const newProduct: Product = {
      id: editingItem ? editingItem.product.id : 'prod_' + Math.random().toString(36).substr(2, 9),
      category_id: categoryId || null,
      title,
      slug: editingItem
        ? editingItem.product.slug
        : title.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
      short_desc: shortDesc,
      is_active: isActive,
      is_featured: isFeatured,
      created_at: editingItem ? editingItem.product.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newVariant: ProductVariant = {
      id: editingItem ? editingItem.variant.id : 'var_' + Math.random().toString(36).substr(2, 9),
      product_id: newProduct.id,
      sku,
      attribute_name: attributeName,
      unit_type: unitType,
      price: priceNum,
      stock: stockNum,
      image_url: imageUrl.trim() || null,
      created_at: editingItem ? editingItem.variant.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await saveProduct(newProduct, newVariant);
      toast.success(editingItem ? "Produit mis à jour !" : "Produit ajouté avec succès !");
      setIsEditing(false);
      loadData();
    } catch (err) {
      toast.error("Erreur d'enregistrement.");
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deletingItem) return;
    try {
      await deleteProduct(deletingItem.productId, deletingItem.variantId);
      toast.success("Produit supprimé.");
      setIsDeleting(false);
      loadData();
    } catch (err) {
      toast.error("Erreur de suppression.");
    }
  };

  const filtered = products.filter(({ product, variant }) => {
    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variant.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" />

      {/* Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestion du Catalogue</h1>
          <p className="text-muted-foreground mt-1">
            Ajoutez, modifiez ou retirez des produits et gérez les niveaux de stocks.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 bg-primary text-primary-foreground hover:bg-safety-yellow-hover">
          <Plus className="h-4 w-4" />
          Ajouter un Produit
        </Button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "all")}>
            <SelectTrigger className="w-56">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Catégorie" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="rounded-lg border border-border/40 bg-card p-20 text-center animate-pulse">
          <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
          <div className="h-4 w-48 rounded bg-muted mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/40">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg">Aucun produit trouvé</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Essayez de modifier votre recherche ou ajoutez un produit.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-border/40 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[60px]">Photo</TableHead>
                <TableHead className="w-[100px]">SKU</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Actif</TableHead>
                <TableHead className="w-[130px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(({ product, variant }) => {
                const categoryName = categories.find((c) => c.id === product.category_id)?.name || "Non classé";

                return (
                  <TableRow key={`${product.id}-${variant.id}`} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-border/50 bg-white flex items-center justify-center shrink-0">
                        {variant.image_url && (variant.image_url.startsWith('http://') || variant.image_url.startsWith('https://') || variant.image_url.startsWith('/')) ? (
                          <Image
                            src={variant.image_url}
                            alt={product.title}
                            fill
                            className="object-contain p-0.5"
                            sizes="40px"
                          />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold">{variant.sku}</TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{product.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {variant.attribute_name} • <span className="font-medium">{variant.unit_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs bg-muted/30">
                        {categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      {variant.price.toLocaleString('fr-DZ')} DA
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-semibold text-sm ${variant.stock <= 0 ? 'text-destructive' : variant.stock <= 5 ? 'text-stock-orange' : 'text-stock-green'}`}>
                        {variant.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {product.is_active ? (
                        <Check className="h-4 w-4 text-stock-green mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-destructive mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          onClick={() => handleOpenEdit({ product, variant })}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleOpenDelete({ product, variant })}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit / Add Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-lg bg-card border-border/40 max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Modifier le Produit" : "Ajouter un Nouveau Produit"}
              </DialogTitle>
              <DialogDescription>
                Renseignez les détails du produit et sa variante par défaut.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* Product title — full width */}
              <div className="space-y-2">
                <Label htmlFor="title">Nom du produit *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sikaflex PRO-11 FC"
                  required
                />
              </div>

              {/* Short desc — full width */}
              <div className="space-y-2">
                <Label htmlFor="shortDesc">Description courte</Label>
                <Textarea
                  id="shortDesc"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Mastic-colle polyuréthane haute performance..."
                  rows={2}
                />
              </div>

              {/* Category — full width */}
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={categoryId} onValueChange={(val) => setCategoryId(val || "")}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SKU — full width */}
              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Référence *</Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKF-PRO11-GR"
                  required
                />
              </div>

              {/* Variant + Unit — 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="attrName">Conditionnement</Label>
                  <Input
                    id="attrName"
                    value={attributeName}
                    onChange={(e) => setAttributeName(e.target.value)}
                    placeholder="ex: Gris - 300ml"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitType">Unité de vente *</Label>
                  <Input
                    id="unitType"
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                    placeholder="ex: cartouche de 300ml"
                    required
                  />
                </div>
              </div>

              {/* Price + Stock — 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix unitaire (DA) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Quantité en Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Photo du produit (Téléchargement / Upload & URL) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Photo du produit
                </Label>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* File Upload Button */}
                  <div className="flex flex-col justify-center rounded-lg border border-dashed border-border p-4 bg-muted/10 text-center hover:bg-muted/20 transition-all relative">
                    <input
                      type="file"
                      id="imageFile"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">
                        {uploading ? "Téléversement..." : "Télécharger une photo"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Image (PNG, JPG, etc.)</span>
                    </div>
                  </div>

                  {/* Image Preview / Details */}
                  <div className="flex items-center justify-center rounded-lg border bg-white p-2">
                    {imageUrl ? (
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border/50">
                        <Image
                          src={imageUrl}
                          alt="Aperçu du produit"
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    ) : (
                      <div className="text-center p-2">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/20 mx-auto mb-1" />
                        <span className="text-[10px] text-muted-foreground block">Aucun aperçu</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between rounded-lg border border-border/40 p-3 bg-muted/20">
                <div className="space-y-0.5">
                  <Label htmlFor="is-active" className="text-sm font-medium">Afficher sur le site</Label>
                  <p className="text-xs text-muted-foreground">Rendre le produit visible dans le catalogue public.</p>
                </div>
                <input
                  type="checkbox"
                  id="is-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-card"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/40 p-3 bg-muted/20">
                <div className="space-y-0.5">
                  <Label htmlFor="is-featured" className="text-sm font-medium">Meilleure vente</Label>
                  <p className="text-xs text-muted-foreground">Afficher en page d&apos;accueil dans la section vedette.</p>
                </div>
                <input
                  type="checkbox"
                  id="is-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-card"
                />
              </div>
            </div>

            <DialogFooter className="border-t border-border/20 pt-4 mt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-safety-yellow-hover font-semibold">
                Sauvegarder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-md bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Supprimer le produit ?
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer &quot;{deletingItem?.title}&quot; ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
