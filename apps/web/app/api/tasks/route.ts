import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, jsonCreated } from "@/lib/apiResponse";
import { CreateTaskSchema, makeError } from "@carnetmariage/core";
import { checkPlanLimit } from "@/lib/planLimits";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { data, error } = await auth.supabase
    .from("tasks")
    .select("*")
    .eq("wedding_id", auth.wedding!.id)
    .order("position", { ascending: true });

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonOk(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { allowed, current, limit } = await checkPlanLimit(
    auth.supabase, auth.wedding!.id, auth.wedding!.plan, "tasks"
  );
  if (!allowed) {
    return jsonError(makeError("PLAN_LIMIT_REACHED", `Limite atteinte : ${current}/${limit} tâches. Passe à Premium pour en ajouter plus.`), 403);
  }

  const body = await request.json();
  const parsed = CreateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(makeError("VALIDATION_ERROR", parsed.error.issues[0].message), 400);
  }

  const { data, error } = await auth.supabase
    .from("tasks")
    .insert({ ...parsed.data, wedding_id: auth.wedding!.id })
    .select()
    .single();

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonCreated(data);
}
