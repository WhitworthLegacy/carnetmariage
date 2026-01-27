import type { Metadata } from "next";
import { Libre_Baskerville, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const serif = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CarnetMariage — Organise ton mariage en toute sérénité",
    template: "%s | CarnetMariage",
  },
  description:
    "Le carnet de mariage digital pour organiser ton mariage sans stress. Budget, invités, prestataires, planning — tout au même endroit.",
  keywords: ["mariage", "organisation mariage", "planning mariage", "budget mariage", "liste invités"],
  metadataBase: new URL("https://carnetmariage.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "CarnetMariage",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
