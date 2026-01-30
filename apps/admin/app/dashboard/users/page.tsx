"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";

interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  weddingDate: string | null;
  plan: "free" | "premium" | "ultimate";
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

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<AdminUser[]>("/api/admin/users")
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || u.fullName?.toLowerCase().includes(q)
    );
  }, [users, search]);

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
        Erreur lors du chargement des utilisateurs: {error}
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Utilisateurs</h1>
        <p className="mt-1 text-sm text-muted">
          {users.length} utilisateur{users.length !== 1 ? "s" : ""} enregistre
          {users.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par email ou nom..."
          className="w-full rounded-xl border border-brand-border bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-purple-main focus:ring-2 focus:ring-purple-light"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Date mariage
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Inscrit le
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted">
                  Aucun utilisateur trouve
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <>
                  <tr key={user.id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-ink">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                      {user.fullName || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                      {formatDate(user.weddingDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <PlanBadge plan={user.plan} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-purple-main transition-colors hover:bg-purple-light"
                      >
                        Detail
                        {expandedId === user.id ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedId === user.id && (
                    <tr key={`${user.id}-detail`}>
                      <td colSpan={6} className="bg-gray-50 px-6 py-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted">ID Utilisateur</p>
                            <p className="mt-1 font-mono text-xs text-ink">{user.id}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted">Email</p>
                            <p className="mt-1 text-ink">{user.email}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted">Plan</p>
                            <p className="mt-1">
                              <PlanBadge plan={user.plan} />
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
