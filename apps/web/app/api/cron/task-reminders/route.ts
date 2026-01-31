import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTaskReminderEmail, formatDateFR, daysUntil, NotificationPreferences } from "@/lib/notifications";

// Use service role for cron jobs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/cron/task-reminders
 * Send task reminder emails for premium users
 * Should be called daily via cron job
 *
 * Sends reminders for tasks due in: 7 days, 3 days, 1 day, and today
 */
export async function GET(request: NextRequest) {
  // Verify cron secret (optional but recommended)
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Days to send reminders
    const reminderDays = [0, 1, 3, 7];
    const targetDates = reminderDays.map((days) => {
      const date = new Date(today);
      date.setDate(date.getDate() + days);
      return date.toISOString().split("T")[0];
    });

    console.log("📧 Checking for task reminders for dates:", targetDates);

    // Get all premium weddings with their tasks
    const { data: premiumWeddings, error: weddingsError } = await supabase
      .from("weddings")
      .select(`
        id,
        owner_id,
        profiles!weddings_owner_id_fkey (
          email,
          full_name,
          notification_preferences
        )
      `)
      .in("plan", ["premium", "lifetime"]);

    if (weddingsError) {
      console.error("❌ Error fetching weddings:", weddingsError);
      return NextResponse.json({ error: "Failed to fetch weddings" }, { status: 500 });
    }

    let emailsSent = 0;
    let errors = 0;

    for (const wedding of premiumWeddings || []) {
      const profile = wedding.profiles as unknown as {
        email: string;
        full_name: string;
        notification_preferences: NotificationPreferences | null;
      };

      if (!profile?.email) continue;

      // Check notification preferences
      const prefs = profile.notification_preferences;
      if (prefs && !prefs.email_task_reminders) continue;

      // Get incomplete tasks for this wedding with target due dates
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("id, title, due_date")
        .eq("wedding_id", wedding.id)
        .in("due_date", targetDates)
        .eq("status", "todo");

      if (tasksError) {
        console.error(`❌ Error fetching tasks for wedding ${wedding.id}:`, tasksError);
        errors++;
        continue;
      }

      // Send reminder for each task
      for (const task of tasks || []) {
        if (!task.due_date) continue;

        const days = daysUntil(task.due_date);

        // Only send for our reminder days
        if (!reminderDays.includes(days)) continue;

        const result = await sendTaskReminderEmail({
          email: profile.email,
          userName: profile.full_name || "Utilisateur",
          taskTitle: task.title,
          dueDate: formatDateFR(task.due_date),
          daysLeft: days,
        });

        if (result.success) {
          emailsSent++;
          console.log(`✅ Sent reminder for task "${task.title}" to ${profile.email}`);
        } else {
          errors++;
          console.error(`❌ Failed to send reminder for task "${task.title}":`, result.error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      errors,
      message: `Sent ${emailsSent} reminder emails with ${errors} errors`,
    });
  } catch (error) {
    console.error("[api/cron/task-reminders] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
