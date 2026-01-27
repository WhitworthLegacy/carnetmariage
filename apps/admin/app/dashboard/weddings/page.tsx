"use client";

import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/apiClient";

interface AdminWedding {
  id: string;
  partner1Name: string | null;
  partner2Name: string | null;
  weddingDate: string | null;
  plan: "free" | "premium" | "ultimate";
  taskCount: number;
  guestCount: number;
  createdAt: string;
}

const PLAN_STYLES: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  premium: "bg-pink-light text-pink-dark",
  ultimate: "bg-purple-light text-purple-dark",
};

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  premium: "Premium",
  ultimate: "Ultimate",
};

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PLAN_STYLES[plan] || PLAN_STYLES.free}`}
    >
      {PLAN_LABELS[plan] || plan}
    </span>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function coupleName(w: AdminWedding): string {
  const p1 = w.partner1Name || "Partenaire 1";
  const p2 = w.partner2Name || "Partenaire 2";
  return `${p1} & ${p2}`;
}

export default function WeddingsPage() {
  const [weddings, setWeddings] = useState<AdminWedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planFilter, setPlanFilter] = useState<string>("all");

  useEffect(() => {
    apiFetch<AdminWedding[]>("/api/admin/weddings")
      .then(setWeddings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (planFilter === "all") return weddings;
    return weddings.filter((w) => w.plan === planFilter);
  }, [weddings, planFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-main border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-sm text-red-600">
        Erreur lors du chargement des mariages: {error}
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Mariages</h1>
        <p className="mt-1 text-sm text-muted">
          {weddings.length} mariage{weddings.length !== 1 ? "s" : ""}{" "}
          enregistre{weddings.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted">Filtrer par plan:</span>
        {["all", "free", "premium", "ultimate"].map((plan) => (
          <button
            key={plan}
            onClick={() => setPlanFilter(plan)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              planFilter === plan
                ? "bg-purple-main text-white"
                : "bg-gray-100 text-muted hover:bg-gray-200"
            }`}
          >
            {plan === "all" ? "Tous" : PLAN_LABELS[plan]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Couple
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Taches
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Invites
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Inscrit le
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-muted"
                >
                  Aucun mariage trouve
                </td>
              </tr>
            ) : (
              filtered.map((wedding) => (
                <tr
                  key={wedding.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-ink">
                    {coupleName(wedding)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                    {formatDate(wedding.weddingDate)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <PlanBadge plan={wedding.plan} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                    {wedding.taskCount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                    {wedding.guestCount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                    {formatDate(wedding.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
