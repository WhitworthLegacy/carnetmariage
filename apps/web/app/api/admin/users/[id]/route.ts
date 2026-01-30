import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/apiResponse";
import { makeError } from "@carnetmariage/core";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "*, weddings(*, tasks(count), budget_lines(count), vendors(count), venues(count), guests(count))"
    )
    .eq("id", id)
    .single();

  if (error) return jsonError(makeError("NOT_FOUND", "Utilisateur introuvable"), 404);
  return jsonOk(data);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json();
  const supabase = await createServiceClient();

  // Update profile
  if (body.role || body.is_active !== undefined) {
    await supabase
      .from("profiles")
      .update({
        ...(body.role && { role: body.role }),
        ...(body.is_active !== undefined && { is_active: body.is_active }),
      })
      .eq("id", id);
  }

  // Update wedding plan if specified
  if (body.plan) {
    await supabase.from("weddings").update({ plan: body.plan }).eq("owner_id", id);
  }

  return jsonOk({ updated: true });
}
