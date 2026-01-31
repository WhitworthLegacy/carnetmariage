"use client";

import { useEffect, useRef } from "react";

/**
 * Client component that seeds default data if needed
 * Runs once per session, but always checks for new data types (venues, vendors)
 */
export function SeedDefaults() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Check version - bump this when adding new seed categories
    const SEED_VERSION = "3"; // v3 = venues with website/type columns
    const seededVersion = sessionStorage.getItem("carnet_seeded_version");

    // Skip if already seeded with current version
    if (seededVersion === SEED_VERSION) return;

    // Call the seed endpoint
    fetch("/api/seed-defaults", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        const anythingSeeded = data.tasksSeeded > 0 || data.budgetSeeded > 0 || data.vendorsSeeded > 0 || data.venuesSeeded > 0;

        // Mark as seeded with version
        sessionStorage.setItem("carnet_seeded_version", SEED_VERSION);

        if (anythingSeeded) {
          // Reload to show new data
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error("[SeedDefaults] error:", err);
      });
  }, []);

  return null;
}
