"use client";

import { CalendarRange } from "lucide-react";
import { PremiumGate } from "@/components/app/PremiumGate";

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl sm:text-3xl text-ink">Timeline</h1>

      <PremiumGate requiredPlan="premium">
        <div className="space-y-6">
          <p className="text-muted">Visualisez toutes vos etapes cles mois par mois.</p>

          {/* Placeholder timeline content */}
          <div className="relative pl-8 space-y-8">
            {/* Timeline line */}
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-pink-light" />

            {[
              {
                month: "12 mois avant",
                items: ["Definir le budget", "Choisir la date", "Lister les invites"],
              },
              {
                month: "9 mois avant",
                items: ["Reserver le lieu", "Choisir le traiteur", "Booker le photographe"],
              },
              {
                month: "6 mois avant",
                items: ["Commander les tenues", "Envoyer les save-the-date", "Choisir le DJ"],
              },
              {
                month: "3 mois avant",
                items: [
                  "Envoyer les invitations",
                  "Organiser l'enterrement de vie",
                  "Finaliser le menu",
                ],
              },
              {
                month: "1 mois avant",
                items: ["Confirmer les prestataires", "Essayage final", "Plan de table"],
              },
            ].map((section) => (
              <div key={section.month} className="relative">
                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-pink-main flex items-center justify-center">
                  <CalendarRange className="w-3 h-3 text-white" />
                </div>
                <h3 className="font-serif text-lg text-ink mb-2">{section.month}</h3>
                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li key={item} className="text-sm text-muted flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-light flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </PremiumGate>
    </div>
  );
}
