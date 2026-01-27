import { format, differenceInDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function daysLeft(dateString: string | null): number | null {
  if (!dateString) return null;
  return differenceInDays(parseISO(dateString), new Date());
}

export function prettyDate(dateString: string | null): string {
  if (!dateString) return "";
  return format(parseISO(dateString), "d MMMM yyyy", { locale: fr });
}

export function progressPercent(done: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}
