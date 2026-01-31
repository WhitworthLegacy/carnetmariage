"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Save, LogOut, Crown, Sparkles, Check, Heart } from "lucide-react";
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
import { useRouter, useSearchParams } from "next/navigation";

const PLAN_FEATURES = {
  free: [
    "30 tâches",
    "15 postes de budget",
    "10 prestataires",
    "50 invités",
    "3 lieux",
    "1 utilisateur",
  ],
  premium: [
    "Tâches illimitées",
    "Budget illimité avec catégories",
    "Prestataires illimités",
    "Invités illimités + RSVP",
    "Lieux illimités",
    "2 utilisateurs (couple)",
    "Timeline jour J",
    "Plan de table interactif",
    "Export PDF du carnet",
    "Support prioritaire",
  ],
};

export default function ParametresPage() {
  const { wedding, user, isPremium } = useWedding();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const showUpgrade = searchParams.get("upgrade") === "true";

  const [weddingForm, setWeddingForm] = useState({
    partner1_name: wedding.partner1_name || "",
    partner2_name: wedding.partner2_name || "",
    wedding_date: wedding.wedding_date || "",
    total_budget: String(wedding.total_budget || 0),
  });
  const [saving, setSaving] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"profil" | "abonnement">("profil");

  useEffect(() => {
    if (showUpgrade) {
      setDefaultTab("abonnement");
    }
  }, [showUpgrade]);

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

  async function handleUpgrade() {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceAmount: 2700 }), // 27€ in cents
      });
      const json = await res.json();

      if (json.url) {
        window.location.href = json.url;
      } else {
        toast(json.error?.message || "Erreur lors du paiement", "error");
      }
    } catch {
      toast("Une erreur est survenue", "error");
    }
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
        defaultTab={defaultTab}
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
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isPremium ? "bg-pink-light" : "bg-gray-100"
                    }`}
                  >
                    {isPremium ? (
                      <Crown className="w-6 h-6 text-pink-dark" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-ink">{planLabel}</span>
                      <Badge variant={isPremium ? "success" : "default"}>
                        {isPremium ? "Accès à vie" : "Limité"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted">
                      {isPremium
                        ? "Tu as accès à toutes les fonctionnalités ! Merci pour ta confiance."
                        : "Passe à Premium pour tout débloquer, une fois pour toutes."}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Upgrade Card (shown for free users) */}
              {!isPremium && (
                <Card className="relative overflow-hidden border-2 border-pink-main/30 bg-gradient-to-br from-white to-pink-light/20">
                  <div className="absolute top-0 right-0 bg-pink-dark text-white text-xs font-semibold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    Recommandé
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl text-ink">Passer à Premium</h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-bold text-ink">27€</span>
                        <span className="text-sm text-muted bg-ivory px-2 py-0.5 rounded-full">
                          paiement unique
                        </span>
                      </div>
                      <p className="text-sm text-muted mt-2">
                        Accès à vie à toutes les fonctionnalités. Pas d'abonnement.
                      </p>
                    </div>

                    <div className="shrink-0">
                      <Button size="lg" onClick={handleUpgrade}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Débloquer tout
                      </Button>
                      <p className="text-xs text-muted text-center mt-2">
                        Satisfait ou remboursé 14j
                      </p>
                    </div>
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 pt-6 border-t border-brand-border/50">
                    {PLAN_FEATURES.premium.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-ink">
                        <Check className="w-4 h-4 text-pink-main flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Premium success message */}
              {isPremium && (
                <Card className="bg-gradient-to-br from-pink-light/30 to-purple-light/30">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-white shadow-soft flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-pink-dark" />
                    </div>
                    <h3 className="font-serif text-xl text-ink mb-2">Tu as tout débloqué !</h3>
                    <p className="text-muted text-sm max-w-md mx-auto">
                      Profite de toutes les fonctionnalités de CarnetMariage pour organiser ton
                      mariage sereinement. Merci de nous faire confiance !
                    </p>
                  </div>
                </Card>
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
                        <th className="text-center font-medium text-muted px-3 py-2">
                          <span className="text-pink-dark">Premium</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Tâches", "30", "Illimité"],
                        ["Postes de budget", "15", "Illimité"],
                        ["Prestataires", "10", "Illimité"],
                        ["Invités", "50", "Illimité"],
                        ["Lieux", "3", "Illimité"],
                        ["Utilisateurs", "1", "2 (couple)"],
                        ["Timeline jour J", "—", "✓"],
                        ["Plan de table", "—", "✓"],
                        ["Export PDF", "—", "✓"],
                        ["Support prioritaire", "—", "✓"],
                      ].map(([feature, free, premium]) => (
                        <tr key={feature} className="border-b border-brand-border/50">
                          <td className="px-3 py-2.5 text-ink">{feature}</td>
                          <td className="px-3 py-2.5 text-center text-muted">{free}</td>
                          <td className="px-3 py-2.5 text-center text-pink-dark font-medium">
                            {premium}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 pt-4 border-t border-brand-border/50 text-center">
                  <span className="text-2xl font-bold text-ink">27€</span>
                  <span className="text-sm text-muted ml-2">— Accès à vie</span>
                </div>
              </Card>
            </div>
          )
        }
      </Tabs>
    </div>
  );
}
