"use client";

import React from "react";
import { Sparkles, Heart, Calendar, Users, FileText } from "lucide-react";
import { useWedding } from "@/contexts/WeddingContext";
import { Button } from "@carnetmariage/ui";
import Link from "next/link";

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: "timeline" | "tables" | "export" | "default";
  fallback?: React.ReactNode;
}

const FEATURE_CONFIG = {
  timeline: {
    icon: Calendar,
    title: "Timeline du jour J",
    description: "Planifie chaque moment de ton mariage, de la cérémonie à la soirée.",
    benefit: "Ne rate aucun moment important",
  },
  tables: {
    icon: Users,
    title: "Plan de table interactif",
    description: "Place tes invités en drag & drop et visualise ta salle.",
    benefit: "Fini les casse-têtes de placement",
  },
  export: {
    icon: FileText,
    title: "Export PDF",
    description: "Télécharge ton carnet complet en PDF pour l'avoir toujours sur toi.",
    benefit: "Ton mariage, même hors-ligne",
  },
  default: {
    icon: Sparkles,
    title: "Fonctionnalité Premium",
    description: "Débloquez toutes les fonctionnalités avancées pour organiser votre mariage sereinement.",
    benefit: "Accès à vie pour seulement 27€",
  },
};

function DefaultFallback({ feature = "default" }: { feature: keyof typeof FEATURE_CONFIG }) {
  const config = FEATURE_CONFIG[feature];
  const Icon = config.icon;

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Blurred mock content */}
      <div className="blur-sm pointer-events-none select-none opacity-50 p-8">
        <div className="space-y-4">
          <div className="h-8 bg-ivory rounded-xl w-3/4" />
          <div className="h-4 bg-ivory rounded-lg w-1/2" />
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-ivory rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-ivory rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Premium overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/80 to-white/95 backdrop-blur-[3px]">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-light to-purple-light flex items-center justify-center mx-auto mb-6 shadow-soft">
            <Icon className="w-9 h-9 text-pink-dark" />
          </div>

          {/* Title */}
          <h3 className="font-serif text-2xl text-ink mb-3">{config.title}</h3>

          {/* Description */}
          <p className="text-muted text-sm mb-4 leading-relaxed">{config.description}</p>

          {/* Benefit badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-light/50 text-pink-dark text-sm font-medium mb-6">
            <Heart className="w-4 h-4 fill-current" />
            {config.benefit}
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Link href="/dashboard/parametres?upgrade=true" className="block">
              <Button variant="primary" size="lg" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Débloquer pour 27€
              </Button>
            </Link>
            <p className="text-xs text-muted">
              Paiement unique • Accès à vie • Satisfait ou remboursé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PremiumGate({ children, feature = "default", fallback }: PremiumGateProps) {
  const { isPremium } = useWedding();

  if (isPremium) {
    return <>{children}</>;
  }

  return <>{fallback ?? <DefaultFallback feature={feature} />}</>;
}
