import Link from "next/link";
import {
  CheckSquare,
  PiggyBank,
  Users,
  Star,
  MapPin,
  Heart,
  Check,
  X,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    title: "Planning intelligent",
    description: "Checklist personnalisée avec les étapes clés de l'organisation.",
  },
  {
    icon: PiggyBank,
    title: "Budget maîtrisé",
    description: "Suis tes dépenses, compare estimé vs payé, reste sereine.",
  },
  {
    icon: Users,
    title: "Liste d'invités",
    description: "Gère les RSVP, les régimes, les tables — tout est centralisé.",
  },
  {
    icon: Star,
    title: "Prestataires",
    description: "Compare, note et suis l'avancement avec chaque prestataire.",
  },
  {
    icon: MapPin,
    title: "Lieux",
    description: "Organise tes visites, compare les options, fais ton choix.",
  },
  {
    icon: Heart,
    title: "Fait pour les couples",
    description: "Partagez votre carnet et organisez à deux, en temps réel.",
  },
];

const painPoints = [
  "Notes éparpillées partout",
  "Budget flou, surprises à chaque facture",
  "Liste d'invités sur un Google Sheet cassé",
  "Stress et charge mentale permanente",
];

const benefits = [
  "Tout centralisé, accessible partout",
  "Budget clair, pas de mauvaises surprises",
  "Invités suivis avec statuts RSVP",
  "Organisation douce, préparatifs agréables",
];

const testimonials = [
  {
    name: "Claire & Thomas",
    role: "Mariés en juin 2025",
    quote:
      "CarnetMariage nous a sauvé la mise. On avait tout au même endroit, plus besoin de chercher dans 10 apps différentes.",
    initials: "CT",
  },
  {
    name: "Sophie & Antoine",
    role: "Mariage prévu en septembre",
    quote:
      "Le suivi du budget est incroyable. On sait exactement où on en est, sans surprises. C'est un vrai soulagement.",
    initials: "SA",
  },
  {
    name: "Marine & Julie",
    role: "Mariées en mai 2025",
    quote:
      "On a adoré pouvoir organiser à deux en temps réel. L'interface est magnifique et tellement intuitive.",
    initials: "MJ",
  },
];

