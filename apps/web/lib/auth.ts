import { createClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/apiResponse";
import { makeError } from "@carnetmariage/core";

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      supabase,
      error: jsonError(makeError("UNAUTHORIZED", "Non authentifié"), 401),
    };
  }

  // Get active wedding
  const { data: wedding } = await supabase
    .from("weddings")
    .select("id, plan")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return { user, supabase, wedding, error: null };
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      supabase,
      error: jsonError(makeError("UNAUTHORIZED", "Non authentifié"), 401),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return { user: null, supabase, error: jsonError(makeError("FORBIDDEN", "Accès refusé"), 403) };
  }

  return { user, supabase, error: null };
}
