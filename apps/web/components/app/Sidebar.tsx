"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  Star,
  MapPin,
  Users,
  Calendar,
  Grid3X3,
  Settings,
  Heart,
} from "lucide-react";
import { Badge } from "@carnetmariage/ui";
import { useWedding } from "@/contexts/WeddingContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  premiumOnly?: boolean;
}

const mainNav: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tâches", href: "/dashboard/taches", icon: CheckSquare },
  { label: "Budget", href: "/dashboard/budget", icon: Wallet },
  { label: "Prestataires", href: "/dashboard/prestataires", icon: Star },
  { label: "Lieux", href: "/dashboard/lieux", icon: MapPin },
  { label: "Invités", href: "/dashboard/invites", icon: Users },
];

const premiumNav: NavItem[] = [
  { label: "Timeline", href: "/dashboard/timeline", icon: Calendar, premiumOnly: true },
  { label: "Plan de table", href: "/dashboard/tables", icon: Grid3X3, premiumOnly: true },
];

const bottomNav: NavItem[] = [
  { label: "Paramètres", href: "/dashboard/parametres", icon: Settings },
];

function NavLink({
  item,
  isActive,
  isPremium,
}: {
  item: NavItem;
  isActive: boolean;
  isPremium: boolean;
}) {
  const Icon = item.icon;
  const locked = item.premiumOnly && !isPremium;

  return (
    <Link
      href={locked ? "/dashboard/parametres?upgrade=true" : item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isActive ? "bg-pink-light text-pink-dark" : "text-muted hover:text-ink hover:bg-ivory"
      }`}
    >
      <Icon size={20} />
      <span className="flex-1">{item.label}</span>
      {locked && (
        <Badge variant="purple" className="text-[10px] px-1.5 py-0">
          Premium
        </Badge>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isPremium } = useWedding();

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-brand-border">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-brand-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-pink-main flex items-center justify-center">
            <Heart size={18} className="text-white fill-white" />
          </div>
          <span className="font-serif text-lg font-bold text-ink">CarnetMariage</span>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            isPremium={isPremium}
          />
        ))}

        {/* Separator */}
        <div className="my-3 border-t border-brand-border" />

        {premiumNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            isPremium={isPremium}
          />
        ))}

        {/* Separator */}
        <div className="my-3 border-t border-brand-border" />

        {bottomNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            isPremium={isPremium}
          />
        ))}
      </nav>

      {/* Footer hint */}
      {!isPremium && (
        <div className="p-4 m-3 mb-4 bg-purple-light/50 rounded-xl">
          <p className="text-xs text-purple-dark font-medium mb-1">Passe en Premium</p>
          <p className="text-xs text-muted leading-relaxed">
            Débloque le plan de table, la timeline et plus encore.
          </p>
          <Link
            href="/dashboard/parametres?upgrade=true"
            className="mt-2 inline-block text-xs font-semibold text-purple-dark hover:underline"
          >
            Voir les offres
          </Link>
        </div>
      )}
    </aside>
  );
}
