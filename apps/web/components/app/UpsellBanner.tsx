"use client";

import Link from "next/link";
import { Sparkles, X, Calendar, Users } from "lucide-react";
import { useState, useEffect } from "react";

interface UpsellBannerProps {
  plan: string;
}

export function UpsellBanner({ plan }: UpsellBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if banner was dismissed this session
    const wasDismissed = sessionStorage.getItem("upsell-banner-dismissed");
    if (wasDismissed) setDismissed(true);
  }, []);

  const isPremium = ["premium", "lifetime"].includes(plan);

  // Don't show for premium users or if dismissed
  if (isPremium || dismissed || !mounted) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("upsell-banner-dismissed", "true");
  };

  return (
    <div className="relative bg-gradient-to-r from-pink-light via-purple-light to-pink-light rounded-2xl p-4 sm:p-5 border border-pink-main/20 overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-2 left-4 text-pink-main text-lg">✨</div>
        <div className="absolute bottom-2 right-8 text-purple-main text-sm">✨</div>
        <div className="absolute top-3 right-20 text-pink-dark text-xs">✨</div>
      </div>

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm">
          <Sparkles className="w-6 h-6 text-pink-dark" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-ink text-sm sm:text-base">
            Débloque le plan de table et la timeline jour J
          </p>
          <p className="text-muted text-xs sm:text-sm mt-0.5 flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Timeline
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3" />
              Plan de table
            </span>
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard/parametres?upgrade=true"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-dark text-white text-sm font-medium hover:bg-pink-main transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Passer Premium</span>
          <span className="sm:hidden">27€</span>
        </Link>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 p-1.5 rounded-lg text-muted hover:text-ink hover:bg-white/50 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
