import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, wedding, plan } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use admin client for auth operations (bypasses RLS)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // 1. Create user via admin API
    const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (createError) {
      if (createError.message.includes("already") || createError.message.includes("exists")) {
        return NextResponse.json({ error: "email_exists" }, { status: 409 });
      }
      console.error("[api/onboarding] create user error:", createError);
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    const userId = userData.user.id;

    // 2. Create wedding via service client (bypasses RLS)
    const supabase = await createServiceClient();
    const { data: weddingData, error: weddingError } = await supabase.from("weddings").insert({
      owner_id: userId,
      partner1_name: wedding.partner1_name?.trim() || "",
      partner2_name: wedding.partner2_name?.trim() || "",
      wedding_date: wedding.wedding_date || null,
      total_budget: wedding.total_budget || 0,
      plan: "free",
      settings: wedding.settings || {},
    }).select("id").single();

    if (weddingError) {
      console.error("[api/onboarding] wedding insert error:", weddingError);
      return NextResponse.json({ error: weddingError.message }, { status: 500 });
    }

    return NextResponse.json({
      userId,
      weddingId: weddingData.id,
    });
  } catch (error) {
    console.error("[api/onboarding] unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
