import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { corsOptions, corsJson, corsError } from "@/lib/cors";

export const OPTIONS = corsOptions;

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) {
    return corsError("Non authentifié", 401);
  }

  const supabase = await createServiceClient();

  const [users, weddings, freeWeddings, premiumWeddings, lifetimeWeddings] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("weddings").select("id", { count: "exact", head: true }),
    supabase.from("weddings").select("id", { count: "exact", head: true }).eq("plan", "free"),
    supabase.from("weddings").select("id", { count: "exact", head: true }).eq("plan", "premium"),
    supabase.from("weddings").select("id", { count: "exact", head: true }).eq("plan", "lifetime"),
  ]);

  const totalPremium = (premiumWeddings.count || 0) + (lifetimeWeddings.count || 0);
  const totalRevenue = totalPremium * 27;

  return corsJson({
    totalUsers: users.count || 0,
    activeWeddings: weddings.count || 0,
    premiumSubscribers: totalPremium,
    estimatedMrr: totalRevenue,
    planDistribution: {
      free: freeWeddings.count || 0,
      premium: totalPremium,
      ultimate: 0,
    },
  });
}
