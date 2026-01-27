import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/apiResponse";
import { UpdateGuestSchema, makeError } from "@carnetmariage/core";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { data, error } = await auth.supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .eq("wedding_id", auth.wedding!.id)
    .single();

  if (error) return jsonError(makeError("NOT_FOUND", "Invité introuvable"), 404);
  return jsonOk(data);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = UpdateGuestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(makeError("VALIDATION_ERROR", parsed.error.issues[0].message), 400);
  }

  const { data, error } = await auth.supabase
    .from("guests")
    .update(parsed.data)
    .eq("id", id)
    .eq("wedding_id", auth.wedding!.id)
    .select()
    .single();

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonOk(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { error } = await auth.supabase
    .from("guests")
    .delete()
    .eq("id", id)
    .eq("wedding_id", auth.wedding!.id);

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonOk({ deleted: true });
}
