"use client";

import { createContext, useContext } from "react";
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

interface WeddingContextValue {
  wedding: WeddingData;
  user: User;
  isPremium: boolean;
  isUltimate: boolean;
}

const WeddingContext = createContext<WeddingContextValue | null>(null);

export function WeddingProvider({
  wedding,
  user,
  children,
}: {
  wedding: WeddingData;
  user: User;
  children: React.ReactNode;
}) {
  const isPremium = ["premium", "ultimate", "lifetime"].includes(wedding.plan);
  const isUltimate = ["ultimate", "lifetime"].includes(wedding.plan);

  return (
    <WeddingContext.Provider value={{ wedding, user, isPremium, isUltimate }}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error("useWedding must be used within WeddingProvider");
  return ctx;
}
