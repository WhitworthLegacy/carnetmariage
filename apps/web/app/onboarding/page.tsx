"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Euro,
  Calendar,
  Camera,
  Music,
  Utensils,
  MapPin,
  Shield,
  Crown,
  Zap,
  Star,
  Gift,
  PartyPopper,
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import { Button, Card } from "@carnetmariage/ui";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const TOTAL_STEPS = 14;

/* ────── Options ────── */
const PLANNING_STATUS = [
  {
    label: "On vient de se fiancer !",
    emoji: "💍",
    value: "just_engaged",
    pain: "Félicitations ! L'aventure commence — et la liste de choses à organiser aussi...",
  },
  {
    label: "On a commencé à chercher",
    emoji: "🔍",
    value: "started",
    pain: "Tu as déjà vu le nombre de prestataires à contacter ? Sans organisation, c'est le stress garanti.",
  },
  {
    label: "On est en pleine organisation",
    emoji: "📋",
    value: "organizing",
    pain: "En pleine organisation et déjà le sentiment d'oublier quelque chose ? C'est normal — on va t'aider.",
  },
  {
    label: "On est proche du jour J !",
    emoji: "🎉",
    value: "close",
    pain: "Le jour J approche ! Il est encore temps de tout structurer pour en profiter sans stress.",
  },
];

const GUEST_RANGES = [
  { label: "Intime", description: "Moins de 30 personnes", value: 20, icon: "💕" },
  { label: "Entre proches", description: "30 à 80 personnes", value: 55, icon: "👨‍👩‍👧‍👦" },
  { label: "Grand mariage", description: "80 à 150 personnes", value: 115, icon: "🎊" },
  { label: "Très grand mariage", description: "Plus de 150 personnes", value: 200, icon: "🏟️" },
];

const BUDGET_OPTIONS = [
  { label: "Moins de 10 000 €", value: 8000 },
  { label: "10 000 – 20 000 €", value: 15000 },
  { label: "20 000 – 35 000 €", value: 27000 },
  { label: "35 000 – 50 000 €", value: 42000 },
  { label: "50 000 – 75 000 €", value: 62000 },
  { label: "Plus de 75 000 €", value: 80000 },
];

const BIGGEST_FEARS = [
  { label: "Dépasser le budget", icon: Euro, value: "budget" },
  { label: "Oublier quelque chose d'important", icon: AlertTriangle, value: "forget" },
  { label: "Ne pas trouver les bons prestataires", icon: Users, value: "vendors" },
  { label: "Gérer la liste d'invités / plan de table", icon: MapPin, value: "guests" },
  { label: "Que le jour J ne soit pas à la hauteur", icon: Star, value: "day" },
  { label: "Le stress et les disputes de couple", icon: Heart, value: "stress" },
];

const STYLES = [
  { label: "Champêtre", emoji: "🌾", description: "Nature, bois, fleurs sauvages" },
  { label: "Bohème", emoji: "🌻", description: "Libre, coloré, décontracté" },
  { label: "Classique", emoji: "🏛️", description: "Élégant, raffiné, intemporel" },
  { label: "Moderne", emoji: "✨", description: "Épuré, design, contemporain" },
  { label: "Romantique", emoji: "🌹", description: "Doux, pastel, poétique" },
  { label: "Destination", emoji: "✈️", description: "Voyage, dépaysement, aventure" },
];

const PRIORITIES = [
  { label: "La nourriture et les boissons", icon: Utensils, value: "food" },
  { label: "Le lieu de réception", icon: MapPin, value: "venue" },
  { label: "Les photos et vidéos", icon: Camera, value: "photos" },
  { label: "La musique et l'ambiance", icon: Music, value: "music" },
  { label: "Les tenues et la beauté", icon: Sparkles, value: "outfits" },
  { label: "La décoration et les fleurs", icon: Gift, value: "deco" },
];

const PAIN_STATS = [
  { stat: "73%", text: "des couples dépassent leur budget initial de mariage" },
  { stat: "6 mois", text: "de stress évitable avec une bonne organisation" },
  { stat: "47", text: "prestataires à contacter en moyenne pour un mariage" },
  { stat: "2 sur 3", text: "couples regrettent de ne pas s'être mieux organisés" },
];

/* ────── Cart upsell items ────── */
interface CartItem {
  id: string;
  label: string;
  description: string;
  price: number;
  icon: typeof Euro;
  /** Which fear/choice triggers this item */
  triggers: { type: "fear" | "guests" | "venue" | "priority" | "always"; value?: string };
  /** Nudge message when unchecking */
  nudge: string;
}

const BUNDLE_PRICE = 27;

