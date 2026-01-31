"use client";

import { useEffect, useRef } from "react";

/**
 * Client component that seeds default data if needed
 * Only runs once per session
 */
export function SeedDefaults() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Check if we already seeded in this session
    const seeded = sessionStorage.getItem("carnet_seeded");
    if (seeded) return;

    // Call the seed endpoint
    fetch("/api/seed-defaults", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.tasksSeeded > 0 || data.budgetSeeded > 0 || data.vendorsSeeded > 0 || data.venuesSeeded > 0) {
          // Mark as seeded
          sessionStorage.setItem("carnet_seeded", "true");
          // Reload to show new data
          window.location.reload();
        } else {
          // Already had data, mark as seeded
          sessionStorage.setItem("carnet_seeded", "true");
        }
      })
      .catch((err) => {
        console.error("[SeedDefaults] error:", err);
      });
  }, []);

  return null;
}
