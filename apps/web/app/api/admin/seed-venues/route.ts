import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_VENUES } from "@carnetmariage/core";

/**
 * POST /api/admin/seed-venues
 * Seeds default venues for all weddings that have 0 venues
 * Admin-only endpoint
 */
export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you can add your admin check here)
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    const adminEmails = ["yaqub@whitworth.be", "admin@carnetmariage.app"];
    if (!profile || !adminEmails.includes(profile.email || "")) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    // Get all weddings
    const { data: weddings, error: weddingsError } = await supabase
      .from("weddings")
      .select("id");

    if (weddingsError || !weddings) {
      return NextResponse.json({ error: "Failed to fetch weddings" }, { status: 500 });
    }

    let totalSeeded = 0;
    const results: { weddingId: string; venuesSeeded: number }[] = [];

    for (const wedding of weddings) {
      // Check if venues exist for this wedding
      const { count: venueCount } = await supabase
        .from("venues")
        .select("*", { count: "exact", head: true })
        .eq("wedding_id", wedding.id);

      if (venueCount === 0) {
        // Seed venues
        const venuesToInsert = DEFAULT_VENUES.map((venue) => ({
          wedding_id: wedding.id,
          name: venue.name,
          location: venue.location,
          notes: `Type: ${venue.type}${venue.website ? ` | Site: ${venue.website}` : ""}${venue.contact_phone ? ` | Tél: ${venue.contact_phone}` : ""}`,
          status: "visit" as const,
          price: 0,
          capacity: 0,
        }));

        const { error: venuesError } = await supabase.from("venues").insert(venuesToInsert);
        if (!venuesError) {
          totalSeeded += venuesToInsert.length;
          results.push({ weddingId: wedding.id, venuesSeeded: venuesToInsert.length });
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalSeeded,
      weddingsUpdated: results.length,
      details: results,
    });
  } catch (error) {
    console.error("[api/admin/seed-venues] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
