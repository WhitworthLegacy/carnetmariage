import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/apiResponse";
import { UpdateGuestSchema, makeError } from "@carnetmariage/core";
import { sendRSVPNotificationEmail, NotificationPreferences } from "@/lib/notifications";

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

  // Get current guest status before update
  const { data: currentGuest } = await auth.supabase
    .from("guests")
    .select("status, name")
    .eq("id", id)
    .eq("wedding_id", auth.wedding!.id)
    .single();

  const { data, error } = await auth.supabase
    .from("guests")
    .update(parsed.data)
    .eq("id", id)
    .eq("wedding_id", auth.wedding!.id)
    .select()
    .single();

  if (error) return jsonError(makeError("DATABASE_ERROR", error.message), 500);

  // Send RSVP notification if status changed and user is premium
  if (
    currentGuest &&
    parsed.data.status &&
    currentGuest.status !== parsed.data.status &&
    ["premium", "lifetime"].includes(auth.wedding?.plan || "")
  ) {
    // Get user profile for notification
    const { data: profile } = await auth.supabase
      .from("profiles")
      .select("email, full_name, notification_preferences")
      .eq("id", auth.user.id)
      .single();

    if (profile?.email) {
      const prefs = profile.notification_preferences as NotificationPreferences | null;
      if (!prefs || prefs.email_rsvp_updates) {
        // Send email notification (don't await to not block response)
        sendRSVPNotificationEmail({
          email: profile.email,
          userName: profile.full_name || "Utilisateur",
          guestName: data.name,
          response: parsed.data.status as "confirmed" | "declined" | "pending",
          guestCount: data.guest_count,
          dietaryRestrictions: data.dietary_restrictions,
        }).catch((err) => console.error("Failed to send RSVP notification:", err));
      }
    }
  }

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
