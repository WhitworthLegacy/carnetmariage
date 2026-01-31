"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@carnetmariage/ui";
import { createPortal } from "react-dom";

interface TourStep {
  target: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "[data-tour='sidebar']",
    content: "Voici ton menu principal pour naviguer entre les différentes sections de ton carnet de mariage.",
    placement: "right",
  },
  {
    target: "[data-tour='stats']",
    content: "Tes statistiques en un coup d'œil : tâches, budget, invités et prestataires.",
    placement: "bottom",
  },
  {
    target: "[data-tour='upcoming']",
    content: "Tes prochaines échéances pour ne rien oublier.",
    placement: "top",
  },
  {
    target: "[data-tour='nav-taches']",
    content: "Ta checklist de mariage — coche au fur et à mesure tes tâches accomplies.",
    placement: "right",
  },
  {
    target: "[data-tour='nav-budget']",
    content: "Suis tes dépenses et reste dans ton budget. Tu verras une répartition par catégorie.",
    placement: "right",
  },
  {
    target: "[data-tour='nav-invites']",
    content: "Gère ta liste d'invités et les réponses RSVP.",
    placement: "right",
  },
  {
    target: "[data-tour='nav-lieux']",
    content: "Compare les salles et lieux de réception pour trouver le lieu parfait.",
    placement: "right",
  },
  {
    target: "[data-tour='nav-timeline']",
    content: "Planifie le déroulé du jour J minute par minute. (Disponible en Premium)",
    placement: "right",
  },
];

interface TooltipPosition {
  top: number;
  left: number;
  arrowPosition: "top" | "bottom" | "left" | "right";
}

function calculatePosition(
  targetRect: DOMRect,
  placement: TourStep["placement"] = "bottom"
): TooltipPosition {
  const tooltipWidth = 320;
  const tooltipHeight = 150;
  const offset = 12;

  let top = 0;
  let left = 0;
  let arrowPosition: "top" | "bottom" | "left" | "right" = "top";

  switch (placement) {
    case "top":
      top = targetRect.top - tooltipHeight - offset;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      arrowPosition = "bottom";
      break;
    case "bottom":
      top = targetRect.bottom + offset;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      arrowPosition = "top";
      break;
    case "left":
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      left = targetRect.left - tooltipWidth - offset;
      arrowPosition = "right";
      break;
    case "right":
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      left = targetRect.right + offset;
      arrowPosition = "left";
      break;
  }

  // Keep tooltip within viewport
  left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
  top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));

  return { top, left, arrowPosition };
}

interface GuidedTourProps {
  forceStart?: boolean;
}

export function GuidedTour({ forceStart = false }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const step = TOUR_STEPS[currentStep];

  const findTarget = useCallback(() => {
    if (!step) return null;
    const element = document.querySelector(step.target);
    return element;
  }, [step]);

  const updateTargetRect = useCallback(() => {
    const element = findTarget();
    if (element) {
      setTargetRect(element.getBoundingClientRect());
    }
  }, [findTarget]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("carnetmariage-tour-completed");
    const shouldShowTour = sessionStorage.getItem("show-guided-tour");

    if (forceStart || shouldShowTour === "true") {
      setTimeout(() => {
        setIsRunning(true);
        setCurrentStep(0);
      }, 500);
      sessionStorage.removeItem("show-guided-tour");
    } else if (!hasSeenTour && pathname === "/dashboard") {
      setTimeout(() => {
        setIsRunning(true);
        setCurrentStep(0);
      }, 1000);
    }
  }, [forceStart, pathname]);

  useEffect(() => {
    if (isRunning) {
      updateTargetRect();

      const handleResize = () => updateTargetRect();
      const handleScroll = () => updateTargetRect();

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isRunning, currentStep, updateTargetRect]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setIsRunning(false);
    localStorage.setItem("carnetmariage-tour-completed", "true");
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!mounted || !isRunning || !step || !targetRect) return null;

  const position = calculatePosition(targetRect, step.placement);
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998]"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          clipPath: `polygon(
            0% 0%,
            0% 100%,
            ${targetRect.left - 8}px 100%,
            ${targetRect.left - 8}px ${targetRect.top - 8}px,
            ${targetRect.right + 8}px ${targetRect.top - 8}px,
            ${targetRect.right + 8}px ${targetRect.bottom + 8}px,
            ${targetRect.left - 8}px ${targetRect.bottom + 8}px,
            ${targetRect.left - 8}px 100%,
            100% 100%,
            100% 0%
          )`,
        }}
        onClick={handleClose}
      />

      {/* Spotlight border */}
      <div
        className="fixed z-[9999] pointer-events-none rounded-xl border-2 border-pink-main shadow-lg"
        style={{
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[10000] w-80 bg-white rounded-2xl shadow-xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {/* Arrow */}
        <div
          className={`absolute w-3 h-3 bg-white rotate-45 ${
            position.arrowPosition === "top"
              ? "-top-1.5 left-1/2 -translate-x-1/2"
              : position.arrowPosition === "bottom"
                ? "-bottom-1.5 left-1/2 -translate-x-1/2"
                : position.arrowPosition === "left"
                  ? "-left-1.5 top-1/2 -translate-y-1/2"
                  : "-right-1.5 top-1/2 -translate-y-1/2"
          }`}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 text-muted hover:text-ink transition-colors rounded-lg hover:bg-ivory"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="pr-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-pink-main" />
            <span className="text-xs font-medium text-pink-dark">
              Étape {currentStep + 1} sur {TOUR_STEPS.length}
            </span>
          </div>
          <p className="text-sm text-ink leading-relaxed">{step.content}</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4 mb-4">
          {TOUR_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentStep ? "bg-pink-main" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-xs text-muted hover:text-ink transition-colors"
          >
            Passer le tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="secondary" size="sm" onClick={handlePrev}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" onClick={handleNext}>
              {isLastStep ? (
                "C'est parti !"
              ) : (
                <>
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

// Hook to trigger tour from settings
export function useTriggerTour() {
  const router = useRouter();

  const triggerTour = () => {
    sessionStorage.setItem("show-guided-tour", "true");
    router.push("/dashboard");
  };

  return { triggerTour };
}
