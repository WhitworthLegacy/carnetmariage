import { requireAdmin } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/apiResponse";
import { makeError } from "@carnetmariage/core";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, weddings(id, partner1_name, partner2_name, wedding_date, plan)")
    .order("created_at", { ascending: false });

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);
  return jsonOk(data);
}
