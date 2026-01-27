import { PLAN_LIMITS, type Plan } from "@carnetmariage/core";
import type { SupabaseClient } from "@supabase/supabase-js";

type Resource = "tasks" | "budget_lines" | "vendors" | "guests" | "venues";

export async function checkPlanLimit(
  supabase: SupabaseClient,
  weddingId: string,
  plan: string,
  resource: Resource
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const limits = PLAN_LIMITS[plan as Plan] || PLAN_LIMITS.free;
  const max = limits[resource];

  if (max === Infinity) return { allowed: true, current: 0, limit: max };

  const { count } = await supabase
    .from(resource)
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId);

  const current = count || 0;
  return { allowed: current < max, current, limit: max };
}
