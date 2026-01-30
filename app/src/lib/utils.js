import { format, differenceInDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const formatPrice = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const daysLeft = (targetDateStr) => {
  if (!targetDateStr) return 0;
  // On utilise parseISO pour être sûr que la date est bien comprise
  const target = parseISO(targetDateStr);
  const today = new Date();
  return differenceInDays(target, today);
};

export const prettyDate = (dateStr) => {
  if (!dateStr) return "Date inconnue";
  try {
    return format(parseISO(dateStr), "dd MMMM yyyy", { locale: fr });
  } catch (error) {
    // J'ai renommé 'e' en 'error' et je l'utilise pas, c'est pas grave ici
    return dateStr;
  }
};
