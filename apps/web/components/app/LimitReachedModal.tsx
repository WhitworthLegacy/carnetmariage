"use client";

import { Modal, Button } from "@carnetmariage/ui";
import { Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { PLAN_LIMITS } from "@carnetmariage/core";

type LimitType = keyof typeof PLAN_LIMITS.free;

interface LimitReachedModalProps {
  open: boolean;
  onClose: () => void;
  limitType: LimitType;
  currentCount: number;
}

const LIMIT_CONFIG: Record<LimitType, { label: string; emoji: string; singular: string }> = {
  tasks: { label: "tâches", emoji: "📋", singular: "tâche" },
  budget_lines: { label: "postes de budget", emoji: "💰", singular: "poste" },
  vendors: { label: "prestataires", emoji: "⭐", singular: "prestataire" },
  guests: { label: "invités", emoji: "👥", singular: "invité" },
  venues: { label: "lieux", emoji: "🏰", singular: "lieu" },
};

export function LimitReachedModal({
  open,
  onClose,
  limitType,
  currentCount,
}: LimitReachedModalProps) {
  const limit = PLAN_LIMITS.free[limitType];
  const config = LIMIT_CONFIG[limitType];

  return (
    <Modal open={open} onClose={onClose} title="">
      <div className="text-center py-4">
        {/* Emoji */}
        <div className="text-5xl mb-4">{config.emoji}</div>

        {/* Alert badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-4">
          <AlertCircle className="w-4 h-4" />
          Limite atteinte
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl text-ink mb-2">
          Tu as atteint ta limite de {limit} {config.label}
        </h3>

        {/* Description */}
        <p className="text-muted text-sm mb-6 leading-relaxed max-w-sm mx-auto">
          Avec le plan gratuit, tu peux avoir jusqu'à {limit} {config.label}.
          Passe en Premium pour débloquer l'illimité !
        </p>

        {/* Stats */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ivory text-sm mb-6">
          <span className="font-semibold text-ink">{currentCount}</span>
          <span className="text-muted">/ {limit} {config.label}</span>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden ml-2">
            <div
              className="h-full bg-pink-main rounded-full"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link href="/dashboard/parametres?upgrade=true" className="block">
            <Button variant="primary" size="lg" className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Débloquer l'illimité — 27€
            </Button>
          </Link>
          <button
            onClick={onClose}
            className="text-sm text-muted hover:text-ink transition-colors"
          >
            Plus tard
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-light mt-4">
          Paiement unique • Accès à vie
        </p>
      </div>
    </Modal>
  );
}

// Hook to check limit and show modal
export function useLimitCheck(limitType: LimitType, currentCount: number) {
  const limit = PLAN_LIMITS.free[limitType];
  const isAtLimit = currentCount >= limit;
  const remaining = Math.max(0, limit - currentCount);

  return {
    isAtLimit,
    remaining,
    limit,
    percentUsed: Math.min(100, (currentCount / limit) * 100),
  };
}
