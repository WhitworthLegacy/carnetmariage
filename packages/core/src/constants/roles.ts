export const USER_ROLES = {
  user: "Utilisateur",
  admin: "Administrateur",
  super_admin: "Super Admin",
} as const;

export const ADMIN_ROLES = ["admin", "super_admin"] as const;

export const PLANS = {
  free: "Gratuit",
  premium: "Premium",
  ultimate: "Ultimate",
  lifetime: "Lifetime",
} as const;

export const PLAN_LIMITS = {
  free: { tasks: 30, budget_lines: 15, vendors: 10, guests: 50, venues: 3 },
  premium: {
    tasks: Infinity,
    budget_lines: Infinity,
    vendors: Infinity,
    guests: Infinity,
    venues: Infinity,
  },
  ultimate: {
    tasks: Infinity,
    budget_lines: Infinity,
    vendors: Infinity,
    guests: Infinity,
    venues: Infinity,
  },
  lifetime: {
    tasks: Infinity,
    budget_lines: Infinity,
    vendors: Infinity,
    guests: Infinity,
    venues: Infinity,
  },
} as const;

export type UserRole = keyof typeof USER_ROLES;
export type Plan = keyof typeof PLANS;
