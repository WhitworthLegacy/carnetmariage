"use client";

import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";

interface PlaceholderCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

function PlaceholderCard({ title, description, icon: Icon }: PlaceholderCardProps) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-ink">{title}</h3>
      <div className="flex h-52 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-purple-light">
            <Icon size={24} className="text-purple-main" />
          </div>
          <p className="text-sm font-medium text-muted">{description}</p>
          <p className="mt-1 text-xs text-muted-light">Bientot disponible</p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Analytics</h1>
        <p className="mt-1 text-sm text-muted">
          Analyses avancees et metriques detaillees
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PlaceholderCard
          title="Inscriptions mensuelles"
          description="Graphique des nouvelles inscriptions"
          icon={BarChart3}
        />
        <PlaceholderCard
          title="Taux de conversion"
          description="Free vers Premium / Ultimate"
          icon={TrendingUp}
        />
        <PlaceholderCard
          title="Utilisation des fonctionnalites"
          description="Fonctionnalites les plus utilisees"
          icon={PieChart}
        />
        <PlaceholderCard
          title="Activite utilisateurs"
          description="Sessions et engagement"
          icon={Activity}
        />
      </div>
    </div>
  );
}
