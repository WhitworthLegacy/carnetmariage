import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { corsOptions, corsJson, corsError } from "@/lib/cors";

export const OPTIONS = corsOptions;

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return corsError("Non authentifié", 401);

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("weddings")
    .select("*, profiles!owner_id(email, full_name), tasks(count), guests(count)")
    .order("created_at", { ascending: false });

  if (error) return corsError(error.message, 500);
  return corsJson({ ok: true, data });
}
