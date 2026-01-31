"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";

export interface WeddingData {
  id: string;
  owner_id: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string | null;
  estimated_guests: number | null;
  total_budget: number;
  style: string | null;
  plan: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProfileData {
  id: string;
  has_seen_tour: boolean;
}

interface WeddingContextValue {
  wedding: WeddingData;
  user: User;
  isPremium: boolean;
  hasSeenTour: boolean;
  markTourAsSeen: () => Promise<void>;
}

const WeddingContext = createContext<WeddingContextValue | null>(null);

export function WeddingProvider({
  wedding,
  user,
  profile,
  children,
}: {
  wedding: WeddingData;
  user: User;
  profile?: ProfileData;
  children: React.ReactNode;
}) {
  // Premium = premium or lifetime (legacy alias)
  const isPremium = ["premium", "lifetime"].includes(wedding.plan);
  const [hasSeenTour, setHasSeenTour] = useState(profile?.has_seen_tour ?? false);

  const markTourAsSeen = useCallback(async () => {
    try {
      await fetch("/api/profile/tour", { method: "POST" });
      setHasSeenTour(true);
    } catch (error) {
      console.error("Failed to mark tour as seen:", error);
    }
  }, []);

  return (
    <WeddingContext.Provider value={{ wedding, user, isPremium, hasSeenTour, markTourAsSeen }}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error("useWedding must be used within WeddingProvider");
  return ctx;
}
