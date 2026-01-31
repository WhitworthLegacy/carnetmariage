import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/profile/tour
 * Marks the guided tour as seen for the current user
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ has_seen_tour: true })
      .eq("id", user.id);

    if (error) {
      console.error("[api/profile/tour] error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/profile/tour] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
