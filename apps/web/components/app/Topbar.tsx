"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu, Heart } from "lucide-react";
import { Avatar, Badge } from "@carnetmariage/ui";
import { daysLeft } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useState, useCallback } from "react";
import { MobileNav } from "./MobileNav";

interface TopbarProps {
  wedding: {
    partner1_name: string;
    partner2_name: string;
    wedding_date: string | null;
  };
  user: User;
}


export function Topbar({ wedding, user }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const days = daysLeft(wedding.wedding_date);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/connexion");
  };

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <>
      <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-4 lg:px-6 shrink-0">
        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ivory transition-colors lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-full bg-pink-main flex items-center justify-center">
              <Heart size={14} className="text-white fill-white" />
            </div>
          </div>

        </div>

        {/* Right: countdown + avatar + logout */}
        <div className="flex items-center gap-3">
          {days !== null && days >= 0 && (
            <Badge variant="pink" className="font-semibold">
              <Heart size={12} className="mr-1 fill-pink-dark" />
              J-{days}
            </Badge>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <Avatar
              name={user.user_metadata?.full_name || user.email || ""}
              size="sm"
            />
            <span className="text-sm font-medium text-ink max-w-[120px] truncate">
              {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ivory transition-colors"
            aria-label="Se deconnecter"
            title="Se deconnecter"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={closeMobileNav} />
    </>
  );
}
