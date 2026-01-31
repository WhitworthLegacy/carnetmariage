import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/apiResponse";
import { makeError } from "@carnetmariage/core";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!auth.wedding) return jsonError(makeError("NO_WEDDING", "Aucun mariage trouvé"), 404);

  const body = await request.json();

  const { data, error } = await auth.supabase
    .from("seating_tables")
    .update({
      ...(body.name !== undefined && { name: body.name }),
      ...(body.capacity !== undefined && { capacity: body.capacity }),
      ...(body.shape !== undefined && { shape: body.shape }),
      ...(body.position_x !== undefined && { position_x: body.position_x }),
      ...(body.position_y !== undefined && { position_y: body.position_y }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("wedding_id", auth.wedding.id)
    .select()
    .single();

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonOk(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!auth.wedding) return jsonError(makeError("NO_WEDDING", "Aucun mariage trouvé"), 404);

  // First unassign all guests from this table
  await auth.supabase
    .from("guests")
    .update({ table_id: null })
    .eq("table_id", id);

  const { error } = await auth.supabase
    .from("seating_tables")
    .delete()
    .eq("id", id)
    .eq("wedding_id", auth.wedding.id);

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonOk({ deleted: true });
}