const CART_ITEMS: CartItem[] = [
  {
    id: "budget_alerts",
    label: "Alertes budget automatiques",
    description: "Notification dès que vous approchez ou dépassez une limite",
    price: 7,
    icon: Euro,
    triggers: { type: "fear", value: "budget" },
    nudge:
      "Tu avais dit que dépasser le budget te stressait — les alertes automatiques te protègent exactement contre ça.",
  },
  {
    id: "full_checklist",
    label: "Checklist exhaustive + templates",
    description: "250+ tâches pré-organisées par mois et catégorie selon ton style",
    price: 9,
    icon: CheckCircle,
    triggers: { type: "fear", value: "forget" },
    nudge:
      "Tu avais peur d'oublier quelque chose d'important — cette checklist couvre absolument tout, même ce à quoi tu n'aurais pas pensé.",
  },
  {
    id: "vendor_pipeline",
    label: "Pipeline prestataires avancé",
    description: "Suivi, comparaison et notes sur chaque prestataire contacté",
    price: 7,
    icon: Users,
    triggers: { type: "fear", value: "vendors" },
    nudge:
      "Tu avais mentionné la difficulté de trouver les bons prestataires — le pipeline te permet de tout comparer au même endroit.",
  },
  {
    id: "table_plan",
    label: "Plan de table drag & drop",
    description: "Place tes invités visuellement, gère les groupes et contraintes",
    price: 9,
    icon: MapPin,
    triggers: { type: "fear", value: "guests" },
    nudge:
      "La gestion des invités et du plan de table faisait partie de tes inquiétudes — cet outil te simplifie tout.",
  },
  {
    id: "unlimited_guests",
    label: "Invités illimités + suivi RSVP",
    description: "Gère tous tes invités sans limite, avec statut de réponse en temps réel",
    price: 6,
    icon: Users,
    triggers: { type: "guests", value: "80" },
    nudge:
      "Avec plus de 80 invités, gérer les réponses sans outil dédié, c'est un cauchemar logistique. Tu es sûr(e) ?",
  },
  {
    id: "day_timeline",
    label: "Timeline jour J minute par minute",
    description: "Planifie chaque moment du grand jour pour que rien ne soit laissé au hasard",
    price: 7,
    icon: Clock,
    triggers: { type: "fear", value: "day" },
    nudge:
      "Tu voulais que le jour J soit parfait — cette timeline minute par minute te garantit que tout se passe comme prévu.",
  },
  {
    id: "partner_access",
    label: "Accès partenaire (planifiez à deux)",
    description: "Partagez l'organisation avec votre moitié en temps réel",
    price: 6,
    icon: Heart,
    triggers: { type: "fear", value: "stress" },
    nudge:
      "Tu avais peur du stress et des disputes de couple — planifier à deux réduit la charge mentale de moitié.",
  },
  {
    id: "venue_comparator",
    label: "Comparateur de lieux illimité",
    description: "Compare prix, capacité, photos et notes pour chaque lieu visité",
    price: 6,
    icon: MapPin,
    triggers: { type: "venue" },
    nudge:
      "Tu n'as pas encore de lieu — le comparateur te fait gagner des heures de recherche et t'aide à ne pas laisser passer la perle rare.",
  },
  {
    id: "gantt_timeline",
    label: "Timeline Gantt par mois",
    description: "Visualise toute ton organisation sur une frise chronologique",
    price: 5,
    icon: Calendar,
    triggers: { type: "always" },
    nudge:
      "La timeline te permet de garder une vision d'ensemble sur toute l'organisation — tu es sûr(e) de vouloir t'en passer ?",
  },
  {
    id: "pdf_export",
    label: "Export PDF pour prestataires",
    description: "Partage ton planning, budget ou liste d'invités en un clic",
    price: 5,
    icon: Gift,
    triggers: { type: "always" },
    nudge:
      "Les exports PDF sont ultra pratiques pour communiquer avec tes prestataires. Tu préfères leur envoyer des screenshots ?",
  },
];

