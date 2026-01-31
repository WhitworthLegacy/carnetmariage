"use client";

import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with react-joyride
const GuidedTour = dynamic(
  () => import("./GuidedTour").then((mod) => mod.GuidedTour),
  { ssr: false }
);

export function GuidedTourWrapper() {
  return <GuidedTour />;
}
