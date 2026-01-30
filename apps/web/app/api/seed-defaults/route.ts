import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_TASKS,
  DEFAULT_BUDGET_LINES,
  calculateDueDate,
  calculateEstimatedAmount,
} from "@carnetmariage/core";

/**
 * POST /api/seed-defaults
 * Seeds default tasks and budget lines for the current user's wedding
 * Only seeds if the wedding has no tasks or budget lines
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's wedding
    const { data: wedding, error: weddingError } = await supabase
      .from("weddings")
      .select("id, wedding_date, total_budget")
      .limit(1)
      .single();

    if (weddingError || !wedding) {
      return NextResponse.json({ error: "No wedding found" }, { status: 404 });
    }

    const weddingId = wedding.id;
    const weddingDate = wedding.wedding_date;
    const totalBudget = wedding.total_budget || 15000;

    let tasksSeeded = 0;
    let budgetSeeded = 0;

    // Check if tasks exist
    const { count: taskCount } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("wedding_id", weddingId);

    if (taskCount === 0) {
      // Seed default tasks
      const tasksToInsert = DEFAULT_TASKS.map((task, index) => ({
        wedding_id: weddingId,
        title: task.title,
        category: task.category,
        status: "todo" as const,
        due_date: calculateDueDate(weddingDate, task.months_before || 6),
        position: index,
        notes: null,
      }));

      const { error: tasksError } = await supabase.from("tasks").insert(tasksToInsert);
      if (tasksError) {
        console.error("[api/seed-defaults] tasks error:", tasksError);
      } else {
        tasksSeeded = tasksToInsert.length;
      }
    }

    // Check if budget lines exist
    const { count: budgetCount } = await supabase
      .from("budget_lines")
      .select("*", { count: "exact", head: true })
      .eq("wedding_id", weddingId);

    if (budgetCount === 0) {
      // Seed default budget lines
      const budgetToInsert = DEFAULT_BUDGET_LINES.map((line) => ({
        wedding_id: weddingId,
        label: line.label,
        category: line.category,
        estimated: calculateEstimatedAmount(totalBudget, line.estimated_percentage || 5),
        paid: 0,
        status: "planned" as const,
        notes: null,
        vendor_id: null,
      }));

      const { error: budgetError } = await supabase.from("budget_lines").insert(budgetToInsert);
      if (budgetError) {
        console.error("[api/seed-defaults] budget error:", budgetError);
      } else {
        budgetSeeded = budgetToInsert.length;
      }
    }

    return NextResponse.json({
      success: true,
      tasksSeeded,
      budgetSeeded,
      message:
        tasksSeeded > 0 || budgetSeeded > 0
          ? `Données ajoutées: ${tasksSeeded} tâches, ${budgetSeeded} lignes budget`
          : "Les données existent déjà",
    });
  } catch (error) {
    console.error("[api/seed-defaults] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