interface OnboardingData {
  partner1_name: string;
  partner2_name: string;
  wedding_date: string;
  planning_status: string;
  estimated_guests: number;
  total_budget: number;
  biggest_fears: string[];
  style: string;
  priorities: string[];
  has_venue: boolean | null;
  months_left: number | null;
  /* Account creation */
  email: string;
  password: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    partner1_name: "",
    partner2_name: "",
    wedding_date: "",
    planning_status: "",
    estimated_guests: 0,
    total_budget: 0,
    biggest_fears: [],
    style: "",
    priorities: [],
    has_venue: null,
    months_left: null,
    email: "",
    password: "",
  });

  /* ── Cart state ── */
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [nudgeItem, setNudgeItem] = useState<CartItem | null>(null);
  const [cartInitialized, setCartInitialized] = useState(false);

  // Compute months left when date changes
  useEffect(() => {
    if (data.wedding_date) {
      const diff = Math.ceil(
        (new Date(data.wedding_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
      );
      setData((prev) => ({ ...prev, months_left: diff > 0 ? diff : 1 }));
    }
  }, [data.wedding_date]);

  // Build cart when entering step 12 (cart step)
  const buildCart = useCallback(() => {
    if (cartInitialized) return;
    const active = new Set<string>();
    for (const item of CART_ITEMS) {
      const t = item.triggers;
      if (t.type === "always") {
        active.add(item.id);
      } else if (t.type === "fear" && t.value && data.biggest_fears.includes(t.value)) {
        active.add(item.id);
      } else if (t.type === "guests" && data.estimated_guests > 80) {
        active.add(item.id);
      } else if (t.type === "venue" && data.has_venue === false) {
        active.add(item.id);
      }
    }
    setCartItems(active);
    setCartInitialized(true);
  }, [data.biggest_fears, data.estimated_guests, data.has_venue, cartInitialized]);

  function updateData(partial: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...partial }));
    setError(null);
  }

  function toggleFear(fear: string) {
    setData((prev) => ({
      ...prev,
      biggest_fears: prev.biggest_fears.includes(fear)
        ? prev.biggest_fears.filter((f) => f !== fear)
        : [...prev.biggest_fears, fear],
    }));
  }

  function togglePriority(p: string) {
    setData((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(p)
        ? prev.priorities.filter((x) => x !== p)
        : prev.priorities.length < 3
          ? [...prev.priorities, p]
          : prev.priorities,
    }));
  }

  function toggleCartItem(item: CartItem) {
    const isActive = cartItems.has(item.id);
    if (isActive) {
      // Show nudge before removing
      setNudgeItem(item);
    } else {
      setCartItems((prev) => new Set([...prev, item.id]));
    }
  }

  function confirmRemoveFromCart() {
    if (nudgeItem) {
      setCartItems((prev) => {
        const next = new Set(prev);
        next.delete(nudgeItem.id);
        return next;
      });
      setNudgeItem(null);
    }
  }

  function cancelRemoveFromCart() {
    setNudgeItem(null);
  }

  function getCartTotal(): number {
    return CART_ITEMS.filter((item) => cartItems.has(item.id)).reduce(
      (sum, item) => sum + item.price,
      0
    );
  }

  function getRelevantCartItems(): CartItem[] {
    // Show items that are either active or were activated by choices
    return CART_ITEMS.filter((item) => {
      const t = item.triggers;
      if (t.type === "always") return true;
      if (t.type === "fear" && t.value && data.biggest_fears.includes(t.value)) return true;
      if (t.type === "guests" && data.estimated_guests > 80) return true;
      if (t.type === "venue" && data.has_venue === false) return true;
      return false;
    });
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return data.partner1_name.trim().length > 0 && data.partner2_name.trim().length > 0;
      case 2:
        return data.planning_status.length > 0;
      case 3:
        return true; // date optional
      case 4:
        return data.estimated_guests > 0;
      case 5:
        return data.total_budget > 0;
      case 6:
        return data.biggest_fears.length > 0;
      case 7:
        return data.style.length > 0;
      case 8:
        return data.priorities.length > 0;
      case 9:
        return data.has_venue !== null;
      case 10:
        return true; // pain point reveal
      case 11:
        return true; // plan summary
      case 12:
        return true; // cart upsell
      case 13:
        return true; // free vs premium choice summary
      case 14:
        return data.email.trim().length > 0 && data.password.length >= 6;
      default:
        return false;
    }
  }

  function next() {
    if (step < TOTAL_STEPS && canProceed()) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep === 12) buildCart();
    }
  }

  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  function getTaskCount(): number {
    let count = 25;
    if (data.estimated_guests > 80) count += 8;
    if (data.estimated_guests > 150) count += 5;
    if (data.total_budget > 30000) count += 4;
    return count;
  }

  function getVendorCount(): number {
    let count = 12;
    if (data.estimated_guests > 80) count += 5;
    if (data.total_budget > 30000) count += 3;
    return count;
  }

  async function handleSignupAndCreate(plan: "free" | "premium") {
    setLoading(true);
    setError(null);

    try {
      // 1. Create account + wedding via server API (bypasses RLS)
      const selectedItems = CART_ITEMS.filter((item) => cartItems.has(item.id)).map(
        (item) => item.id
      );
      const settings = {
        style: data.style,
        priorities: data.priorities,
        biggest_fears: data.biggest_fears,
        planning_status: data.planning_status,
        estimated_guests: data.estimated_guests,
        has_venue: data.has_venue,
        chosen_plan: plan,
        selected_features: selectedItems,
      };

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.partner1_name,
          wedding: {
            partner1_name: data.partner1_name,
            partner2_name: data.partner2_name,
            wedding_date: data.wedding_date || null,
            total_budget: data.total_budget,
            settings,
          },
          plan,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error === "email_exists") {
          setError("Cet email est déjà utilisé. Connecte-toi plutôt pour retrouver ton carnet.");
        } else {
          setError(result.error || "Erreur lors de la création du compte.");
        }
        setLoading(false);
        return;
      }

      // 2. Sign in to establish browser session
      const supabase = createClient();
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // 3. Redirect to Stripe or dashboard
      if (plan === "premium" && result.weddingId) {
        const stripeRes = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weddingId: result.weddingId,
            email: data.email,
            amount: finalPrice * 100,
          }),
        });
        const stripeResult = await stripeRes.json();
        if (stripeResult.url) {
          window.location.href = stripeResult.url;
        } else {
          console.error("[onboarding] stripe error:", stripeResult);
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("[onboarding] unexpected error:", err);
      setError("Une erreur est survenue. Réessaie dans un instant.");
      setLoading(false);
    }
  }

  const relevantItems = getRelevantCartItems();
  const cartTotal = getCartTotal();
  // If user unchecked enough items to go below bundle price, charge actual total
  const finalPrice = cartTotal <= BUNDLE_PRICE ? cartTotal : BUNDLE_PRICE;
  const hasPremiumItems = cartItems.size > 0;
  const hasDiscount = cartTotal > BUNDLE_PRICE;

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="relative">
        <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-main to-pink-dark rounded-full transition-all duration-500"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <p className="text-center text-xs text-muted mt-2">
          {step <= 9
            ? `Étape ${step} sur ${TOTAL_STEPS}`
            : step === 10
              ? "Ton mariage en chiffres"
              : step === 11
                ? "Ton plan personnalisé"
                : step === 12
                  ? "Ton panier de fonctionnalités"
                  : step === 13
                    ? "Récapitulatif"
                    : "Création de ton espace"}
        </p>
      </div>

      {/* ═══════════ STEP 1: Names ═══════════ */}
      {step === 1 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-light to-purple-light flex items-center justify-center">
                <Heart size={28} className="text-pink-dark" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                Félicitations pour votre mariage !
              </h2>
              <p className="text-muted text-sm leading-relaxed">
                On va créer votre espace de planification personnalisé.
                <br />
                Commençons par le plus important : <strong>vos prénoms</strong>.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Prénom du/de la première marié(e)
                </label>
                <input
                  type="text"
                  placeholder="Marie"
                  value={data.partner1_name}
                  onChange={(e) => updateData({ partner1_name: e.target.value })}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-ivory text-ink placeholder:text-muted-light text-sm focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Prénom du/de la deuxième marié(e)
                </label>
                <input
                  type="text"
                  placeholder="Thomas"
                  value={data.partner2_name}
                  onChange={(e) => updateData({ partner2_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-ivory text-ink placeholder:text-muted-light text-sm focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 2: Where are you? ═══════════ */}
      {step === 2 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-light flex items-center justify-center">
                <Clock size={28} className="text-purple-dark" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Où en êtes-vous dans l'organisation ?
              </h2>
              <p className="text-muted text-sm">Ça nous aide à personnaliser votre checklist.</p>
            </div>
            <div className="space-y-3">
              {PLANNING_STATUS.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => updateData({ planning_status: status.value })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                    data.planning_status === status.value
                      ? "border-pink-main bg-pink-light/30"
                      : "border-brand-border hover:border-pink-main/40 bg-white"
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">{status.emoji}</span>
                  <div>
                    <p className="font-semibold text-ink text-sm">{status.label}</p>
                    {data.planning_status === status.value && (
                      <p className="text-xs text-muted mt-1 italic">{status.pain}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 3: Date ═══════════ */}
      {step === 3 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-pink-light flex items-center justify-center">
                <Calendar size={28} className="text-pink-dark" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">Quand est le grand jour ?</h2>
              <p className="text-muted text-sm">
                Si tu ne sais pas encore, tu pourras l'ajouter plus tard.
              </p>
            </div>
            <input
              type="date"
              value={data.wedding_date}
              onChange={(e) => updateData({ wedding_date: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-ivory text-ink text-sm focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors"
            />
            {data.months_left && data.months_left > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-amber-800 text-sm font-medium">
                  ⏰ Il vous reste <strong>{data.months_left} mois</strong> pour tout organiser.
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  {data.months_left <= 6
                    ? "Le temps file ! Chaque semaine compte pour éviter le rush de dernière minute."
                    : data.months_left <= 12
                      ? "C'est le moment idéal pour structurer votre planning et réserver les meilleurs prestataires."
                      : "Vous avez un peu de temps — mais les meilleurs lieux et prestataires se réservent 12 à 18 mois à l'avance."}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 4: Guest count ═══════════ */}
      {step === 4 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-light flex items-center justify-center">
                <Users size={28} className="text-purple-dark" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Combien d'invités prévoyez-vous ?
              </h2>
              <p className="text-muted text-sm">
                Le nombre d'invités impacte directement votre budget, le choix du lieu et du
                traiteur.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GUEST_RANGES.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => updateData({ estimated_guests: range.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    data.estimated_guests === range.value
                      ? "border-pink-main bg-pink-light/30 shadow-sm"
                      : "border-brand-border hover:border-pink-main/40 bg-white"
                  }`}
                >
                  <span className="text-2xl">{range.icon}</span>
                  <p className="font-semibold text-ink text-sm mt-2">{range.label}</p>
                  <p className="text-xs text-muted mt-0.5">{range.description}</p>
                </button>
              ))}
            </div>
            {data.estimated_guests > 80 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">
                  <strong>⚠️ Plus de {data.estimated_guests > 150 ? "150" : "80"} invités ?</strong>{" "}
                  Gérer les réponses, les régimes alimentaires, le plan de table... sans outil,
                  c'est un cauchemar logistique.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 5: Budget ═══════════ */}
      {step === 5 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-pink-light flex items-center justify-center">
                <Euro size={28} className="text-pink-dark" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Quel est votre budget estimé ?
              </h2>
              <p className="text-muted text-sm">
                En France & Belgique, le budget moyen est de <strong>15 000 à 30 000 €</strong>.
                Sans suivi, 73% des couples le dépassent.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {BUDGET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateData({ total_budget: option.value })}
                  className={`p-3.5 rounded-xl border-2 text-center transition-all font-medium text-sm ${
                    data.total_budget === option.value
                      ? "border-pink-main bg-pink-light/30 text-pink-dark shadow-sm"
                      : "border-brand-border hover:border-pink-main/40 text-ink bg-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-sm">
                💡 <strong>Le savais-tu ?</strong> Les couples qui suivent leur budget avec un outil
                dédié économisent en moyenne <strong>2 300 €</strong> par rapport à ceux qui
                utilisent un simple tableur.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 6: Biggest fears ═══════════ */}
      {step === 6 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Qu'est-ce qui vous stresse le plus ?
              </h2>
              <p className="text-muted text-sm">
                Sélectionnez tout ce qui vous parle. On va s'en occuper ensemble.
              </p>
            </div>
            <div className="space-y-2.5">
              {BIGGEST_FEARS.map((fear) => {
                const Icon = fear.icon;
                const selected = data.biggest_fears.includes(fear.value);
                return (
                  <button
                    key={fear.value}
                    type="button"
                    onClick={() => toggleFear(fear.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      selected
                        ? "border-pink-main bg-pink-light/30"
                        : "border-brand-border hover:border-pink-main/40 bg-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selected ? "bg-pink-main" : "bg-gray-100"
                      }`}
                    >
                      <Icon size={16} className={selected ? "text-white" : "text-muted"} />
                    </div>
                    <span className="text-sm font-medium text-ink">{fear.label}</span>
                    {selected && (
                      <CheckCircle size={18} className="text-pink-main ml-auto flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 7: Style ═══════════ */}
      {step === 7 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-light flex items-center justify-center">
                <Sparkles size={28} className="text-purple-dark" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Quel style pour votre mariage ?
              </h2>
              <p className="text-muted text-sm">
                On adaptera vos tâches et suggestions en fonction.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.label}
                  type="button"
                  onClick={() => updateData({ style: style.label })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    data.style === style.label
                      ? "border-pink-main bg-pink-light/30 shadow-sm"
                      : "border-brand-border hover:border-pink-main/40 bg-white"
                  }`}
                >
                  <div className="text-2xl mb-1.5">{style.emoji}</div>
                  <p className="font-semibold text-ink text-sm">{style.label}</p>
                  <p className="text-xs text-muted mt-0.5">{style.description}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 8: Priorities ═══════════ */}
      {step === 8 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-pink-light flex items-center justify-center">
                <Star size={28} className="text-pink-dark" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Vos 3 priorités pour le jour J ?
              </h2>
              <p className="text-muted text-sm">
                Choisis les 3 postes sur lesquels vous ne ferez aucun compromis.
              </p>
            </div>
            <div className="space-y-2.5">
              {PRIORITIES.map((p) => {
                const Icon = p.icon;
                const selected = data.priorities.includes(p.value);
                const disabled = !selected && data.priorities.length >= 3;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => togglePriority(p.value)}
                    disabled={disabled}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      selected
                        ? "border-purple-main bg-purple-light/30"
                        : disabled
                          ? "border-brand-border bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-brand-border hover:border-purple-main/40 bg-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selected ? "bg-purple-main" : "bg-gray-100"
                      }`}
                    >
                      <Icon size={16} className={selected ? "text-white" : "text-muted"} />
                    </div>
                    <span className="text-sm font-medium text-ink">{p.label}</span>
                    {selected && (
                      <CheckCircle size={18} className="text-purple-main ml-auto flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-muted">
              {data.priorities.length}/3 sélectionnés
            </p>
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 9: Venue ═══════════ */}
      {step === 9 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-light flex items-center justify-center">
                <MapPin size={28} className="text-purple-dark" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Avez-vous déjà un lieu de réception ?
              </h2>
              <p className="text-muted text-sm">
                Le lieu est la première décision — tout le reste en découle.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateData({ has_venue: true })}
                className={`p-5 rounded-xl border-2 text-center transition-all ${
                  data.has_venue === true
                    ? "border-pink-main bg-pink-light/30"
                    : "border-brand-border hover:border-pink-main/40 bg-white"
                }`}
              >
                <div className="text-3xl mb-2">✅</div>
                <p className="font-semibold text-ink text-sm">Oui, c'est réservé</p>
              </button>
              <button
                type="button"
                onClick={() => updateData({ has_venue: false })}
                className={`p-5 rounded-xl border-2 text-center transition-all ${
                  data.has_venue === false
                    ? "border-pink-main bg-pink-light/30"
                    : "border-brand-border hover:border-pink-main/40 bg-white"
                }`}
              >
                <div className="text-3xl mb-2">🔍</div>
                <p className="font-semibold text-ink text-sm">Pas encore</p>
              </button>
            </div>
            {data.has_venue === false && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">
                  <strong>⚠️ Les meilleurs lieux se réservent 12 à 18 mois à l'avance.</strong> On
                  va vous aider à comparer et suivre vos visites pour ne pas laisser passer la perle
                  rare.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 10: Pain reveal ═══════════ */}
      {step === 10 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-light to-purple-light flex items-center justify-center">
                <Zap size={28} className="text-pink-dark" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                {data.partner1_name} & {data.partner2_name}, voici votre mariage en chiffres
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{getTaskCount()}+</p>
                <p className="text-xs text-red-700 mt-1">tâches à accomplir</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{getVendorCount()}+</p>
                <p className="text-xs text-amber-700 mt-1">prestataires à gérer</p>
              </div>
              <div className="bg-purple-light rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-purple-dark">
                  {data.estimated_guests || "~50"}
                </p>
                <p className="text-xs text-purple-700 mt-1">invités à suivre</p>
              </div>
              <div className="bg-pink-light rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-pink-dark">
                  {data.total_budget ? `${(data.total_budget / 1000).toFixed(0)}k €` : "15k €"}
                </p>
                <p className="text-xs text-pink-700 mt-1">de budget à contrôler</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <p className="text-sm font-semibold text-ink text-center">
                Sans outil adapté, voici ce qui arrive :
              </p>
              {PAIN_STATS.map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-sm flex-shrink-0 w-16 text-right">
                    {p.stat}
                  </span>
                  <span className="text-sm text-muted">{p.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-pink-light/50 to-purple-light/50 rounded-xl p-5 text-center">
              <p className="text-ink font-semibold text-sm">
                CarnetMariage centralise tout en un seul endroit pour que vous profitiez de chaque
                moment au lieu de stresser.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 11: Personal plan summary ═══════════ */}
      {step === 11 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-main to-purple-main flex items-center justify-center">
                <PartyPopper size={28} className="text-white" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Votre plan de mariage est prêt !
              </h2>
              <p className="text-muted text-sm">
                Voici ce que CarnetMariage va créer pour {data.partner1_name} & {data.partner2_name}{" "}
                :
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: CheckCircle,
                  text: `${getTaskCount()} tâches organisées par étapes et par date`,
                  color: "text-emerald-600",
                },
                {
                  icon: Euro,
                  text: `Suivi budgétaire avec ${data.total_budget ? (data.total_budget / 1000).toFixed(0) + "k €" : "votre budget"} pré-configuré`,
                  color: "text-pink-dark",
                },
                {
                  icon: Users,
                  text: `Gestion de ${data.estimated_guests || "vos"} invités avec suivi RSVP`,
                  color: "text-purple-dark",
                },
                {
                  icon: MapPin,
                  text: data.has_venue
                    ? "Suivi du lieu réservé + prestataires"
                    : "Comparateur de lieux avec 20+ salles déjà référencées",
                  color: "text-blue-600",
                },
                {
                  icon: Calendar,
                  text: data.months_left
                    ? `Timeline personnalisée sur ${data.months_left} mois`
                    : "Timeline adaptée à votre planning",
                  color: "text-amber-600",
                },
                {
                  icon: Sparkles,
                  text: `Ambiance ${data.style || "personnalisée"} : suggestions de déco et prestataires adaptés`,
                  color: "text-purple-dark",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <Icon size={18} className={`${item.color} flex-shrink-0 mt-0.5`} />
                    <p className="text-sm text-ink">{item.text}</p>
                  </div>
                );
              })}
            </div>

            {data.biggest_fears.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-emerald-800 text-sm font-medium mb-2">
                  ✅ On s'occupe de vos inquiétudes :
                </p>
                <ul className="space-y-1">
                  {data.biggest_fears.includes("budget") && (
                    <li className="text-emerald-700 text-xs">
                      → Alertes automatiques si vous approchez la limite budget
                    </li>
                  )}
                  {data.biggest_fears.includes("forget") && (
                    <li className="text-emerald-700 text-xs">
                      → Checklist exhaustive pour ne rien oublier
                    </li>
                  )}
                  {data.biggest_fears.includes("vendors") && (
                    <li className="text-emerald-700 text-xs">
                      → Pipeline prestataires : comparez, négociez, réservez
                    </li>
                  )}
                  {data.biggest_fears.includes("guests") && (
                    <li className="text-emerald-700 text-xs">
                      → Gestion invités + plan de table drag & drop
                    </li>
                  )}
                  {data.biggest_fears.includes("day") && (
                    <li className="text-emerald-700 text-xs">
                      → Timeline jour J minute par minute
                    </li>
                  )}
                  {data.biggest_fears.includes("stress") && (
                    <li className="text-emerald-700 text-xs">
                      → Tout centralisé = moins de mental charge = plus de complicité
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ═══════════ STEP 12: Cart-based upsell ═══════════ */}
      {step === 12 && (
        <div className="space-y-4">
          <Card className="shadow-soft p-6 sm:p-8">
            <div className="space-y-5">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-main to-purple-main flex items-center justify-center">
                  <Crown size={28} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-ink">
                  Votre panier personnalisé
                </h2>
                <p className="text-muted text-sm leading-relaxed">
                  Sur base de vos réponses, voici les fonctionnalités qui vont vous simplifier la
                  vie.
                  <br />
                  <span className="text-pink-dark font-medium">
                    Vous pouvez les décocher si vous le souhaitez.
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                {relevantItems.map((item) => {
                  const Icon = item.icon;
                  const isChecked = cartItems.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleCartItem(item)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                        isChecked
                          ? "border-pink-main bg-pink-light/20"
                          : "border-brand-border bg-gray-50 opacity-70"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isChecked ? "bg-pink-dark border-pink-dark" : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && <CheckCircle size={12} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-ink flex items-center gap-1.5">
                            <Icon size={14} className="text-pink-dark flex-shrink-0" />
                            {item.label}
                          </span>
                          <span
                            className={`text-sm font-bold flex-shrink-0 ${isChecked ? "text-pink-dark" : "text-muted line-through"}`}
                          >
                            {item.price} €
                          </span>
                        </div>
                        <p className="text-xs text-muted mt-0.5">{item.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tout décocher */}
              <button
                type="button"
                onClick={() => {
                  if (cartItems.size === 0) {
                    setCartItems(new Set(relevantItems.map((item) => item.id)));
                  } else {
                    setCartItems(new Set());
                  }
                }}
                className="w-full text-center text-xs text-muted hover:text-ink transition-colors underline underline-offset-2"
              >
                {cartItems.size === 0 ? "Tout cocher" : "Tout décocher"}
              </button>

              {/* Cart total */}
              {hasPremiumItems && (
                <div className="bg-gradient-to-r from-pink-light/60 to-purple-light/60 rounded-xl p-4 space-y-2">
                  {hasDiscount ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Total à la carte</span>
                        <span className="text-sm text-muted line-through">{cartTotal} €</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-ink flex items-center gap-1.5">
                          <Crown size={14} className="text-pink-dark" />
                          Pack Carnet Complet
                        </span>
                        <span className="text-xl font-bold text-pink-dark">{BUNDLE_PRICE} €</span>
                      </div>
                      <p className="text-xs text-center text-pink-dark font-medium">
                        🔥 Économisez {cartTotal - BUNDLE_PRICE} € avec le pack — paiement unique,
                        accès à vie
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-ink">Total</span>
                      <span className="text-xl font-bold text-pink-dark">{cartTotal} €</span>
                    </div>
                  )}
                </div>
              )}

              {/* Free option */}
              {!hasPremiumItems && (
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-emerald-800 font-medium">
                    ✅ Vous avez tout décoché — vous démarrerez avec la version gratuite.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Reassurance */}
          <div className="bg-emerald-50/60 rounded-xl p-4 text-center">
            <p className="text-sm text-emerald-800">
              💚 <strong>Rassurez-vous :</strong> vous pouvez commencer gratuitement et débloquer
              ces fonctionnalités quand vous le souhaitez.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════ STEP 13: Final choice summary ═══════════ */}
      {step === 13 && (
        <div className="space-y-4">
          {/* Premium CTA */}
          {hasPremiumItems && (
            <Card className="shadow-soft p-6 sm:p-8 border-2 border-pink-main relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-pink-dark to-pink-main text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                RECOMMANDÉ
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
                      <Crown size={20} className="text-pink-dark" />
                      Carnet Complet
                    </h3>
                    <p className="text-muted text-sm">Tout illimité, accès à vie</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-pink-dark">{finalPrice} €</p>
                    {hasDiscount && (
                      <p className="text-xs text-muted line-through">{cartTotal} € à la carte</p>
                    )}
                  </div>
                </div>

                <div className="bg-pink-light/50 rounded-lg p-3 text-center">
                  <p className="text-pink-dark text-sm font-medium">
                    {hasDiscount
                      ? `🔥 Économisez ${cartTotal - BUNDLE_PRICE} € — paiement unique, accès à vie`
                      : "✨ Paiement unique, accès à vie"}
                  </p>
                </div>

                <ul className="space-y-1.5">
                  {CART_ITEMS.filter((item) => cartItems.has(item.id)).map((item) => (
                    <li key={item.id} className="flex items-center gap-2 text-sm text-ink">
                      <CheckCircle size={14} className="text-pink-dark flex-shrink-0" />
                      {item.label}
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-sm text-ink font-medium">
                    <Gift size={14} className="text-pink-dark flex-shrink-0" />+ Tout illimité
                    (tâches, budget, invités, prestataires, lieux)
                  </li>
                </ul>

                <Button
                  variant="primary"
                  className="w-full !bg-gradient-to-r !from-pink-dark !to-pink-main hover:!opacity-90 !py-3.5"
                  onClick={() => {
                    setStep(14);
                    updateData({});
                  }}
                >
                  <Crown size={16} className="mr-2" />
                  Créer mon carnet Complet — {finalPrice} €
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Shield size={12} /> Paiement sécurisé
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={12} /> Satisfait ou remboursé 14j
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Free fallback */}
          <Card className="shadow-soft p-5 border border-brand-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-ink text-sm">Commencer gratuitement</h3>
                <p className="text-xs text-muted mt-0.5">30 tâches, 50 invités, 15 lignes budget</p>
              </div>
              <Button
                variant="ghost"
                className="text-sm"
                onClick={() => {
                  setCartItems(new Set());
                  setStep(14);
                }}
              >
                Démarrer gratuit →
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════ STEP 14: Account creation ═══════════ */}
      {step === 14 && (
        <Card className="shadow-soft p-6 sm:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-light to-purple-light flex items-center justify-center">
                <UserPlus size={28} className="text-pink-dark" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Dernière étape — crée ton compte
              </h2>
              <p className="text-muted text-sm leading-relaxed">
                {hasPremiumItems
                  ? `Ton Carnet Complet pour ${data.partner1_name} & ${data.partner2_name} est prêt ! Crée ton compte pour y accéder.`
                  : `Ton espace gratuit pour ${data.partner1_name} & ${data.partner2_name} est prêt ! Crée ton compte pour commencer.`}
              </p>
            </div>

            {/* Email/Password form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignupAndCreate(hasPremiumItems ? "premium" : "free");
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => updateData({ email: e.target.value })}
                    placeholder="marie@exemple.fr"
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-border bg-ivory text-ink placeholder:text-muted-light text-sm focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => updateData({ password: e.target.value })}
                    placeholder="6 caractères minimum"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-brand-border bg-ivory text-ink placeholder:text-muted-light text-sm focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className={`w-full !py-3.5 ${hasPremiumItems ? "!bg-gradient-to-r !from-pink-dark !to-pink-main hover:!opacity-90" : ""}`}
                disabled={loading || !data.email.trim() || data.password.length < 6}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : hasPremiumItems ? (
                  <Crown size={16} className="mr-2" />
                ) : (
                  <UserPlus size={16} className="mr-2" />
                )}
                {hasPremiumItems
                  ? `Créer mon compte & débloquer le Carnet Complet — ${finalPrice} €`
                  : "Créer mon carnet gratuit"}
              </Button>
            </form>

            {/* Terms */}
            <p className="text-center text-xs text-muted-light leading-relaxed">
              En créant ton compte, tu acceptes nos{" "}
              <Link href="/mentions-legales" className="underline hover:text-muted">
                conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="/mentions-legales" className="underline hover:text-muted">
                politique de confidentialité
              </Link>
              .
            </p>

            {/* Link to login */}
            <p className="text-center text-sm text-muted">
              Déjà un carnet ?{" "}
              <Link
                href="/connexion"
                className="text-pink-dark hover:text-pink-main font-medium transition-colors"
              >
                Connecte-toi
              </Link>
            </p>
          </div>
        </Card>
      )}

      {/* ═══════════ Nudge modal ═══════════ */}
      {nudgeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <button
                onClick={cancelRemoveFromCart}
                className="text-muted hover:text-ink transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-ink mb-2">Tu es sûr(e) ?</h3>
              <p className="text-sm text-muted leading-relaxed">{nudgeItem.nudge}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 text-sm" onClick={confirmRemoveFromCart}>
                Retirer quand même
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-sm !bg-pink-dark hover:!bg-pink-main"
                onClick={cancelRemoveFromCart}
              >
                Garder ✓
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* Navigation buttons */}
      {step <= 11 && (
        <div className="flex items-center justify-between">
          {step > 1 ? (
            <Button variant="ghost" onClick={back} disabled={loading}>
              <ArrowLeft size={16} className="mr-1.5" />
              Retour
            </Button>
          ) : (
            <div />
          )}

          <Button variant="primary" size="lg" onClick={next} disabled={!canProceed()}>
            {step === 11 ? "Voir mes fonctionnalités" : "Suivant"}
            <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </div>
      )}

      {step === 12 && (
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={back} disabled={loading}>
            <ArrowLeft size={16} className="mr-1.5" />
            Retour
          </Button>
          <Button variant="primary" size="lg" onClick={next}>
            Voir le récapitulatif
            <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </div>
      )}

      {step === 13 && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={back} disabled={loading}>
            <ArrowLeft size={16} className="mr-1.5" />
            Modifier mon panier
          </Button>
        </div>
      )}

      {step === 14 && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={back} disabled={loading}>
            <ArrowLeft size={16} className="mr-1.5" />
            Retour
          </Button>
        </div>
      )}

      {/* Reassurance */}
      <p className="text-center text-xs text-muted-light">
        {step <= 9
          ? "Tu pourras modifier toutes ces informations plus tard."
          : step === 14
            ? "Ton carnet est prêt — il ne manque plus que ton compte."
            : ""}
      </p>
    </div>
  );
}
