import { resend, FROM_EMAIL } from "./resend";
import TaskReminderEmail from "@/emails/TaskReminderEmail";
import GuestRSVPEmail from "@/emails/GuestRSVPEmail";

export interface NotificationPreferences {
  email_task_reminders: boolean;
  email_rsvp_updates: boolean;
  email_budget_alerts: boolean;
  push_enabled: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email_task_reminders: true,
  email_rsvp_updates: true,
  email_budget_alerts: true,
  push_enabled: true,
};

interface SendTaskReminderParams {
  email: string;
  userName: string;
  taskTitle: string;
  dueDate: string;
  daysLeft: number;
}

export async function sendTaskReminderEmail(params: SendTaskReminderParams) {
  if (!resend) {
    console.log("📧 [DEV] Would send task reminder to:", params.email);
    return { success: true, dev: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.email,
      subject: `⏰ Rappel : ${params.taskTitle}`,
      react: TaskReminderEmail({
        userName: params.userName,
        taskTitle: params.taskTitle,
        dueDate: params.dueDate,
        daysLeft: params.daysLeft,
      }),
    });

    if (error) {
      console.error("❌ Failed to send task reminder:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Task reminder sent:", data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error("❌ Error sending task reminder:", error);
    return { success: false, error: "Failed to send email" };
  }
}

interface SendRSVPNotificationParams {
  email: string;
  userName: string;
  guestName: string;
  response: "confirmed" | "declined" | "pending";
  guestCount?: number;
  dietaryRestrictions?: string;
}

export async function sendRSVPNotificationEmail(params: SendRSVPNotificationParams) {
  if (!resend) {
    console.log("📧 [DEV] Would send RSVP notification to:", params.email);
    return { success: true, dev: true };
  }

  const emoji = params.response === "confirmed" ? "🎉" : params.response === "declined" ? "😔" : "⏳";

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.email,
      subject: `${emoji} ${params.guestName} a répondu à votre invitation`,
      react: GuestRSVPEmail({
        userName: params.userName,
        guestName: params.guestName,
        response: params.response,
        guestCount: params.guestCount,
        dietaryRestrictions: params.dietaryRestrictions,
      }),
    });

    if (error) {
      console.error("❌ Failed to send RSVP notification:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ RSVP notification sent:", data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error("❌ Error sending RSVP notification:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// Format date for display in French
export function formatDateFR(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Calculate days until a date
export function daysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
