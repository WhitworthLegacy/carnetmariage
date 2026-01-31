import { createClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/apiResponse";
import { makeError } from "@carnetmariage/core";
import { headers } from "next/headers";

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
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  let user = null;
  let supabase = await createClient();

  // Check for Bearer token (from admin app)
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data.user) {
      user = data.user;
    }
  }

  // Fallback to cookie-based auth
  if (!user) {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data.user) {
      user = data.user;
    }
  }

  if (!user) {
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
