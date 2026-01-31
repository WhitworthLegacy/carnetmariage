import { requireAdmin } from "@/lib/auth";
import { jsonOk, jsonError as _jsonError } from "@/lib/apiResponse";
import { makeError as _makeError } from "@carnetmariage/core";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = await createServiceClient();

  const [users, weddings, freeWeddings, premiumWeddings, lifetimeWeddings] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("weddings").select("id", { count: "exact", head: true }),
    supabase.from("weddings").select("id", { count: "exact", head: true }).eq("plan", "free"),
    supabase.from("weddings").select("id", { count: "exact", head: true }).eq("plan", "premium"),
    supabase.from("weddings").select("id", { count: "exact", head: true }).eq("plan", "lifetime"),
  ]);

  const totalPremium = (premiumWeddings.count || 0) + (lifetimeWeddings.count || 0);
  // One-shot payment model: 27€ per premium user (not MRR)
  const totalRevenue = totalPremium * 27;

  return jsonOk({
    totalUsers: users.count || 0,
    activeWeddings: weddings.count || 0,
    premiumSubscribers: totalPremium,
    estimatedMrr: totalRevenue, // Now represents total revenue, not MRR
    planDistribution: {
      free: freeWeddings.count || 0,
      premium: totalPremium,
      ultimate: 0, // Deprecated, kept for compatibility
    },
  });
}
