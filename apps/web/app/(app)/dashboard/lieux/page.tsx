"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Users,
  Euro,
  Calendar,
  User,
  Mail,
} from "lucide-react";
import {
  Button,
  Card,
  Modal,
  Input,
  Select,
  Badge,
  useToast,
} from "@carnetmariage/ui";
import {
  VENUE_STATUSES,
  type Venue,
  type VenueStatus,
} from "@carnetmariage/core";
import { formatPrice, prettyDate } from "@/lib/utils";

const statusOptions = Object.entries(VENUE_STATUSES).map(([value, label]) => ({
  value,
  label,
}));

const statusBadgeVariant: Record<string, "info" | "warning" | "success"> = {
  visit: "info",
  option: "warning",
  booked: "success",
};

const emptyForm = {
  name: "",
  location: "",
  price: "",
  capacity: "",
  status: "visit" as VenueStatus,
  contact_name: "",
  contact_email: "",
  visit_date: "",
  notes: "",
};

export default function LieuxPage() {
  const { toast } = useToast();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchVenues = useCallback(async () => {
    try {
      const res = await fetch("/api/venues");
      const json = await res.json();
      if (json.ok) setVenues(json.data);
    } catch {
      toast("Erreur lors du chargement des lieux", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(venue: Venue) {
    setEditingId(venue.id);
    setForm({
      name: venue.name,
      location: venue.location || "",
      price: String(venue.price || 0),
      capacity: String(venue.capacity || 0),
      status: venue.status as VenueStatus,
      contact_name: venue.contact_name || "",
      contact_email: venue.contact_email || "",
      visit_date: venue.visit_date || "",
      notes: venue.notes || "",
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);

    const body = {
      name: form.name.trim(),
      location: form.location || null,
      price: Number(form.price) || 0,
      capacity: Number(form.capacity) || 0,
      status: form.status,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      visit_date: form.visit_date || null,
      notes: form.notes || null,
    };

    try {
      const url = editingId ? `/api/venues/${editingId}` : "/api/venues";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!json.ok) {
        toast(json.error?.message || "Erreur", "error");
        setSaving(false);
        return;
      }

      if (editingId) {
        setVenues((prev) =>
          prev.map((v) => (v.id === editingId ? json.data : v))
        );
        toast("Lieu mis a jour");
      } else {
        setVenues((prev) => [...prev, json.data]);
        toast("Lieu ajoute");
      }
      setModalOpen(false);
    } catch {
      toast("Une erreur est survenue", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/venues/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        setVenues((prev) => prev.filter((v) => v.id !== id));
        toast("Lieu supprime");
      } else {
        toast(json.error?.message || "Erreur", "error");
      }
    } catch {
      toast("Une erreur est survenue", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-pink-main border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl sm:text-3xl text-ink">Lieux</h1>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un lieu
        </Button>
      </div>

      {/* Venue Cards Grid */}
      {venues.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <MapPin className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-muted">Aucun lieu pour le moment.</p>
            <p className="text-sm text-muted-light mt-1">
              Ajoute ton premier lieu pour commencer.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map((venue) => (
            <Card key={venue.id} padding="none" className="flex flex-col">
              {/* Card body */}
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-ink text-base">
                    {venue.name}
                  </h3>
                  <Badge variant={statusBadgeVariant[venue.status]}>
                    {VENUE_STATUSES[venue.status as VenueStatus]}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {venue.location && (
                    <p className="text-sm text-muted flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-muted-light" />
                      {venue.location}
                    </p>
                  )}
                  {venue.capacity > 0 && (
                    <p className="text-sm text-muted flex items-center gap-2">
                      <Users className="w-4 h-4 flex-shrink-0 text-muted-light" />
                      {venue.capacity} personnes
                    </p>
                  )}
                  {venue.price > 0 && (
                    <p className="text-sm text-ink font-medium flex items-center gap-2">
                      <Euro className="w-4 h-4 flex-shrink-0 text-pink-main" />
                      {formatPrice(venue.price)}
                    </p>
                  )}
                  {venue.visit_date && (
                    <p className="text-sm text-muted flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0 text-muted-light" />
                      Visite le {prettyDate(venue.visit_date)}
                    </p>
                  )}
                  {venue.contact_name && (
                    <p className="text-sm text-muted flex items-center gap-2">
                      <User className="w-4 h-4 flex-shrink-0 text-muted-light" />
                      {venue.contact_name}
                    </p>
                  )}
                  {venue.contact_email && (
                    <p className="text-sm text-muted flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0 text-muted-light" />
                      <span className="truncate">{venue.contact_email}</span>
                    </p>
                  )}
                </div>

                {venue.notes && (
                  <p className="text-xs text-muted mt-3 line-clamp-2 border-t border-brand-border/50 pt-3">
                    {venue.notes}
                  </p>
                )}
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-end gap-1 px-5 py-3 border-t border-brand-border/50">
                <button
                  onClick={() => openEditModal(venue)}
                  className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-ivory transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(venue.id)}
                  className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Modifier le lieu" : "Nouveau lieu"}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Chateau de Versailles"
            required
          />
          <Input
            label="Adresse / Localisation"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Ex: 78000 Versailles"
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Prix"
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Capacite"
              type="number"
              min="0"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              placeholder="0"
            />
            <Select
              label="Statut"
              options={statusOptions}
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as VenueStatus })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom du contact"
              value={form.contact_name}
              onChange={(e) =>
                setForm({ ...form, contact_name: e.target.value })
              }
              placeholder="Nom du responsable"
            />
            <Input
              label="Email du contact"
              type="email"
              value={form.contact_email}
              onChange={(e) =>
                setForm({ ...form, contact_email: e.target.value })
              }
              placeholder="contact@lieu.fr"
            />
          </div>
          <Input
            label="Date de visite"
            type="date"
            value={form.visit_date}
            onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes supplementaires..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm transition-colors bg-white text-ink placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" loading={saving}>
              {editingId ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
