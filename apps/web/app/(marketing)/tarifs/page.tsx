import Link from "next/link";
import { Check, X, ChevronDown, Sparkles, Heart } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "",
    description: "Pour découvrir et commencer à s'organiser.",
    features: [
      { name: "30 tâches", included: true },
      { name: "15 postes de budget", included: true },
      { name: "Jusqu'à 50 invités", included: true },
      { name: "10 prestataires", included: true },
      { name: "3 lieux à comparer", included: true },
      { name: "1 utilisateur", included: true },
      { name: "Timeline jour J", included: false },
      { name: "Plan de table interactif", included: false },
      { name: "Export PDF", included: false },
      { name: "Invités illimités + RSVP", included: false },
    ],
    cta: "Commencer gratuitement",
    href: "/inscription",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "27€",
    period: "paiement unique",
    description: "Tout débloquer, pour toujours. Pas d'abonnement.",
    features: [
      { name: "Tâches illimitées", included: true },
      { name: "Budget illimité avec catégories", included: true },
      { name: "Invités illimités + RSVP", included: true },
      { name: "Prestataires illimités", included: true },
      { name: "Lieux illimités", included: true },
      { name: "2 utilisateurs (couple)", included: true },
      { name: "Timeline jour J", included: true },
      { name: "Plan de table interactif", included: true },
      { name: "Export PDF du carnet", included: true },
      { name: "Support prioritaire", included: true },
    ],
    cta: "Débloquer tout pour 27€",
    href: "/inscription?plan=premium",
    highlighted: true,
  },
];

const pricingFaqs = [
  {
    question: "C'est vraiment un paiement unique ?",
    answer:
      "Oui ! Tu paies 27€ une seule fois et tu gardes l'accès Premium à vie. Pas d'abonnement, pas de renouvellement automatique, pas de mauvaises surprises.",
  },
  {
    question: "Puis-je commencer gratuitement et passer Premium plus tard ?",
    answer:
      "Absolument ! Tu peux utiliser la version gratuite aussi longtemps que tu veux. Quand tu te sens prêt(e), tu peux passer Premium en un clic depuis ton tableau de bord.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les cartes Visa, Mastercard et American Express. Le paiement est 100% sécurisé via Stripe.",
  },
  {
    question: "Et si je ne suis pas satisfait(e) ?",
    answer:
      "On te rembourse sans question dans les 14 jours suivant ton achat. Contacte-nous simplement par email.",
  },
  {
    question: "Mes données sont-elles conservées après le mariage ?",
    answer:
      "Oui, ton carnet reste accessible indéfiniment. Tu pourras même le consulter des années après pour te remémorer les préparatifs !",
  },
  {
    question: "Pourquoi 27€ et pas un abonnement mensuel ?",
    answer:
      "On trouve que les abonnements pour un mariage, c'est un peu absurde. Tu prépares ton mariage pendant quelques mois, pas toute ta vie. Un paiement unique, c'est plus simple et plus honnête.",
  },
];

export default function TarifsPage() {
  return (
    <>
      {/* Header */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-light text-pink-dark text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Paiement unique — Accès à vie
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink tracking-tight">
              Simple, transparent, sans surprise
            </h1>
            <p className="mt-4 text-lg text-muted">
              Commence gratuitement. Passe Premium quand tu veux — une seule fois, pour toujours.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
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
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-dark text-white text-xs font-medium">
                      <Heart className="w-3 h-3 fill-current" />
                      Recommandé
                    </span>
                  </div>
                )}
                <h3 className="font-serif text-xl text-ink">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold text-ink">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted bg-ivory px-2 py-0.5 rounded-full">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-muted">{plan.description}</p>

                <Link
                  href={plan.href}
                  className={`mt-6 block text-center py-3.5 rounded-xl text-sm font-medium transition-all ${
                    plan.highlighted
                      ? "bg-pink-dark text-white hover:bg-pink-main hover:shadow-lg"
                      : "bg-ivory text-ink border border-brand-border hover:bg-white hover:border-pink-main"
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
                      <span className={`text-sm ${f.included ? "text-ink" : "text-muted-light"}`}>
                        {f.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              Paiement sécurisé Stripe
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              Remboursement 14 jours
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              Pas d'abonnement caché
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Questions fréquentes
            </h2>
            <p className="mt-4 text-muted text-lg">
              Tout ce que tu as besoin de savoir sur nos tarifs.
            </p>
          </div>
          <div className="space-y-4">
            {pricingFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-ivory rounded-2xl border border-brand-border"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none text-left">
                  <span className="text-sm font-medium text-ink">{faq.question}</span>
                  <ChevronDown className="w-4 h-4 text-muted flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 -mt-1">
                  <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
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
            Prêt(e) à organiser ton mariage ?
          </h2>
          <p className="mt-4 text-muted text-lg">
            Crée ton carnet gratuitement et découvre comment CarnetMariage peut simplifier tes
            préparatifs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inscription"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-ivory text-ink font-medium text-base border border-brand-border hover:bg-white hover:border-pink-main transition-colors"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/inscription?plan=premium"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-pink-dark text-white font-medium text-base hover:bg-pink-main transition-colors shadow-soft"
            >
              Débloquer tout — 27€
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
