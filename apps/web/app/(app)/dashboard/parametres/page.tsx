"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Save, LogOut, Crown, Sparkles, Check, ExternalLink } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  Tabs,
  useToast,
} from "@carnetmariage/ui";
import { PLANS } from "@carnetmariage/core";
import { useWedding } from "@/contexts/WeddingContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const PLAN_FEATURES: Record<string, string[]> = {
  free: ["30 tâches", "15 lignes de budget", "10 prestataires", "50 invités", "3 lieux"],
  premium: [
    "Tâches illimitées",
    "Budget illimité",
    "Prestataires illimités",
    "Invités illimités",
    "Lieux illimités",
    "Timeline du mariage",
    "Export PDF",
  ],
  ultimate: [
    "Tout Premium",
    "Plan de table interactif",
    "Site web personnalisé",
    "Partage collaboratif",
    "Support prioritaire",
  ],
};

const PLAN_PRICES: Record<string, string> = {
  free: "0",
  premium: "9,90",
  ultimate: "19,90",
};

export default function ParametresPage() {
  const { wedding, user, isPremium, isUltimate: _isUltimate } = useWedding();
  const { toast } = useToast();
  const router = useRouter();

  const [weddingForm, setWeddingForm] = useState({
    partner1_name: wedding.partner1_name || "",
    partner2_name: wedding.partner2_name || "",
    wedding_date: wedding.wedding_date || "",
    total_budget: String(wedding.total_budget || 0),
  });
  const [saving, setSaving] = useState(false);

  async function handleSaveWedding(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/weddings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner1_name: weddingForm.partner1_name,
          partner2_name: weddingForm.partner2_name,
          wedding_date: weddingForm.wedding_date || null,
          total_budget: Number(weddingForm.total_budget) || 0,
        }),
      });
      const json = await res.json();

      if (json.ok) {
        toast("Paramètres enregistrés");
      } else {
        toast(json.error?.message || "Erreur", "error");
      }
    } catch {
      toast("Une erreur est survenue", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/connexion");
  }

  const currentPlan = wedding.plan || "free";
  const planLabel = PLANS[currentPlan as keyof typeof PLANS] || "Gratuit";

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="font-serif text-2xl sm:text-3xl text-ink">Paramètres</h1>

      <Tabs
        tabs={[
          { id: "profil", label: "Profil" },
          { id: "abonnement", label: "Abonnement" },
        ]}
        defaultTab="profil"
      >
        {(activeTab) =>
          activeTab === "profil" ? (
            <div className="space-y-6">
              {/* Wedding Info Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations du mariage</CardTitle>
                </CardHeader>
                <form onSubmit={handleSaveWedding} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Prénom partenaire 1"
                      value={weddingForm.partner1_name}
                      onChange={(e) =>
                        setWeddingForm({
                          ...weddingForm,
                          partner1_name: e.target.value,
                        })
                      }
                      placeholder="Marie"
                    />
                    <Input
                      label="Prénom partenaire 2"
                      value={weddingForm.partner2_name}
                      onChange={(e) =>
                        setWeddingForm({
                          ...weddingForm,
                          partner2_name: e.target.value,
                        })
                      }
                      placeholder="Pierre"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Date du mariage"
                      type="date"
                      value={weddingForm.wedding_date}
                      onChange={(e) =>
                        setWeddingForm({
                          ...weddingForm,
                          wedding_date: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Budget total"
                      type="number"
                      min="0"
                      step="100"
                      value={weddingForm.total_budget}
                      onChange={(e) =>
                        setWeddingForm({
                          ...weddingForm,
                          total_budget: e.target.value,
                        })
                      }
                      placeholder="15000"
                    />
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <Button type="submit" loading={saving}>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Account Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Compte</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-ink">Email</label>
                    <p className="text-sm text-muted mt-1">{user.email}</p>
                  </div>
                  <div className="pt-2">
                    <Button variant="danger" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Se déconnecter
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* Abonnement Tab */
            <div className="space-y-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan actuel</CardTitle>
                </CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-light flex items-center justify-center">
                    <Crown className="w-6 h-6 text-purple-dark" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-ink">{planLabel}</span>
                      <Badge variant={isPremium ? "success" : "default"}>
                        {isPremium ? "Actif" : "Gratuit"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted">
                      {isPremium
                        ? "Vous profitez de toutes les fonctionnalités."
                        : "Passez à Premium pour débloquer plus de fonctionnalités."}
                    </p>
                  </div>
                </div>
                {isPremium && (
                  <div className="mt-4 pt-4 border-t border-brand-border/50">
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Gérer mon abonnement
                    </Button>
                  </div>
                )}
              </Card>

              {/* Upgrade Cards (shown for free users) */}
              {!isPremium && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Premium Card */}
                  <Card className="relative overflow-hidden border-2 border-pink-main/30">
                    <div className="absolute top-0 right-0 bg-pink-main text-white text-xs font-semibold px-3 py-1 rounded-bl-xl">
                      Populaire
                    </div>
                    <div className="mb-4">
                      <h3 className="font-serif text-xl text-ink">Premium</h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-bold text-ink">{PLAN_PRICES.premium}</span>
                        <span className="text-muted text-sm">/mois</span>
                      </div>
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {PLAN_FEATURES.premium.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-ink">
                          <Check className="w-4 h-4 text-pink-main flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Passer à Premium
                    </Button>
                  </Card>

                  {/* Ultimate Card */}
                  <Card className="relative overflow-hidden border-2 border-purple-main/30">
                    <div className="mb-4">
                      <h3 className="font-serif text-xl text-ink">Ultimate</h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-bold text-ink">{PLAN_PRICES.ultimate}</span>
                        <span className="text-muted text-sm">/mois</span>
                      </div>
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {PLAN_FEATURES.ultimate.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-ink">
                          <Check className="w-4 h-4 text-purple-main flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="secondary" className="w-full">
                      <Crown className="w-4 h-4 mr-2" />
                      Passer à Ultimate
                    </Button>
                  </Card>
                </div>
              )}

              {/* Plan Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Comparaison des plans</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-brand-border">
                        <th className="text-left font-medium text-muted px-3 py-2">
                          Fonctionnalité
                        </th>
                        <th className="text-center font-medium text-muted px-3 py-2">Gratuit</th>
                        <th className="text-center font-medium text-muted px-3 py-2">Premium</th>
                        <th className="text-center font-medium text-muted px-3 py-2">Ultimate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Tâches", "30", "Illimité", "Illimité"],
                        ["Lignes budget", "15", "Illimité", "Illimité"],
                        ["Prestataires", "10", "Illimité", "Illimité"],
                        ["Invités", "50", "Illimité", "Illimité"],
                        ["Lieux", "3", "Illimité", "Illimité"],
                        ["Timeline", "—", "Oui", "Oui"],
                        ["Export PDF", "—", "Oui", "Oui"],
                        ["Plan de table", "—", "—", "Oui"],
                        ["Site web", "—", "—", "Oui"],
                        ["Partage collaboratif", "—", "—", "Oui"],
                      ].map(([feature, free, premium, ultimate]) => (
                        <tr key={feature} className="border-b border-brand-border/50">
                          <td className="px-3 py-2.5 text-ink">{feature}</td>
                          <td className="px-3 py-2.5 text-center text-muted">{free}</td>
                          <td className="px-3 py-2.5 text-center text-pink-dark font-medium">
                            {premium}
                          </td>
                          <td className="px-3 py-2.5 text-center text-purple-dark font-medium">
                            {ultimate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )
        }
      </Tabs>
    </div>
  );
}