const pricingPlans = [
  {
    name: "Gratuit",
    price: "0",
    period: "",
    description: "Pour découvrir et commencer à s'organiser.",
    features: ["Checklist de base", "Budget simplifié", "Jusqu'à 50 invités", "1 utilisateur"],
    cta: "Commencer gratuitement",
    href: "/inscription",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "9,99",
    period: "/mois",
    description: "Pour les couples qui veulent tout organiser sereinement.",
    features: [
      "Checklist illimitée",
      "Budget détaillé",
      "Invités illimités",
      "2 utilisateurs",
      "Gestion des prestataires",
      "Plan de table",
      "Support prioritaire",
    ],
    cta: "Essai gratuit 14 jours",
    href: "/inscription?plan=premium",
    highlighted: true,
  },
  {
    name: "Ultimate",
    price: "19,99",
    period: "/mois",
    description: "L'expérience complète avec un accompagnement personnalisé.",
    features: [
      "Tout Premium inclus",
      "Tableau de bord avancé",
      "Export PDF du carnet",
      "Jusqu'à 5 utilisateurs",
      "Intégrations calendrier",
      "Templates personnalisés",
      "Assistance dédiée",
    ],
    cta: "Essai gratuit 14 jours",
    href: "/inscription?plan=ultimate",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "Comment ça marche ?",
    answer:
      "Crée ton compte en 30 secondes, réponds à 5 questions sur ton mariage, et ton carnet personnalisé est prêt.",
  },
  {
    question: "C'est vraiment gratuit ?",
    answer:
      "Oui ! Le plan gratuit inclut les outils essentiels. Tu peux passer à Premium quand tu veux.",
  },
  {
    question: "Mon partenaire peut-il accéder au carnet ?",
    answer: "Avec le plan Premium, tu peux inviter ton/ta partenaire pour organiser ensemble.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Tes données sont chiffrées et hébergées en Europe (RGPD).",
  },
  {
    question: "Puis-je annuler à tout moment ?",
    answer: "Oui, sans engagement. Tu gardes l'accès jusqu'à la fin de ta période payée.",
  },
  {
    question: "Que se passe-t-il après le mariage ?",
    answer: "Tu gardes l'accès à ton carnet comme souvenir. Les données ne sont jamais supprimées.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, rgba(216,167,177,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(167,139,250,0.08) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink leading-tight tracking-tight">
              Organise ton mariage en toute sérénité
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Tu veux profiter des préparatifs... sans tout porter dans ta tête ? Ton carnet digital
              t'accompagne étape par étape.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/inscription"
                className="inline-flex items-center px-8 py-3.5 rounded-xl bg-pink-dark text-white font-medium text-base hover:bg-pink-main transition-colors shadow-soft"
              >
                Créer mon carnet — Gratuit
              </Link>
              <Link
                href="#fonctionnalites"
                className="inline-flex items-center px-8 py-3.5 rounded-xl border border-brand-border text-ink font-medium text-base hover:bg-white transition-colors"
              >
                Découvrir les fonctionnalités
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-pink-dark" />
                Gratuit pour commencer
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-pink-dark" />
                Prêt en 1 minute
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-pink-dark" />
                Sans carte bancaire
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="fonctionnalites" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Tout ce dont tu as besoin
            </h2>
            <p className="mt-4 text-muted text-lg">
              Les outils essentiels pour organiser ton mariage sans stress.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-soft border border-brand-border hover:shadow-card transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-pink-light flex items-center justify-center mb-5">
                  <feature.icon className="w-5 h-5 text-pink-dark" />
                </div>
                <h3 className="font-serif text-lg text-ink mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Before / After ─── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Avant vs Après
            </h2>
            <p className="mt-4 text-muted text-lg">
              Découvre la différence qu'un carnet bien organisé peut faire.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* Before */}
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 lg:p-8">
              <p className="text-lg font-medium text-ink mb-6 flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label="overwhelmed">
                  😵
                </span>
                Sans CarnetMariage
              </p>
              <ul className="space-y-4">
                {painPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* After */}
            <div className="rounded-2xl border border-green-200 bg-green-50/50 p-6 lg:p-8">
              <p className="text-lg font-medium text-ink mb-6 flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label="peaceful">
                  🌿
                </span>
                Avec CarnetMariage
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-ink">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Ils nous font confiance
            </h2>
            <p className="mt-4 text-muted text-lg">
              Des couples heureux qui ont organisé leur mariage avec nous.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-soft border border-brand-border"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-pink-light flex items-center justify-center">
                    <span className="text-xs font-semibold text-pink-dark">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
                <blockquote className="text-sm text-muted leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Preview ─── */}
      <section id="tarifs" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Un carnet adapté à chaque couple
            </h2>
            <p className="mt-4 text-muted text-lg">
              Commence gratuitement, évolue quand tu es prête.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
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
                      Recommandé
                    </span>
                  </div>
                )}
                <h3 className="font-serif text-xl text-ink">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-ink">{plan.price}€</span>
                  {plan.period && <span className="text-sm text-muted">{plan.period}</span>}
                </div>
                <p className="mt-2 text-sm text-muted">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-pink-dark mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-ink">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 block text-center py-3 rounded-xl text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-pink-dark text-white hover:bg-pink-main"
                      : "bg-ivory text-ink border border-brand-border hover:bg-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Questions fréquentes
            </h2>
            <p className="mt-4 text-muted text-lg">
              Tout ce que tu as besoin de savoir avant de commencer.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-white rounded-2xl border border-brand-border shadow-soft"
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

      {/* ─── Final CTA ─── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl px-6 py-16 sm:px-12 sm:py-20 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(216,167,177,0.15) 0%, rgba(167,139,250,0.12) 100%)",
            }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight max-w-xl mx-auto">
              Ton mariage mérite d'être organisé en douceur
            </h2>
            <p className="mt-4 text-muted text-lg max-w-md mx-auto">
              Rejoins des centaines de couples qui préparent leur mariage sereinement.
            </p>
            <div className="mt-10">
              <Link
                href="/inscription"
                className="inline-flex items-center px-10 py-4 rounded-xl bg-pink-dark text-white font-medium text-base hover:bg-pink-main transition-colors shadow-soft"
              >
                Créer mon carnet — Gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
