"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Heart,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Vue d'ensemble",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Utilisateurs",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Mariages",
    href: "/dashboard/weddings",
    icon: Heart,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Parametres",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-brand-border bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-brand-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-main">
          <span className="text-sm font-bold text-white">CM</span>
        </div>
        <span className="text-lg font-bold text-ink">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-purple-light text-purple-dark"
                  : "text-muted hover:bg-gray-50 hover:text-ink"
              }`}
            >
              <Icon
                size={20}
                className={active ? "text-purple-main" : "text-muted-light"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-brand-border px-6 py-4">
        <p className="text-xs text-muted">CarnetMariage Admin v0.1</p>
      </div>
    </aside>
  );
}
