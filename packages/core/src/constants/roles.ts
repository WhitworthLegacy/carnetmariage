export const USER_ROLES = {
  user: "Utilisateur",
  admin: "Administrateur",
  super_admin: "Super Admin",
} as const;

export const ADMIN_ROLES = ["admin", "super_admin"] as const;

// Simplified: only 2 plans now (free + premium)
// "lifetime" kept for backwards compatibility with existing users
export const PLANS = {
  free: "Gratuit",
  premium: "Premium",
  lifetime: "Premium", // Legacy alias
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
  lifetime: {
    tasks: Infinity,
    budget_lines: Infinity,
    vendors: Infinity,
    guests: Infinity,
    venues: Infinity,
  },
} as const;

// Helper to check if a plan has premium access
export const isPremiumPlan = (plan: string): boolean => {
  return ["premium", "lifetime"].includes(plan);
};

export type UserRole = keyof typeof USER_ROLES;
export type Plan = keyof typeof PLANS;
