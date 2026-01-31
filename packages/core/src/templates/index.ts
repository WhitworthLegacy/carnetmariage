/**
 * Default templates for new weddings
 * These get seeded after onboarding
 */

export interface TaskTemplate {
  title: string;
  category: string;
  priority?: "high" | "medium" | "low";
  months_before?: number; // Months before wedding date
}

export interface BudgetTemplate {
  label: string;
  category: string;
  estimated_percentage?: number; // % of total budget
}

// Default tasks organized by timeline (months before wedding)
export const DEFAULT_TASKS: TaskTemplate[] = [
  // 12+ months before
  {
    title: "Définir le budget global",
    category: "Administration",
    priority: "high",
    months_before: 12,
  },
  { title: "Choisir la date du mariage", category: "Général", priority: "high", months_before: 12 },
  {
    title: "Créer la liste d'invités préliminaire",
    category: "Invités",
    priority: "high",
    months_before: 12,
  },
  {
    title: "Visiter des lieux de réception",
    category: "Lieu",
    priority: "high",
    months_before: 12,
  },
  { title: "Réserver le lieu de réception", category: "Lieu", priority: "high", months_before: 11 },

  // 9-11 months before
  { title: "Choisir le traiteur", category: "Traiteur", priority: "high", months_before: 10 },
  {
    title: "Réserver le photographe",
    category: "Photo/Vidéo",
    priority: "high",
    months_before: 10,
  },
  {
    title: "Réserver le DJ ou groupe de musique",
    category: "Musique",
    priority: "medium",
    months_before: 10,
  },
  {
    title: "Choisir le thème et les couleurs",
    category: "Décoration",
    priority: "medium",
    months_before: 9,
  },
  {
    title: "Envoyer les save-the-date",
    category: "Papeterie",
    priority: "medium",
    months_before: 9,
  },

  // 6-8 months before
  { title: "Commander la robe de mariée", category: "Tenues", priority: "high", months_before: 8 },
  { title: "Choisir le costume du marié", category: "Tenues", priority: "high", months_before: 7 },
  { title: "Réserver le fleuriste", category: "Fleurs", priority: "medium", months_before: 7 },
  { title: "Réserver le vidéaste", category: "Photo/Vidéo", priority: "medium", months_before: 7 },
  {
    title: "Organiser l'enterrement de vie de garçon/fille",
    category: "Général",
    priority: "low",
    months_before: 6,
  },
  {
    title: "Commander les faire-part",
    category: "Papeterie",
    priority: "medium",
    months_before: 6,
  },

  // 4-5 months before
  { title: "Envoyer les faire-part", category: "Papeterie", priority: "high", months_before: 5 },
  {
    title: "Choisir le gâteau de mariage",
    category: "Traiteur",
    priority: "medium",
    months_before: 5,
  },
  {
    title: "Réserver l'officiant de cérémonie",
    category: "Cérémonie",
    priority: "high",
    months_before: 5,
  },
  { title: "Choisir les alliances", category: "Alliances", priority: "high", months_before: 4 },
  {
    title: "Organiser le transport des invités",
    category: "Transport",
    priority: "medium",
    months_before: 4,
  },
  {
    title: "Réserver l'hébergement pour les invités",
    category: "Invités",
    priority: "medium",
    months_before: 4,
  },

  // 2-3 months before
  { title: "Premier essayage de la robe", category: "Tenues", priority: "high", months_before: 3 },
  {
    title: "Finaliser le menu avec le traiteur",
    category: "Traiteur",
    priority: "high",
    months_before: 3,
  },
  {
    title: "Confirmer tous les prestataires",
    category: "Administration",
    priority: "high",
    months_before: 3,
  },
  { title: "Créer le plan de table", category: "Invités", priority: "medium", months_before: 2 },
  {
    title: "Relancer les invités sans réponse",
    category: "Invités",
    priority: "high",
    months_before: 2,
  },
  {
    title: "Essai coiffure et maquillage",
    category: "Beauté",
    priority: "medium",
    months_before: 2,
  },

  // 1 month before
  { title: "Dernier essayage de la robe", category: "Tenues", priority: "high", months_before: 1 },
  { title: "Récupérer les alliances", category: "Alliances", priority: "high", months_before: 1 },
  {
    title: "Confirmer le nombre final d'invités",
    category: "Invités",
    priority: "high",
    months_before: 1,
  },
  {
    title: "Préparer les discours et les vœux",
    category: "Cérémonie",
    priority: "medium",
    months_before: 1,
  },
  {
    title: "Organiser la répétition de la cérémonie",
    category: "Cérémonie",
    priority: "medium",
    months_before: 1,
  },

  // Last week
  {
    title: "Confirmer la timeline avec les prestataires",
    category: "Administration",
    priority: "high",
    months_before: 0,
  },
  {
    title: "Préparer les enveloppes pour les prestataires",
    category: "Administration",
    priority: "medium",
    months_before: 0,
  },
  {
    title: "Préparer la valise pour la lune de miel",
    category: "Lune de Miel",
    priority: "low",
    months_before: 0,
  },
];

