'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, User, MessageSquare, Clock, CheckCircle2, CircleDot, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getServiceRequests, updateServiceRequestStatus } from '@/lib/db';
import type { ServiceRequest } from '@/lib/types';
import { toast, Toaster } from 'sonner';

const SERVICE_ICONS: Record<string, string> = {
  'Conseil technique': '📋',
  'Livraison et logistique': '🚚',
  'Assistance sur chantier': '🪖',
  'Contrôle de qualité': '🛡️',
};

const STATUS_CONFIG = {
  NEW: { label: 'Nouvelle', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  READ: { label: 'Vue', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  DONE: { label: 'Traitée', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
};

export default function AdminServicesPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'ALL' | ServiceRequest['status']>('ALL');
  const [filterService, setFilterService] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getServiceRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleStatusChange = async (id: string, status: ServiceRequest['status']) => {
    setUpdatingId(id);
    const success = await updateServiceRequestStatus(id, status);
    if (success) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast.success('Statut mis à jour.');
    } else {
      toast.error('Erreur lors de la mise à jour.');
    }
    setUpdatingId(null);
  };

  const allServices = [...new Set(requests.map(r => r.service_name))];

  const filtered = requests.filter(r => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    if (filterService !== 'ALL' && r.service_name !== filterService) return false;
    return true;
  });

  const newCount = requests.filter(r => r.status === 'NEW').length;
  const readCount = requests.filter(r => r.status === 'READ').length;
  const doneCount = requests.filter(r => r.status === 'DONE').length;

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demandes de Services</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Formulaires de contact reçus depuis la page des services.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRequests} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <CircleDot className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{newCount}</p>
              <p className="text-xs text-blue-600">Nouvelles</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700">{readCount}</p>
              <p className="text-xs text-amber-600">En cours</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{doneCount}</p>
              <p className="text-xs text-green-600">Traitées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filtrer :</span>
            </div>

            {/* Status filter */}
            <div className="flex gap-2 flex-wrap">
              {(['ALL', 'NEW', 'READ', 'DONE'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {status === 'ALL' ? 'Tous les statuts' : STATUS_CONFIG[status].label}
                </button>
              ))}
            </div>

            {/* Service filter */}
            {allServices.length > 0 && (
              <div className="flex gap-2 flex-wrap border-l border-border pl-3">
                <button
                  onClick={() => setFilterService('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    filterService === 'ALL'
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Tous les services
                </button>
                {allServices.map(service => (
                  <button
                    key={service}
                    onClick={() => setFilterService(service)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      filterService === service
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-card border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {SERVICE_ICONS[service] || '📌'} {service}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-full rounded bg-muted animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Mail className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
            </div>
            <p className="font-semibold text-foreground">Aucune demande trouvée</p>
            <p className="text-sm text-muted-foreground mt-1">
              {requests.length === 0
                ? 'Aucune demande de service reçue pour le moment.'
                : 'Aucune demande ne correspond aux filtres sélectionnés.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => {
            const statusCfg = STATUS_CONFIG[req.status];
            return (
              <Card key={req.id} className={`transition-all ${req.status === 'NEW' ? 'border-blue-200 shadow-sm shadow-blue-100' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">

                    {/* Left: info */}
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Service + Badge */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1 text-sm font-bold text-foreground">
                          <span>{SERVICE_ICONS[req.service_name] || '📌'}</span>
                          {req.service_name}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusCfg.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(req.created_at).toLocaleDateString('fr-DZ', {
                            day: '2-digit', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Contact info */}
                      <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                        {req.name && (
                          <span className="flex items-center gap-1.5 text-sm text-foreground font-medium">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            {req.name}
                          </span>
                        )}
                        <a
                          href={`mailto:${req.email}`}
                          className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {req.email}
                        </a>
                        {req.phone && (
                          <a
                            href={`tel:${req.phone}`}
                            className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors font-medium"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {req.phone}
                          </a>
                        )}
                      </div>

                      {/* Message */}
                      {req.message && (
                        <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                          <MessageSquare className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                          <p className="text-sm text-muted-foreground leading-relaxed">{req.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Right: status actions */}
                    <div className="flex flex-col gap-2 items-end shrink-0">
                      {req.status !== 'READ' && req.status !== 'DONE' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updatingId === req.id}
                          onClick={() => handleStatusChange(req.id, 'READ')}
                          className="gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50"
                        >
                          <Clock className="h-3.5 w-3.5" />
                          Marquer vue
                        </Button>
                      )}
                      {req.status !== 'DONE' && (
                        <Button
                          size="sm"
                          disabled={updatingId === req.id}
                          onClick={() => handleStatusChange(req.id, 'DONE')}
                          className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Marquer traitée
                        </Button>
                      )}
                      {req.status === 'DONE' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={updatingId === req.id}
                          onClick={() => handleStatusChange(req.id, 'NEW')}
                          className="gap-1.5 text-muted-foreground hover:text-foreground text-xs"
                        >
                          Réouvrir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground pb-4">
        {filtered.length} demande{filtered.length !== 1 ? 's' : ''} affichée{filtered.length !== 1 ? 's' : ''}
        {requests.length !== filtered.length ? ` sur ${requests.length} au total` : ''}
      </p>
    </div>
  );
}
