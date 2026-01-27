"use client";

import React from "react";
import { Lock, Sparkles } from "lucide-react";
import { useWedding } from "@/contexts/WeddingContext";
import { Button } from "@carnetmariage/ui";
import Link from "next/link";

interface PremiumGateProps {
  children: React.ReactNode;
  requiredPlan?: "premium" | "ultimate";
  fallback?: React.ReactNode;
}

function DefaultFallback({ requiredPlan }: { requiredPlan: string }) {
  const planLabel = requiredPlan === "ultimate" ? "Ultimate" : "Premium";

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Blurred mock content */}
      <div className="blur-sm pointer-events-none select-none opacity-60 p-8">
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

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-16 h-16 rounded-full bg-purple-light flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7 text-purple-dark" />
          </div>
          <h3 className="font-serif text-xl text-ink mb-2">
            Fonctionnalite {planLabel}
          </h3>
          <p className="text-muted text-sm mb-6 leading-relaxed">
            Passe a {planLabel} pour debloquer cette fonctionnalite et profiter
            de toutes les options avancees.
          </p>
          <Link href="/dashboard/parametres">
            <Button variant="primary" size="md">
              <Sparkles className="w-4 h-4 mr-2" />
              Passer a {planLabel}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PremiumGate({
  children,
  requiredPlan = "premium",
  fallback,
}: PremiumGateProps) {
  const { isPremium, isUltimate } = useWedding();

  const hasAccess =
    requiredPlan === "premium" ? isPremium : isUltimate;

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <>
      {fallback ?? <DefaultFallback requiredPlan={requiredPlan} />}
    </>
  );
}
