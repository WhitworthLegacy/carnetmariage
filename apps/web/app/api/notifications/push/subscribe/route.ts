import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/notifications/push/subscribe
 * Save push notification subscription for the current user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is premium
    const { data: wedding } = await supabase
      .from("weddings")
      .select("plan")
      .eq("owner_id", user.id)
      .single();

    const isPremium = wedding?.plan === "premium" || wedding?.plan === "lifetime";

    if (!isPremium) {
      return NextResponse.json(
        { error: "Push notifications are a Premium feature" },
        { status: 403 }
      );
    }

    const subscription = await request.json();

    // Validate subscription object
    if (!subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    // Save subscription
    const { error } = await supabase
      .from("profiles")
      .update({ push_subscription: subscription })
      .eq("id", user.id);

    if (error) {
      console.error("[api/notifications/push/subscribe] error:", error);
      return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/notifications/push/subscribe] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/notifications/push/subscribe
 * Remove push notification subscription
 */
export async function DELETE() {
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
      .update({ push_subscription: null })
      .eq("id", user.id);

    if (error) {
      console.error("[api/notifications/push/subscribe] delete error:", error);
      return NextResponse.json({ error: "Failed to remove subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/notifications/push/subscribe] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