// Default budget categories with typical percentages
export const DEFAULT_BUDGET_LINES: BudgetTemplate[] = [
  { label: "Lieu de réception", category: "Lieu", estimated_percentage: 30 },
  { label: "Traiteur & boissons", category: "Traiteur", estimated_percentage: 25 },
  { label: "Photographe", category: "Photo/Vidéo", estimated_percentage: 8 },
  { label: "Vidéaste", category: "Photo/Vidéo", estimated_percentage: 5 },
  { label: "DJ / Musique", category: "Ambiance", estimated_percentage: 5 },
  { label: "Fleurs & décoration", category: "Décoration", estimated_percentage: 5 },
  { label: "Robe de mariée", category: "Tenues", estimated_percentage: 5 },
  { label: "Costume marié", category: "Tenues", estimated_percentage: 2 },
  { label: "Alliances", category: "Alliances", estimated_percentage: 3 },
  { label: "Faire-part & papeterie", category: "Papeterie", estimated_percentage: 2 },
  { label: "Coiffure & maquillage", category: "Beauté", estimated_percentage: 2 },
  { label: "Gâteau de mariage", category: "Traiteur", estimated_percentage: 2 },
  { label: "Transport", category: "Transport", estimated_percentage: 2 },
  { label: "Hébergement invités", category: "Invités", estimated_percentage: 2 },
  { label: "Imprévus", category: "Général", estimated_percentage: 2 },
];

// Default vendors to track (just categories, not actual vendors)
export const DEFAULT_VENDOR_CATEGORIES = [
  "Lieu de réception",
  "Traiteur",
  "Photographe",
  "DJ",
  "Fleuriste",
  "Coiffure",
  "Maquillage",
  "Vidéaste",
  "Officiant",
];

export interface VendorTemplate {
  name: string;
  category: string;
  website?: string;
  notes?: string;
  isSuggested?: boolean; // Suggested partner
}

// Suggested vendors / partners
export const DEFAULT_VENDORS: VendorTemplate[] = [
  {
    name: "MirrorEffect",
    category: "Animation",
    website: "https://mirroreffect.be",
    notes: "Miroir photobooth interactif pour animer votre mariage. Code promo CARNETMARIAGE pour -50€ sur votre réservation !",
    isSuggested: true,
  },
];

export interface VenueTemplate {
  name: string;
  location: string;
  type: string;
  website?: string;
  contact_phone?: string;
}

// Suggested venues from Belgium/France
export const DEFAULT_VENUES: VenueTemplate[] = [
  { name: "The Villa", location: "Dilbeek, Belgium", type: "Salle", website: "https://www.villa-event.be/" },
  { name: "Alta Ripa", location: "Avelgem, Belgium", type: "Salle", website: "https://www.alta-ripa.be/" },
  { name: "La Ferme de Bertinchamps", location: "Braine-l'Alleud, Belgium", type: "Salle", website: "https://www.lafermebertinchamps.be/" },
  { name: "La Rotonde", location: "Woluwe-Saint-Lambert, Belgium", type: "Restaurant", website: "https://www.la-rotonde-by-dl.be/" },
  { name: "Les Salons du Forum", location: "Manage, Belgium", type: "Salle", website: "http://leforum-manage.be/" },
  { name: "Château de la Hulpe", location: "La Hulpe, Belgium", type: "Château", website: "https://www.chateaudelahulpe.be/" },
  { name: "Domaine du Château de Modave", location: "Modave, Belgium", type: "Château", website: "http://www.modave-castle.be/" },
  { name: "Domaine de l'Abbaye", location: "Raismes, France", type: "Domaine", website: "http://www.domainedelabbaye.net/" },
  { name: "Abbaye Notre-Dame de Bonne-Espérance", location: "Estinnes, Belgium", type: "Domaine", website: "http://www.abbaye-bonne-esperance.be/" },
  { name: "Traiteur Maréchal", location: "Dalhem, Belgium", type: "Salle", contact_phone: "+32 43 74 29 81" },
  { name: "L'Orangerie Villers-le-Bouillet", location: "Villers-le-Bouillet, Belgium", type: "Restaurant", website: "https://lorangerievillerslebouillet.be/" },
  { name: "Le Château de Bac Saint-Maur", location: "Sailly-sur-la-Lys, France", type: "Château" },
  { name: "Waerboom", location: "Dilbeek, Belgium", type: "Hôtel", website: "http://www.waerboom.com/" },
  { name: "Hôtel Skindles", location: "Poperinge, Belgium", type: "Hôtel", website: "http://www.skindlespoperinge.com/" },
  { name: "Elinoa", location: "Machelen, Belgium", type: "Hôtel", website: "https://hotel.center.be.ivof.com/elinoa/" },
  { name: "Le Domaine de la Cendrée", location: "Harnes, France", type: "Domaine", website: "http://ledomaine.fr/" },
  { name: "Le Pont Romain", location: "Erquelinnes, Belgium", type: "Salle", website: "https://lepontromain.be/" },
  { name: "La Salle des Marronniers", location: "Eecke, France", type: "Salle", contact_phone: "+33 6 32 49 80 95" },
  { name: "Domaine de Franc-Waret", location: "Fernelmont, Belgium", type: "Domaine", website: "http://www.franc-waret.com/" },
  { name: "Palais d'Afrique", location: "Tervuren, Belgium", type: "Salle", website: "http://www.afrikapaleis.be/" },
];

/**
 * Calculate task due date based on wedding date and months_before
 */
export function calculateDueDate(weddingDate: string | null, monthsBefore: number): string | null {
  if (!weddingDate) return null;
  const date = new Date(weddingDate);
  date.setMonth(date.getMonth() - monthsBefore);
  // If the calculated date is in the past, set it to today + 7 days
  const now = new Date();
  if (date < now) {
    now.setDate(now.getDate() + 7);
    return now.toISOString().split("T")[0];
  }
  return date.toISOString().split("T")[0];
}

/**
 * Calculate estimated amount based on total budget and percentage
 */
export function calculateEstimatedAmount(totalBudget: number, percentage: number): number {
  return Math.round((totalBudget * percentage) / 100);
}
