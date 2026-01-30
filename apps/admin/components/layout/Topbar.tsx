"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Topbar() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "sb-access-token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "sb-refresh-token=; path=/; max-age=0; SameSite=Lax";
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-brand-border bg-white px-8">
      <h2 className="text-lg font-semibold text-ink">CarnetMariage Admin</h2>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-50 hover:text-ink"
      >
        <LogOut size={16} />
        Deconnexion
      </button>
    </header>
  );
}
