import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, jsonCreated } from "@/lib/apiResponse";
import { makeError, checkPlanLimit } from "@carnetmariage/core";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!auth.wedding) return jsonError(makeError("NO_WEDDING", "Aucun mariage trouvé"), 404);

  const { data, error } = await auth.supabase
    .from("seating_tables")
    .select("*")
    .eq("wedding_id", auth.wedding.id)
    .order("created_at", { ascending: true });

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonOk(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!auth.wedding) return jsonError(makeError("NO_WEDDING", "Aucun mariage trouvé"), 404);

  // Check plan limit (tables are premium-only)
  const limitCheck = checkPlanLimit(auth.wedding.plan, "tables", 0);
  if (!limitCheck.allowed) {
    return jsonError(makeError("PLAN_LIMIT", limitCheck.message), 403);
  }

  const body = await request.json();

  const { data, error } = await auth.supabase
    .from("seating_tables")
    .insert({
      wedding_id: auth.wedding.id,
      name: body.name || "Nouvelle table",
      capacity: body.capacity || 8,
      shape: body.shape || "round",
      position_x: body.position_x || 0,
      position_y: body.position_y || 0,
    })
    .select()
    .single();

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonCreated(data);
}
