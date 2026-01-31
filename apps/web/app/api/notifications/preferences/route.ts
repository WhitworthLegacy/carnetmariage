import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_NOTIFICATION_PREFERENCES, NotificationPreferences } from "@/lib/notifications";

/**
 * GET /api/notifications/preferences
 * Get notification preferences for the current user
 */
export async function GET() {
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
        { error: "Notifications are a Premium feature" },
        { status: 403 }
      );
    }

    // Get preferences
    const { data: profile } = await supabase
      .from("profiles")
      .select("notification_preferences")
      .eq("id", user.id)
      .single();

    const preferences = (profile?.notification_preferences as NotificationPreferences) || DEFAULT_NOTIFICATION_PREFERENCES;

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("[api/notifications/preferences] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/notifications/preferences
 * Update notification preferences
 */
export async function PUT(request: NextRequest) {
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
        { error: "Notifications are a Premium feature" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const preferences: NotificationPreferences = {
      email_task_reminders: body.email_task_reminders ?? true,
      email_rsvp_updates: body.email_rsvp_updates ?? true,
      email_budget_alerts: body.email_budget_alerts ?? true,
      push_enabled: body.push_enabled ?? true,
    };

    const { error } = await supabase
      .from("profiles")
      .update({ notification_preferences: preferences })
      .eq("id", user.id);

    if (error) {
      console.error("[api/notifications/preferences] update error:", error);
      return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
    }

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error("[api/notifications/preferences] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
