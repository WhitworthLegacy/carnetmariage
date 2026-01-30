import { requireAdmin } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/apiResponse";
import { makeError } from "@carnetmariage/core";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = await createServiceClient();

  const [users, weddings, premiumWeddings, ultimateWeddings] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("weddings").select("id", { count: "exact", head: true }),
    supabase.from("weddings").select("id", { count: "exact", head: true }).eq("plan", "premium"),
    supabase.from("weddings").select("id", { count: "exact", head: true }).eq("plan", "ultimate"),
  ]);

  return jsonOk({
    total_users: users.count || 0,
    total_weddings: weddings.count || 0,
    premium_count: premiumWeddings.count || 0,
    ultimate_count: ultimateWeddings.count || 0,
    mrr: (premiumWeddings.count || 0) * 9.99 + (ultimateWeddings.count || 0) * 19.99,
  });
}
