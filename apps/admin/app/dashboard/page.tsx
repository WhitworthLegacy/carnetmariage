"use client";

import { useEffect, useState } from "react";
import { Users, Heart, Crown, Euro } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface AdminStats {
  totalUsers: number;
  activeWeddings: number;
  premiumSubscribers: number;
  estimatedMrr: number;
  planDistribution: {
    free: number;
    premium: number;
  };
}

const PLAN_COLORS = ["#6b7280", "#D8A7B1"];

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-card">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="text-2xl font-bold text-ink">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<AdminStats>("/api/admin/stats")
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
        Erreur lors du chargement des statistiques: {error}
      </div>
    );
  }

  if (!stats) return null;

  const pieData = [
    { name: "Gratuit", value: stats.planDistribution.free },
    { name: "Premium", value: stats.planDistribution.premium },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Vue d&apos;ensemble</h1>
        <p className="mt-1 text-sm text-muted">
          Tableau de bord de l&apos;administration CarnetMariage
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total utilisateurs"
          value={stats.totalUsers.toLocaleString("fr-FR")}
          icon={Users}
          color="#6b7280"
        />
        <KpiCard
          label="Mariages actifs"
          value={stats.activeWeddings.toLocaleString("fr-FR")}
          icon={Heart}
          color="#D8A7B1"
        />
        <KpiCard
          label="Utilisateurs Premium"
          value={stats.premiumSubscribers.toLocaleString("fr-FR")}
          icon={Crown}
          color="#A78BFA"
        />
        <KpiCard
          label="Revenu total"
          value={`${stats.estimatedMrr.toLocaleString("fr-FR")} €`}
          icon={Euro}
          color="#5B21B6"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Plan Distribution */}
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-ink">Répartition des plans</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PLAN_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Placeholder */}
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-ink">Croissance mensuelle</h3>
          <div className="flex h-72 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-purple-light">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-purple-main"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-muted">Graphique de croissance</p>
              <p className="mt-1 text-xs text-muted-light">Bientôt disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
