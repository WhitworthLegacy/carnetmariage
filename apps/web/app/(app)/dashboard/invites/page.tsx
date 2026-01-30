"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, Users, UserCheck, Clock, UserX } from "lucide-react";
import { Button, Card, Modal, Input, Select, Badge, useToast } from "@carnetmariage/ui";
import { GUEST_STATUSES, GUEST_GROUPS, type Guest, type GuestStatus } from "@carnetmariage/core";

const statusOptions = Object.entries(GUEST_STATUSES).map(([value, label]) => ({
  value,
  label,
}));

const groupOptions = GUEST_GROUPS.map((g) => ({ value: g, label: g }));

const _statusBadgeVariant: Record<string, "default" | "success" | "danger" | "warning" | "purple"> =
  {
    pending: "default",
    confirmed: "success",
    declined: "danger",
    relaunch: "warning",
    maybe: "purple",
  };

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  adults: "1",
  kids: "0",
  status: "pending" as GuestStatus,
  group_name: "",
  dietary_notes: "",
  notes: "",
};

export default function InvitesPage() {
  const { toast } = useToast();

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchGuests = useCallback(async () => {
    try {
      const res = await fetch("/api/guests");
      const json = await res.json();
      if (json.ok) setGuests(json.data);
    } catch {
      toast("Erreur lors du chargement des invités", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Stats
  const stats = useMemo(() => {
    const totalAdults = guests.reduce((s, g) => s + (g.adults || 0), 0);
    const totalKids = guests.reduce((s, g) => s + (g.kids || 0), 0);
    const confirmed = guests.filter((g) => g.status === "confirmed").length;
    const pending = guests.filter((g) => g.status === "pending").length;
    const declined = guests.filter((g) => g.status === "declined").length;
    return { total: totalAdults + totalKids, confirmed, pending, declined };
  }, [guests]);

  // Filtered guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchesSearch =
        !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !filterStatus || g.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [guests, searchQuery, filterStatus]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(guest: Guest) {
    setEditingId(guest.id);
    setForm({
      name: guest.name,
      email: guest.email || "",
      phone: guest.phone || "",
      adults: String(guest.adults || 1),
      kids: String(guest.kids || 0),
      status: guest.status as GuestStatus,
      group_name: guest.group_name || "",
      dietary_notes: guest.dietary_notes || "",
      notes: guest.notes || "",
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);

    const body = {
      name: form.name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      adults: Number(form.adults) || 1,
      kids: Number(form.kids) || 0,
      status: form.status,
      group_name: form.group_name || null,
      dietary_notes: form.dietary_notes || null,
      notes: form.notes || null,
    };

    try {
      const url = editingId ? `/api/guests/${editingId}` : "/api/guests";
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
        setGuests((prev) => prev.map((g) => (g.id === editingId ? json.data : g)));
        toast("Invité mis à jour");
      } else {
        setGuests((prev) => [...prev, json.data]);
        toast("Invité ajouté");
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
      const res = await fetch(`/api/guests/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
        toast("Invité supprimé");
      } else {
        toast(json.error?.message || "Erreur", "error");
      }
    } catch {
      toast("Une erreur est survenue", "error");
    }
  }

  async function handleInlineStatusChange(id: string, newStatus: GuestStatus) {
    try {
      const res = await fetch(`/api/guests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.ok) {
        setGuests((prev) => prev.map((g) => (g.id === id ? json.data : g)));
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
        <h1 className="font-serif text-2xl sm:text-3xl text-ink">Liste d&apos;invités</h1>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un invité
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-card border border-brand-border/50">
          <Users className="w-4 h-4 text-purple-main" />
          <span className="text-sm font-medium text-ink">{stats.total} invités</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-card border border-brand-border/50">
          <UserCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-ink">{stats.confirmed} confirmés</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-card border border-brand-border/50">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-ink">{stats.pending} en attente</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-card border border-brand-border/50">
          <UserX className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-ink">{stats.declined} refusés</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Rechercher un invité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border text-sm bg-white text-ink placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors"
          />
        </div>
        <Select
          options={[{ value: "", label: "Tous les statuts" }, ...statusOptions]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="sm:w-48"
        />
      </div>

      {/* Guest Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left font-medium text-muted px-4 py-3">Nom</th>
                <th className="text-left font-medium text-muted px-4 py-3">Adultes</th>
                <th className="text-left font-medium text-muted px-4 py-3">Enfants</th>
                <th className="text-left font-medium text-muted px-4 py-3">Statut</th>
                <th className="text-left font-medium text-muted px-4 py-3">Groupe</th>
                <th className="text-left font-medium text-muted px-4 py-3">Notes</th>
                <th className="text-right font-medium text-muted px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-12">
                    {guests.length === 0
                      ? "Aucun invité pour le moment."
                      : "Aucun résultat pour cette recherche."}
                  </td>
                </tr>
              )}
              {filteredGuests.map((guest) => (
                <tr
                  key={guest.id}
                  className="border-b border-brand-border/50 hover:bg-ivory/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-ink">{guest.name}</p>
                      {guest.email && <p className="text-xs text-muted">{guest.email}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink">{guest.adults}</td>
                  <td className="px-4 py-3 text-ink">{guest.kids}</td>
                  <td className="px-4 py-3">
                    <select
                      value={guest.status}
                      onChange={(e) =>
                        handleInlineStatusChange(guest.id, e.target.value as GuestStatus)
                      }
                      className="text-xs rounded-lg border border-brand-border px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-pink-main/30"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {guest.group_name ? (
                      <Badge variant="purple">{guest.group_name}</Badge>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted max-w-[200px] truncate">
                    {guest.dietary_notes || guest.notes || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(guest)}
                        className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-ivory transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Modifier l'invité" : "Nouvel invité"}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Marie Dupont"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="marie@exemple.fr"
            />
            <Input
              label="Téléphone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="06 12 34 56 78"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Adultes"
              type="number"
              min="0"
              value={form.adults}
              onChange={(e) => setForm({ ...form, adults: e.target.value })}
            />
            <Input
              label="Enfants"
              type="number"
              min="0"
              value={form.kids}
              onChange={(e) => setForm({ ...form, kids: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Statut"
              options={statusOptions}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as GuestStatus })}
            />
            <Select
              label="Groupe"
              options={[{ value: "", label: "Aucun" }, ...groupOptions]}
              value={form.group_name}
              onChange={(e) => setForm({ ...form, group_name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Restrictions alimentaires</label>
            <textarea
              value={form.dietary_notes}
              onChange={(e) => setForm({ ...form, dietary_notes: e.target.value })}
              placeholder="Allergies, régime végétarien..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm transition-colors bg-white text-ink placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes supplémentaires..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm transition-colors bg-white text-ink placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
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
