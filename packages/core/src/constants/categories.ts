export const TASK_CATEGORIES = [
  "Général",
  "Traiteur",
  "Lieu",
  "Tenues",
  "Papeterie",
  "Décoration",
  "Invités",
  "Ambiance",
  "Administration",
  "Alliances",
  "Beauté",
  "Cérémonie",
  "Fleurs",
  "Lune de Miel",
  "Musique",
  "Photo/Vidéo",
  "Transport",
] as const;

export const VENDOR_CATEGORIES = [
  "DJ",
  "Photographe",
  "Vidéaste",
  "Traiteur",
  "Fleuriste",
  "Maquillage",
  "Coiffure",
  "Officiant",
  "Musique",
  "Photo/Vidéo",
  "Transport",
] as const;

export const GUEST_GROUPS = ["Famille", "Amis", "Collègues", "Voisins", "Autre"] as const;

export const WEDDING_STYLES = [
  "Champêtre",
  "Bohème",
  "Classique",
  "Moderne",
  "Romantique",
  "Minimaliste",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];
export type VendorCategory = (typeof VENDOR_CATEGORIES)[number];
export type GuestGroup = (typeof GUEST_GROUPS)[number];
export type WeddingStyle = (typeof WEDDING_STYLES)[number];
