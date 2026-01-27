"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Euro,
  X,
} from "lucide-react";
import {
  Button,
  Card,
  Modal,
  Input,
  Select,
  Badge,
  Tabs,
  useToast,
} from "@carnetmariage/ui";
import {
  VENDOR_STATUSES,
  VENDOR_CATEGORIES,
  type Vendor,
  type VendorStatus,
} from "@carnetmariage/core";
import { formatPrice } from "@/lib/utils";

const statusOptions = Object.entries(VENDOR_STATUSES).map(([value, label]) => ({
  value,
  label,
}));

const categoryOptions = VENDOR_CATEGORIES.map((c) => ({ value: c, label: c }));

const statusBadgeVariant: Record<
  string,
  "default" | "info" | "purple" | "warning" | "success" | "danger"
> = {
  contact: "default",
  quote: "info",
  meeting: "purple",
  negotiating: "warning",
  booked: "success",
  paid: "success",
  refused: "danger",
};

const emptyForm = {
  name: "",
  category: "Photographe",
  price: "",
  status: "contact" as VendorStatus,
  email: "",
  phone: "",
  notes: "",
};

export default function PrestatairesPage() {
  const { toast } = useToast();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchVendors = useCallback(async () => {
    try {
      const res = await fetch("/api/vendors");
      const json = await res.json();
      if (json.ok) setVendors(json.data);
    } catch {
      toast("Erreur lors du chargement des prestataires", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(vendor: Vendor) {
    setEditingId(vendor.id);
    setForm({
      name: vendor.name,
      category: vendor.category,
      price: String(vendor.price || 0),
      status: vendor.status as VendorStatus,
      email: vendor.email || "",
      phone: vendor.phone || "",
      notes: vendor.notes || "",
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);

    const body = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price) || 0,
      status: form.status,
      email: form.email || null,
      phone: form.phone || null,
      notes: form.notes || null,
    };

    try {
      const url = editingId ? `/api/vendors/${editingId}` : "/api/vendors";
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
        setVendors((prev) =>
          prev.map((v) => (v.id === editingId ? json.data : v))
        );
        toast("Prestataire mis a jour");
      } else {
        setVendors((prev) => [...prev, json.data]);
        toast("Prestataire ajoute");
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
      const res = await fetch(`/api/vendors/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        setVendors((prev) => prev.filter((v) => v.id !== id));
        toast("Prestataire supprime");
      } else {
        toast(json.error?.message || "Erreur", "error");
      }
    } catch {
      toast("Une erreur est survenue", "error");
    }
  }

  const groupedByStatus: Record<string, Vendor[]> = {};
  (Object.keys(VENDOR_STATUSES) as VendorStatus[]).forEach((s) => {
    groupedByStatus[s] = vendors.filter((v) => v.status === s);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl sm:text-3xl text-ink">
          Prestataires
        </h1>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un prestataire
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "pipeline", label: "Pipeline" },
          { id: "list", label: "Liste" },
        ]}
        defaultTab="pipeline"
      >
        {(activeTab) =>
          loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-pink-main border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeTab === "pipeline" ? (
            /* Pipeline View */
            <div className="overflow-x-auto pb-4 -mx-2">
              <div className="flex gap-3 min-w-max px-2">
                {(Object.keys(VENDOR_STATUSES) as VendorStatus[]).map(
                  (statusKey) => (
                    <div
                      key={statusKey}
                      className="w-48 flex-shrink-0 bg-ivory rounded-2xl p-3"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-ink text-xs uppercase tracking-wide">
                          {VENDOR_STATUSES[statusKey]}
                        </h3>
                        <Badge variant={statusBadgeVariant[statusKey]}>
                          {groupedByStatus[statusKey]?.length ?? 0}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {(groupedByStatus[statusKey] ?? []).map((vendor) => (
                          <Card
                            key={vendor.id}
                            padding="sm"
                            className="group cursor-pointer hover:shadow-soft transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div
                                className="flex-1 min-w-0"
                                onClick={() => openEditModal(vendor)}
                              >
                                <p className="text-sm font-medium text-ink truncate">
                                  {vendor.name}
                                </p>
                                <Badge
                                  variant="purple"
                                  className="text-[10px] mt-1.5"
                                >
                                  {vendor.category}
                                </Badge>
                                {vendor.price > 0 && (
                                  <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                                    <Euro className="w-3 h-3" />
                                    {formatPrice(vendor.price)}
                                  </p>
                                )}
                                {vendor.email && (
                                  <p className="text-[10px] text-muted mt-1 truncate flex items-center gap-1">
                                    <Mail className="w-2.5 h-2.5 flex-shrink-0" />
                                    {vendor.email}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(vendor.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted hover:text-red-500 transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </Card>
                        ))}
                        {(groupedByStatus[statusKey] ?? []).length === 0 && (
                          <p className="text-[10px] text-muted text-center py-6">
                            Aucun
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            /* List View */
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-border">
                      <th className="text-left font-medium text-muted px-4 py-3">
                        Nom
                      </th>
                      <th className="text-left font-medium text-muted px-4 py-3">
                        Categorie
                      </th>
                      <th className="text-left font-medium text-muted px-4 py-3">
                        Prix
                      </th>
                      <th className="text-left font-medium text-muted px-4 py-3">
                        Statut
                      </th>
                      <th className="text-left font-medium text-muted px-4 py-3">
                        Email
                      </th>
                      <th className="text-right font-medium text-muted px-4 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center text-muted py-12"
                        >
                          Aucun prestataire pour le moment.
                        </td>
                      </tr>
                    )}
                    {vendors.map((vendor) => (
                      <tr
                        key={vendor.id}
                        className="border-b border-brand-border/50 hover:bg-ivory/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-ink">
                          {vendor.name}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="purple">{vendor.category}</Badge>
                        </td>
                        <td className="px-4 py-3 text-ink">
                          {vendor.price > 0
                            ? formatPrice(vendor.price)
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusBadgeVariant[vendor.status]}>
                            {VENDOR_STATUSES[vendor.status as VendorStatus]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {vendor.email || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(vendor)}
                              className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-ivory transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(vendor.id)}
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
          )
        }
      </Tabs>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Modifier le prestataire" : "Nouveau prestataire"}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Studio Photo Marie"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Categorie"
              options={categoryOptions}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Select
              label="Statut"
              options={statusOptions}
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as VendorStatus,
                })
              }
            />
          </div>
          <Input
            label="Prix"
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contact@exemple.fr"
            />
            <Input
              label="Telephone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="06 12 34 56 78"
            />
          </div>
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
