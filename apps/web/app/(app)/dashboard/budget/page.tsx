"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Wallet,
  CreditCard,
  PiggyBank,
  ArrowUpDown,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Modal,
  Input,
  Select,
  Badge,
  useToast,
} from "@carnetmariage/ui";
import {
  BUDGET_STATUSES,
  TASK_CATEGORIES,
  type BudgetLine,
  type BudgetStatus,
} from "@carnetmariage/core";
import { formatPrice } from "@/lib/utils";

const statusOptions = Object.entries(BUDGET_STATUSES).map(([value, label]) => ({
  value,
  label,
}));

const categoryOptions = TASK_CATEGORIES.map((c) => ({ value: c, label: c }));

const statusBadgeVariant: Record<string, "default" | "warning" | "success"> = {
  planned: "default",
  booked: "warning",
  paid: "success",
};

const CHART_COLORS = [
  "#D8A7B1",
  "#A78BFA",
  "#9D174D",
  "#5B21B6",
  "#FCE7F3",
  "#EDE9FE",
  "#F472B6",
  "#8B5CF6",
  "#EC4899",
  "#7C3AED",
];

const emptyForm = {
  label: "",
  category: "",
  estimated: "",
  paid: "",
  status: "planned" as BudgetStatus,
  notes: "",
};

type SortKey = "label" | "category" | "estimated" | "paid" | "status";
type SortDir = "asc" | "desc";

