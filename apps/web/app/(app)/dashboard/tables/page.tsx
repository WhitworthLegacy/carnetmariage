"use client";

import { PremiumGate } from "@/components/app/PremiumGate";

export default function TablesPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl sm:text-3xl text-ink">Plan de table</h1>

      <PremiumGate requiredPlan="ultimate">
        <div className="space-y-6">
          <p className="text-muted">
            Organisez vos invités sur un plan de table interactif en glisser-déposer.
          </p>

          {/* Placeholder table planner */}
          <div className="relative bg-ivory rounded-2xl p-8 min-h-[500px]">
            {/* Mock tables */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((tableNum) => (
                <div key={tableNum} className="flex flex-col items-center">
                  {/* Round table */}
                  <div className="relative w-28 h-28">
                    <div className="absolute inset-3 rounded-full bg-white shadow-card border border-brand-border/50 flex items-center justify-center">
                      <span className="text-sm font-semibold text-ink">Table {tableNum}</span>
                    </div>
                    {/* Seats around the table */}
                    {[0, 60, 120, 180, 240, 300].map((deg) => (
                      <div
                        key={deg}
                        className="absolute w-5 h-5 rounded-full bg-purple-light border-2 border-white shadow-sm"
                        style={{
                          top: `${50 - 46 * Math.cos((deg * Math.PI) / 180)}%`,
                          left: `${50 + 46 * Math.sin((deg * Math.PI) / 180)}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted mt-2">6 places</span>
                </div>
              ))}
            </div>

            {/* Head table */}
            <div className="mt-10 flex flex-col items-center">
              <div className="w-64 h-16 rounded-2xl bg-white shadow-card border border-brand-border/50 flex items-center justify-center">
                <span className="text-sm font-semibold text-ink">Table d&apos;honneur</span>
              </div>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full bg-pink-light border-2 border-white shadow-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PremiumGate>
    </div>
  );
}
