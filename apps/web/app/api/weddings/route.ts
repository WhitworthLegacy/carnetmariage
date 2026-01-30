import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/apiResponse";
import { UpdateWeddingSchema, makeError } from "@carnetmariage/core";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { data, error } = await auth.supabase
    .from("weddings")
    .select("*")
    .eq("owner_id", auth.user!.id)
    .order("created_at", { ascending: false });

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonOk(data);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = UpdateWeddingSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(makeError("VALIDATION_ERROR", parsed.error.issues[0].message), 400);
  }

  const { data, error } = await auth.supabase
    .from("weddings")
    .update(parsed.data)
    .eq("id", auth.wedding!.id)
    .select()
    .single();

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonOk(data);
}
