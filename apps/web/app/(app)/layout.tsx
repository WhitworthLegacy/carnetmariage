import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/app/Sidebar";
import { Topbar } from "@/components/app/Topbar";
import { SeedDefaults } from "@/components/app/SeedDefaults";
import { WeddingProvider } from "@/contexts/WeddingContext";
import { ToastProvider } from "@carnetmariage/ui";
import { GuidedTourWrapper } from "@/components/app/GuidedTourWrapper";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  // Fetch wedding and profile in parallel
  const [weddingRes, profileRes] = await Promise.all([
    supabase
      .from("weddings")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("profiles")
      .select("id, has_seen_tour")
      .eq("id", user.id)
      .single(),
  ]);

  const wedding = weddingRes.data;
  const profile = profileRes.data;

  // No wedding yet -> redirect to onboarding
  if (!wedding) redirect("/onboarding");

  return (
    <ToastProvider>
      <WeddingProvider wedding={wedding} user={user} profile={profile ?? undefined}>
        <SeedDefaults />
        <GuidedTourWrapper />
        <div className="flex h-screen bg-ivory">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar wedding={wedding} user={user} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </WeddingProvider>
    </ToastProvider>
  );
}
