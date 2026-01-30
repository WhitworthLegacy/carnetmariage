"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
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
  X,
  Heart,
} from "lucide-react";
import { Badge } from "@carnetmariage/ui";
import { useWedding } from "@/contexts/WeddingContext";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  premiumOnly?: boolean;
}

const allNav: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tâches", href: "/dashboard/taches", icon: CheckSquare },
  { label: "Budget", href: "/dashboard/budget", icon: Wallet },
  { label: "Prestataires", href: "/dashboard/prestataires", icon: Star },
  { label: "Lieux", href: "/dashboard/lieux", icon: MapPin },
  { label: "Invités", href: "/dashboard/invites", icon: Users },
  { label: "Timeline", href: "/dashboard/timeline", icon: Calendar, premiumOnly: true },
  { label: "Plan de table", href: "/dashboard/tables", icon: Grid3X3, premiumOnly: true },
  { label: "Paramètres", href: "/dashboard/parametres", icon: Settings },
];

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { isPremium } = useWedding();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-brand-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-pink-main flex items-center justify-center">
              <Heart size={18} className="text-white fill-white" />
            </div>
            <span className="font-serif text-lg font-bold text-ink">CarnetMariage</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ivory transition-colors"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {allNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const locked = item.premiumOnly && !isPremium;

            return (
              <Link
                key={item.href}
                href={locked ? "/dashboard/parametres?upgrade=true" : item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-pink-light text-pink-dark"
                    : "text-muted hover:text-ink hover:bg-ivory"
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
          })}
        </nav>
      </div>
    </>
  );
}