export default function BudgetPage() {
  const { toast } = useToast();

  const [lines, setLines] = useState<BudgetLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("label");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const fetchLines = useCallback(async () => {
    try {
      const res = await fetch("/api/budget");
      const json = await res.json();
      if (json.ok) setLines(json.data);
    } catch {
      toast("Erreur lors du chargement du budget", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLines();
  }, [fetchLines]);

  // Summary calculations
  const totalEstimated = useMemo(
    () => lines.reduce((s, l) => s + (l.estimated || 0), 0),
    [lines]
  );
  const totalPaid = useMemo(
    () => lines.reduce((s, l) => s + (l.paid || 0), 0),
    [lines]
  );
  const totalRemaining = totalEstimated - totalPaid;

  // Category breakdown for chart
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    lines.forEach((l) => {
      const cat = l.category || "Autre";
      map.set(cat, (map.get(cat) || 0) + (l.estimated || 0));
    });
    return Array.from(map.entries())
      .map(([name, amount]) => ({ name, amount }))
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [lines]);

  const chartTotal = categoryBreakdown.reduce((s, c) => s + c.amount, 0);

  // Sorting
  const sortedLines = useMemo(() => {
    const sorted = [...lines].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "label") cmp = a.label.localeCompare(b.label);
      else if (sortKey === "category")
        cmp = (a.category || "").localeCompare(b.category || "");
      else if (sortKey === "estimated") cmp = (a.estimated || 0) - (b.estimated || 0);
      else if (sortKey === "paid") cmp = (a.paid || 0) - (b.paid || 0);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [lines, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(line: BudgetLine) {
    setEditingId(line.id);
    setForm({
      label: line.label,
      category: line.category || "",
      estimated: String(line.estimated || 0),
      paid: String(line.paid || 0),
      status: line.status as BudgetStatus,
      notes: line.notes || "",
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim()) return;
    setSaving(true);

    const body = {
      label: form.label.trim(),
      category: form.category || null,
      estimated: Number(form.estimated) || 0,
      paid: Number(form.paid) || 0,
      status: form.status,
      notes: form.notes || null,
    };

    try {
      const url = editingId ? `/api/budget/${editingId}` : "/api/budget";
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
        setLines((prev) => prev.map((l) => (l.id === editingId ? json.data : l)));
        toast("Depense mise a jour");
      } else {
        setLines((prev) => [...prev, json.data]);
        toast("Depense ajoutee");
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
      const res = await fetch(`/api/budget/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        setLines((prev) => prev.filter((l) => l.id !== id));
        toast("Depense supprimee");
      } else {
        toast(json.error?.message || "Erreur", "error");
      }
    } catch {
      toast("Une erreur est survenue", "error");
    }
  }

  // SVG Donut chart helper
  function renderDonut() {
    if (categoryBreakdown.length === 0) {
      return (
        <div className="flex items-center justify-center h-52 text-muted text-sm">
          Aucune donnee a afficher
        </div>
      );
    }

    const size = 200;
    const strokeWidth = 40;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
      <div className="flex flex-col items-center gap-6">
        <svg width={size} height={size} className="transform -rotate-90">
          {categoryBreakdown.map((cat, i) => {
            const percent = chartTotal > 0 ? cat.amount / chartTotal : 0;
            const dashLength = percent * circumference;
            const dashOffset = -offset;
            offset += dashLength;

            return (
              <circle
                key={cat.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {categoryBreakdown.map((cat, i) => (
            <div key={cat.name} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                }}
              />
              <span className="text-muted">{cat.name}</span>
              <span className="font-medium text-ink">
                {formatPrice(cat.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
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
        <h1 className="font-serif text-2xl sm:text-3xl text-ink">Budget</h1>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une depense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-purple-light flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-dark" />
            </div>
            <div>
              <p className="text-sm text-muted">Budget estime</p>
              <p className="text-xl font-bold text-ink">
                {formatPrice(totalEstimated)}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-pink-light flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-pink-dark" />
            </div>
            <div>
              <p className="text-sm text-muted">Deja paye</p>
              <p className="text-xl font-bold text-ink">
                {formatPrice(totalPaid)}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-ivory flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-muted" />
            </div>
            <div>
              <p className="text-sm text-muted">Reste a payer</p>
              <p className="text-xl font-bold text-ink">
                {formatPrice(totalRemaining)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Repartition par categorie</CardTitle>
        </CardHeader>
        {renderDonut()}
      </Card>

      {/* Budget Lines Table */}
      <Card padding="none">
        <div className="px-6 pt-6 pb-2">
          <CardTitle>Postes de depenses</CardTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                {([
                  ["label", "Poste"],
                  ["category", "Categorie"],
                  ["estimated", "Estime"],
                  ["paid", "Paye"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="text-left font-medium text-muted px-4 py-3 cursor-pointer hover:text-ink transition-colors select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                ))}
                <th className="text-left font-medium text-muted px-4 py-3">
                  Reste
                </th>
                <th
                  onClick={() => toggleSort("status")}
                  className="text-left font-medium text-muted px-4 py-3 cursor-pointer hover:text-ink transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    Statut
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-right font-medium text-muted px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedLines.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-12">
                    Aucune depense pour le moment.
                  </td>
                </tr>
              )}
              {sortedLines.map((line) => {
                const remaining = (line.estimated || 0) - (line.paid || 0);
                return (
                  <tr
                    key={line.id}
                    className="border-b border-brand-border/50 hover:bg-ivory/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-ink">
                      {line.label}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {line.category || "—"}
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {formatPrice(line.estimated || 0)}
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {formatPrice(line.paid || 0)}
                    </td>
                    <td className="px-4 py-3 text-ink font-medium">
                      {formatPrice(remaining)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant[line.status]}>
                        {BUDGET_STATUSES[line.status as BudgetStatus]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(line)}
                          className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-ivory transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(line.id)}
                          className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Modifier la depense" : "Nouvelle depense"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Poste"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="Ex: Traiteur"
            required
          />
          <Select
            label="Categorie"
            options={categoryOptions}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Choisir une categorie"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Montant estime"
              type="number"
              min="0"
              step="1"
              value={form.estimated}
              onChange={(e) => setForm({ ...form, estimated: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Montant paye"
              type="number"
              min="0"
              step="1"
              value={form.paid}
              onChange={(e) => setForm({ ...form, paid: e.target.value })}
              placeholder="0"
            />
          </div>
          <Select
            label="Statut"
            options={statusOptions}
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as BudgetStatus })
            }
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
