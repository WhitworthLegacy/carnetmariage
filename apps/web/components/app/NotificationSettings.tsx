"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, Smartphone, Loader2 } from "lucide-react";
import { Button } from "@carnetmariage/ui";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useWedding } from "@/contexts/WeddingContext";

interface NotificationPreferences {
  email_task_reminders: boolean;
  email_rsvp_updates: boolean;
  email_budget_alerts: boolean;
  push_enabled: boolean;
}

export function NotificationSettings() {
  const { isPremium } = useWedding();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_task_reminders: true,
    email_rsvp_updates: true,
    email_budget_alerts: true,
    push_enabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isSupported: pushSupported,
    permission: pushPermission,
    isSubscribed: pushSubscribed,
    isLoading: pushLoading,
    subscribe: subscribePush,
    unsubscribe: unsubscribePush,
  } = usePushNotifications();

  // Fetch preferences on mount
  useEffect(() => {
    if (!isPremium) {
      setIsLoading(false);
      return;
    }

    fetch("/api/notifications/preferences")
      .then((res) => res.json())
      .then((data) => {
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch preferences:", err);
        setError("Impossible de charger les préférences");
      })
      .finally(() => setIsLoading(false));
  }, [isPremium]);

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrefs),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }
    } catch (err) {
      console.error("Failed to save preference:", err);
      setError("Erreur lors de la sauvegarde");
      // Revert
      setPreferences(preferences);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePushToggle = async () => {
    if (pushSubscribed) {
      await unsubscribePush();
    } else {
      await subscribePush();
    }
  };

  if (!isPremium) {
    return (
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-pink-100 rounded-xl">
            <Bell className="w-5 h-5 text-pink-main" />
          </div>
          <h3 className="font-semibold text-ink">Notifications Premium</h3>
        </div>
        <p className="text-sm text-muted mb-4">
          Reçois des rappels pour tes tâches à venir et des notifications quand tes invités
          répondent à l'invitation.
        </p>
        <a href="/tarifs">
          <Button variant="primary" size="sm">
            Débloquer pour 27€
          </Button>
        </a>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-pink-main" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pink-100 rounded-xl">
          <Bell className="w-5 h-5 text-pink-main" />
        </div>
        <div>
          <h3 className="font-semibold text-ink">Notifications</h3>
          <p className="text-sm text-muted">Gère tes préférences de notification</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Email Notifications */}
        <div className="pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-muted" />
            <span className="font-medium text-sm text-ink">Email</span>
          </div>

          <div className="space-y-3 pl-6">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-muted">Rappels de tâches</span>
              <input
                type="checkbox"
                checked={preferences.email_task_reminders}
                onChange={(e) => updatePreference("email_task_reminders", e.target.checked)}
                disabled={isSaving}
                className="w-5 h-5 rounded border-gray-300 text-pink-main focus:ring-pink-main cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-muted">Réponses RSVP</span>
              <input
                type="checkbox"
                checked={preferences.email_rsvp_updates}
                onChange={(e) => updatePreference("email_rsvp_updates", e.target.checked)}
                disabled={isSaving}
                className="w-5 h-5 rounded border-gray-300 text-pink-main focus:ring-pink-main cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-muted">Alertes budget</span>
              <input
                type="checkbox"
                checked={preferences.email_budget_alerts}
                onChange={(e) => updatePreference("email_budget_alerts", e.target.checked)}
                disabled={isSaving}
                className="w-5 h-5 rounded border-gray-300 text-pink-main focus:ring-pink-main cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4 text-muted" />
            <span className="font-medium text-sm text-ink">Notifications navigateur</span>
          </div>

          <div className="pl-6">
            {!pushSupported ? (
              <p className="text-sm text-muted">
                Les notifications push ne sont pas supportées par ton navigateur.
              </p>
            ) : pushPermission === "denied" ? (
              <p className="text-sm text-muted">
                Tu as bloqué les notifications. Active-les dans les paramètres de ton navigateur.
              </p>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">
                  {pushSubscribed ? "Notifications activées" : "Activer les notifications"}
                </span>
                <Button
                  variant={pushSubscribed ? "secondary" : "primary"}
                  size="sm"
                  onClick={handlePushToggle}
                  disabled={pushLoading}
                >
                  {pushLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : pushSubscribed ? (
                    "Désactiver"
                  ) : (
                    "Activer"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isSaving && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="w-4 h-4 animate-spin" />
          Sauvegarde...
        </div>
      )}
    </div>
  );
}
