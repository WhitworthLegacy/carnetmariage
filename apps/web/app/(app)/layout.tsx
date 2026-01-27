import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/app/Sidebar";
import { Topbar } from "@/components/app/Topbar";
import { WeddingProvider } from "@/contexts/WeddingContext";
import { ToastProvider } from "@carnetmariage/ui";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // No wedding yet -> redirect to onboarding
  if (!wedding) redirect("/onboarding");

  return (
    <ToastProvider>
      <WeddingProvider wedding={wedding} user={user}>
        <div className="flex h-screen bg-ivory">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar wedding={wedding} user={user} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </WeddingProvider>
    </ToastProvider>
  );
}
