"use client";

import { Settings, Bell, Shield, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Parametres</h1>
        <p className="mt-1 text-sm text-muted">
          Configuration de l&apos;administration
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* General */}
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-light">
              <Settings size={20} className="text-purple-main" />
            </div>
            <h3 className="text-lg font-semibold text-ink">General</h3>
          </div>
          <p className="text-sm text-muted">
            Parametres generaux de l&apos;application. Configuration bientot
            disponible.
          </p>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-light">
              <Bell size={20} className="text-pink-main" />
            </div>
            <h3 className="text-lg font-semibold text-ink">Notifications</h3>
          </div>
          <p className="text-sm text-muted">
            Configuration des alertes et notifications admin. Bientot
            disponible.
          </p>
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <Shield size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink">Securite</h3>
          </div>
          <p className="text-sm text-muted">
            Gestion des roles admin, permissions et journaux d&apos;audit.
            Bientot disponible.
          </p>
        </div>

        {/* Database */}
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Database size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink">
              Base de donnees
            </h3>
          </div>
          <p className="text-sm text-muted">
            Statistiques et maintenance de la base de donnees. Bientot
            disponible.
          </p>
        </div>
      </div>
    </div>
  );
}
