"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ChevronDown } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    monthlyPrice: "0",
    annualPrice: "0",
    period: "",
    description: "Pour découvrir et commencer à s'organiser.",
    features: [
      { name: "Checklist de base (20 tâches)", included: true },
      { name: "Budget simplifié", included: true },
      { name: "Jusqu'à 50 invités", included: true },
      { name: "1 utilisateur", included: true },
      { name: "Gestion des prestataires", included: false },
      { name: "Plan de table", included: false },
      { name: "Tableau de bord avancé", included: false },
      { name: "Export PDF", included: false },
      { name: "Templates personnalisés", included: false },
      { name: "Support prioritaire", included: false },
    ],
    cta: "Commencer gratuitement",
    href: "/inscription",
    highlighted: false,
  },
  {
    name: "Premium",
    monthlyPrice: "9,99",
    annualPrice: "7,99",
    period: "/mois",
    description: "Pour les couples qui veulent tout organiser sereinement.",
    features: [
      { name: "Checklist illimitée", included: true },
      { name: "Budget détaillé avec catégories", included: true },
      { name: "Invités illimités", included: true },
      { name: "2 utilisateurs (couple)", included: true },
      { name: "Gestion des prestataires", included: true },
      { name: "Plan de table interactif", included: true },
      { name: "Tableau de bord avancé", included: false },
      { name: "Export PDF", included: false },
      { name: "Templates personnalisés", included: false },
      { name: "Support prioritaire", included: true },
    ],
    cta: "Essai gratuit 14 jours",
    href: "/inscription?plan=premium",
    highlighted: true,
  },
  {
    name: "Ultimate",
    monthlyPrice: "19,99",
    annualPrice: "15,99",
    period: "/mois",
    description: "L'expérience complète avec un accompagnement personnalisé.",
    features: [
      { name: "Checklist illimitée", included: true },
      { name: "Budget détaillé avec catégories", included: true },
      { name: "Invités illimités", included: true },
      { name: "Jusqu'à 5 utilisateurs", included: true },
      { name: "Gestion des prestataires", included: true },
      { name: "Plan de table interactif", included: true },
      { name: "Tableau de bord avancé", included: true },
      { name: "Export PDF du carnet", included: true },
      { name: "Templates personnalisés", included: true },
      { name: "Assistance dédiée", included: true },
    ],
    cta: "Essai gratuit 14 jours",
    href: "/inscription?plan=ultimate",
    highlighted: false,
  },
];

const pricingFaqs = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer:
      "Oui, tu peux passer à un plan supérieur ou inférieur quand tu veux. Le changement est effectif immédiatement et la facturation est ajustée au prorata.",
  },
  {
    question: "Comment fonctionne l'essai gratuit ?",
    answer:
      "L'essai gratuit de 14 jours te donne accès à toutes les fonctionnalités du plan choisi. Aucune carte bancaire n'est requise. À la fin de l'essai, tu choisis de continuer ou de revenir au plan gratuit.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les cartes Visa, Mastercard et American Express. Le paiement est sécurisé via Stripe.",
  },
  {
    question: "Que se passe-t-il si j'annule mon abonnement ?",
    answer:
      "Tu gardes l'accès aux fonctionnalités premium jusqu'à la fin de ta période de facturation. Ensuite, ton compte revient au plan gratuit et tu conserves toutes tes données.",
  },
  {
    question: "Y a-t-il un engagement minimum ?",
    answer:
      "Non, aucun engagement. Tu es libre d'annuler quand tu veux. Les plans annuels sont facturés en une fois mais restent annulables avec remboursement au prorata.",
  },
  {
    question: "Le plan annuel est-il vraiment avantageux ?",
    answer:
      "Oui, le plan annuel te fait économiser 20% par rapport au paiement mensuel. C'est idéal si tu sais que tu vas utiliser CarnetMariage pendant plusieurs mois de préparation.",
  },
];

export default function TarifsPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* Header */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-serif text-4xl sm:text-5xl text-ink tracking-tight">
              Un carnet adapté à chaque couple
            </h1>
            <p className="mt-4 text-lg text-muted">
              Commence gratuitement. Passe à Premium quand tu es prête.
            </p>

            {/* Toggle */}
            <div className="mt-10 inline-flex items-center gap-3 bg-white rounded-full p-1.5 border border-brand-border shadow-soft">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  !annual
                    ? "bg-pink-dark text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  annual
                    ? "bg-pink-dark text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                Annuel
                <span className="ml-1.5 text-xs opacity-80">-20%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 lg:p-8 border ${
                  plan.highlighted
                    ? "border-pink-dark bg-white shadow-card ring-2 ring-pink-dark/10 relative"
                    : "border-brand-border bg-white shadow-soft"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-pink-dark text-white text-xs font-medium">
                      Le plus populaire
                    </span>
                  </div>
                )}
                <h3 className="font-serif text-xl text-ink">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-ink">
                    {annual ? plan.annualPrice : plan.monthlyPrice}€
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted">{plan.period}</span>
                  )}
                </div>
                {annual && plan.monthlyPrice !== "0" && (
                  <p className="mt-1 text-xs text-pink-dark font-medium">
                    Économise 20% par an
                  </p>
                )}
                <p className="mt-2 text-sm text-muted">{plan.description}</p>

                <Link
                  href={plan.href}
                  className={`mt-6 block text-center py-3 rounded-xl text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-pink-dark text-white hover:bg-pink-main"
                      : "bg-ivory text-ink border border-brand-border hover:bg-white"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="mt-6 pt-6 border-t border-brand-border space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.name} className="flex items-start gap-2.5">
                      {f.included ? (
                        <Check className="w-4 h-4 text-pink-dark mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-light mt-0.5 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          f.included ? "text-ink" : "text-muted-light"
                        }`}
                      >
                        {f.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Questions sur les tarifs
            </h2>
            <p className="mt-4 text-muted text-lg">
              Tout ce que tu as besoin de savoir sur nos formules.
            </p>
          </div>
          <div className="space-y-4">
            {pricingFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-ivory rounded-2xl border border-brand-border"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none text-left">
                  <span className="text-sm font-medium text-ink">
                    {faq.question}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 -mt-1">
                  <p className="text-sm text-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
            Prête à commencer ?
          </h2>
          <p className="mt-4 text-muted text-lg">
            Crée ton carnet gratuitement et découvre comment CarnetMariage peut
            simplifier tes préparatifs.
          </p>
          <div className="mt-8">
            <Link
              href="/inscription"
              className="inline-flex items-center px-10 py-4 rounded-xl bg-pink-dark text-white font-medium text-base hover:bg-pink-main transition-colors shadow-soft"
            >
              Créer mon carnet — Gratuit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
