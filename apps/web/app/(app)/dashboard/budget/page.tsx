"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Wallet, CreditCard, PiggyBank, ArrowUpDown } from "lucide-react";
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
  SkeletonCard,
  SkeletonDonut,
  SkeletonTable,
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

// Premium gradient colors for 3D-style chart
const CHART_COLORS = [
  { start: "#EC4899", end: "#DB2777" }, // Pink
  { start: "#8B5CF6", end: "#7C3AED" }, // Purple
  { start: "#F472B6", end: "#EC4899" }, // Rose
  { start: "#A78BFA", end: "#8B5CF6" }, // Violet
  { start: "#C084FC", end: "#A855F7" }, // Fuchsia
  { start: "#E879F9", end: "#D946EF" }, // Magenta
  { start: "#F0ABFC", end: "#E879F9" }, // Light purple
  { start: "#D8A7B1", end: "#C08B95" }, // Dusty rose
  { start: "#FDA4AF", end: "#FB7185" }, // Coral
  { start: "#FBBF24", end: "#F59E0B" }, // Gold
];

// Legacy flat colors for badges/legends
const FLAT_COLORS = CHART_COLORS.map(c => c.start);

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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);

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
  const totalEstimated = useMemo(() => lines.reduce((s, l) => s + (l.estimated || 0), 0), [lines]);
  const totalPaid = useMemo(() => lines.reduce((s, l) => s + (l.paid || 0), 0), [lines]);
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

  // Sorting and filtering
  const sortedLines = useMemo(() => {
    let filtered = lines;
    if (selectedCategory) {
      filtered = lines.filter((l) => (l.category || "Autre") === selectedCategory);
    }
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "label") cmp = a.label.localeCompare(b.label);
      else if (sortKey === "category") cmp = (a.category || "").localeCompare(b.category || "");
      else if (sortKey === "estimated") cmp = (a.estimated || 0) - (b.estimated || 0);
      else if (sortKey === "paid") cmp = (a.paid || 0) - (b.paid || 0);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [lines, sortKey, sortDir, selectedCategory]);

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
        toast("Dépense mise à jour");
      } else {
        setLines((prev) => [...prev, json.data]);
        toast("Dépense ajoutée");
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
        toast("Dépense supprimée");
      } else {
        toast(json.error?.message || "Erreur", "error");
      }
    } catch {
      toast("Une erreur est survenue", "error");
    }
  }

  // SVG Donut chart helper - 3D Premium Style
  function renderDonut() {
    if (categoryBreakdown.length === 0) {
      return (
        <div className="flex items-center justify-center h-52 text-muted text-sm">
          Aucune donnée à afficher
        </div>
      );
    }

    const size = 280;
    const baseStrokeWidth = 45;
    const hoverStrokeWidth = 55;
    const radius = (size - hoverStrokeWidth) / 2;
    const innerRadius = radius - baseStrokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    // Calculate tooltip position based on hovered segment
    const hoveredData = hoveredCategory
      ? categoryBreakdown.find((c) => c.name === hoveredCategory)
      : null;
    const hoveredPercent = hoveredData ? Math.round((hoveredData.amount / chartTotal) * 100) : 0;

    // Build segments with offsets
    let offset = 0;
    const segments = categoryBreakdown.map((cat, i) => {
      const percent = chartTotal > 0 ? cat.amount / chartTotal : 0;
      const dashLength = percent * circumference;
      const dashOffset = -offset;
      offset += dashLength;
      return { cat, i, percent, dashLength, dashOffset };
    });

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer glow effect */}
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-30"
            style={{
              background: `radial-gradient(circle, ${CHART_COLORS[0].start}40 0%, transparent 70%)`,
            }}
          />

          <svg
            width={size}
            height={size}
            className="transform -rotate-90 drop-shadow-xl"
            style={{ filter: 'drop-shadow(0 10px 25px rgba(236, 72, 153, 0.2))' }}
          >
            {/* Gradient definitions */}
            <defs>
              {CHART_COLORS.map((color, i) => (
                <linearGradient key={`gradient-${i}`} id={`chartGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={color.start} />
                  <stop offset="100%" stopColor={color.end} />
                </linearGradient>
              ))}
              {/* Inner shadow for 3D effect */}
              <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
                <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
              </filter>
              {/* Glow filter for hover */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background ring for depth */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={baseStrokeWidth + 8}
              opacity={0.5}
            />

            {/* Main chart segments */}
            {segments.map(({ cat, i, dashLength, dashOffset }) => {
              const isHovered = hoveredCategory === cat.name;
              const isSelected = selectedCategory === cat.name;
              const strokeWidth = isHovered || isSelected ? hoverStrokeWidth : baseStrokeWidth;
              const colorIndex = i % CHART_COLORS.length;

              return (
                <g key={cat.name}>
                  {/* Shadow layer */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth={strokeWidth + 4}
                    strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                    style={{
                      transform: 'translate(2px, 2px)',
                      opacity: selectedCategory && !isSelected ? 0.2 : 0.3,
                    }}
                  />
                  {/* Main segment with gradient */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={`url(#chartGradient${colorIndex})`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-500 cursor-pointer"
                    style={{
                      opacity: selectedCategory && !isSelected ? 0.35 : 1,
                      filter: isHovered || isSelected ? 'url(#glow)' : 'none',
                    }}
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
                    }
                  />
                </g>
              );
            })}

            {/* Inner decorative ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={innerRadius - 15}
              fill="none"
              stroke="url(#chartGradient0)"
              strokeWidth={2}
              opacity={0.2}
            />
          </svg>

          {/* Center display - Glass morphism style */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05), 0 4px 20px rgba(236, 72, 153, 0.1)',
              }}
            >
              <div className="text-center">
                {hoveredCategory ? (
                  <>
                    <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {hoveredPercent}%
                    </p>
                    <p className="text-xs text-muted mt-0.5 max-w-[80px] truncate">{hoveredCategory}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {formatPrice(chartTotal)}
                    </p>
                    <p className="text-xs text-muted mt-0.5">Budget total</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Floating tooltip on hover */}
          {hoveredData && (
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full px-4 py-3 rounded-2xl shadow-2xl text-sm z-10 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${CHART_COLORS[categoryBreakdown.findIndex(c => c.name === hoveredCategory) % CHART_COLORS.length].start}, ${CHART_COLORS[categoryBreakdown.findIndex(c => c.name === hoveredCategory) % CHART_COLORS.length].end})`,
                  }}
                >
                  {hoveredPercent}%
                </div>
                <div>
                  <p className="font-semibold text-ink">{hoveredData.name}</p>
                  <p className="text-muted text-xs">{formatPrice(hoveredData.amount)}</p>
                </div>
              </div>
              {/* Arrow */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid rgba(255,255,255,0.95)',
                }}
              />
            </div>
          )}
        </div>

        {/* Legend toggle */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          onMouseEnter={() => setShowLegend(true)}
          className="text-xs text-muted hover:text-pink-dark transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-pink-50"
        >
          {showLegend ? "Masquer" : "Voir"} la légende
          <span className={`transition-transform duration-300 ${showLegend ? "rotate-180" : ""}`}>▼</span>
        </button>

        {/* Legend - Grid style */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 gap-2 transition-all duration-500 overflow-hidden ${
            showLegend ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {categoryBreakdown.map((cat, i) => {
            const isSelected = selectedCategory === cat.name;
            const colorIndex = i % CHART_COLORS.length;
            const percent = Math.round((cat.amount / chartTotal) * 100);
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex items-center gap-2.5 text-xs px-3 py-2 rounded-xl transition-all ${
                  isSelected
                    ? "ring-2 ring-pink-main shadow-md"
                    : "hover:bg-gray-50 hover:shadow-sm"
                } ${selectedCategory && !isSelected ? "opacity-40" : ""}`}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${CHART_COLORS[colorIndex].start}15, ${CHART_COLORS[colorIndex].end}10)`
                    : undefined,
                }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${CHART_COLORS[colorIndex].start}, ${CHART_COLORS[colorIndex].end})`,
                  }}
                />
                <div className="flex-1 text-left min-w-0">
                  <span className="text-muted truncate block">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-ink">{percent}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-9 w-32 bg-brand-border/50 rounded-lg animate-pulse" />
          <div className="h-10 w-40 bg-brand-border/50 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-brand-border/50 rounded-lg animate-pulse" />
          </CardHeader>
          <SkeletonDonut />
        </Card>
        <SkeletonTable rows={5} columns={6} />
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
          Ajouter une dépense
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
              <p className="text-sm text-muted">Budget estimé</p>
              <p className="text-xl font-bold text-ink">{formatPrice(totalEstimated)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-pink-light flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-pink-dark" />
            </div>
            <div>
              <p className="text-sm text-muted">Déjà payé</p>
              <p className="text-xl font-bold text-ink">{formatPrice(totalPaid)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-ivory flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-muted" />
            </div>
            <div>
              <p className="text-sm text-muted">Reste à payer</p>
              <p className="text-xl font-bold text-ink">{formatPrice(totalRemaining)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par catégorie</CardTitle>
        </CardHeader>
        {renderDonut()}
      </Card>

      {/* Budget Lines Table */}
      <Card padding="none">
        <div className="px-6 pt-6 pb-2 flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Postes de dépenses</CardTitle>
          {selectedCategory && (
            <div className="flex items-center gap-2">
              <Badge variant="pink">{selectedCategory}</Badge>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-pink-dark hover:underline"
              >
                Afficher tout
              </button>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                {(
                  [
                    ["label", "Poste"],
                    ["category", "Catégorie"],
                    ["estimated", "Estimé"],
                    ["paid", "Payé"],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
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
                <th className="text-left font-medium text-muted px-4 py-3">Reste</th>
                <th
                  onClick={() => toggleSort("status")}
                  className="text-left font-medium text-muted px-4 py-3 cursor-pointer hover:text-ink transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    Statut
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-right font-medium text-muted px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedLines.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-12">
                    Aucune dépense pour le moment.
                  </td>
                </tr>
              )}
              {sortedLines.map((line) => {
                const remaining = (line.estimated || 0) - (line.paid || 0);
                const catIndex = categoryBreakdown.findIndex((c) => c.name === (line.category || "Autre"));
                const catColor = FLAT_COLORS[catIndex >= 0 ? catIndex % FLAT_COLORS.length : 0];
                const progressPercent = line.estimated > 0 ? Math.min(100, ((line.paid || 0) / line.estimated) * 100) : 0;

                return (
                  <tr
                    key={line.id}
                    onClick={() => openEditModal(line)}
                    className="border-b border-brand-border/50 hover:bg-ivory/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-1 h-8 rounded-full flex-shrink-0"
                          style={{ backgroundColor: catColor }}
                        />
                        <span className="font-medium text-ink">{line.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs"
                        style={{ backgroundColor: `${catColor}20`, color: catColor }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }} />
                        {line.category || "Autre"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink">{formatPrice(line.estimated || 0)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-ink">{formatPrice(line.paid || 0)}</span>
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${progressPercent}%`, backgroundColor: catColor }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink font-medium">{formatPrice(remaining)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant[line.status]}>
                        {BUDGET_STATUSES[line.status as BudgetStatus]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(line);
                          }}
                          className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-ivory transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(line.id);
                          }}
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
        title={editingId ? "Modifier la dépense" : "Nouvelle dépense"}
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
            label="Catégorie"
            options={categoryOptions}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Choisir une catégorie"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Montant estimé"
              type="number"
              min="0"
              step="1"
              value={form.estimated}
              onChange={(e) => setForm({ ...form, estimated: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Montant payé"
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
            onChange={(e) => setForm({ ...form, status: e.target.value as BudgetStatus })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes supplémentaires..."
              rows={3}
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
