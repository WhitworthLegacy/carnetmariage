export const TASK_STATUSES = {
  todo: "À faire",
  doing: "En cours",
  done: "Terminé",
} as const;

export const BUDGET_STATUSES = {
  planned: "Prévu",
  booked: "Réservé",
  paid: "Payé",
} as const;

export const VENDOR_STATUSES = {
  contact: "À contacter",
  quote: "Devis reçu",
  meeting: "RDV Pris",
  negotiating: "En négo",
  booked: "Signé",
  paid: "Soldé",
  refused: "Refusé",
} as const;

export const VENUE_STATUSES = {
  visit: "À visiter",
  option: "Acompte déposée",
  booked: "Réservé",
} as const;

export const GUEST_STATUSES = {
  pending: "En attente",
  confirmed: "Confirmé",
  declined: "Refusé",
  relaunch: "À relancer",
  maybe: "Peut-être",
} as const;

export type TaskStatus = keyof typeof TASK_STATUSES;
export type BudgetStatus = keyof typeof BUDGET_STATUSES;
export type VendorStatus = keyof typeof VENDOR_STATUSES;
export type VenueStatus = keyof typeof VENUE_STATUSES;
export type GuestStatus = keyof typeof GUEST_STATUSES;
