import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, Badge } from "@carnetmariage/ui";
import { CheckSquare, Wallet, Users, Star, Heart, CalendarClock, Activity, ChevronRight } from "lucide-react";
import { daysLeft, prettyDate, formatPrice, progressPercent } from "@/lib/utils";
import { ProgressRing } from "@/components/app/ProgressRing";
import { UpsellBanner } from "@/components/app/UpsellBanner";

export const metadata = {
  title: "Tableau de bord",
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: string;
}

function StatCard({ icon, label, value, subtitle, color }: StatCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted font-medium">{label}</p>
          <p className="text-xl font-bold text-ink mt-0.5">{value}</p>
          <p className="text-xs text-muted-light mt-0.5">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!wedding) redirect("/onboarding");

  // Fetch all stats in parallel
  const [tasksRes, budgetRes, guestsRes, vendorsRes, upcomingTasksRes] = await Promise.all([
    supabase.from("tasks").select("id, status").eq("wedding_id", wedding.id),
    supabase.from("budget_lines").select("id, estimated, paid").eq("wedding_id", wedding.id),
    supabase.from("guests").select("id, status").eq("wedding_id", wedding.id),
    supabase.from("vendors").select("id, status").eq("wedding_id", wedding.id),
    supabase
      .from("tasks")
      .select("id, title, due_date, status")
      .eq("wedding_id", wedding.id)
      .neq("status", "done")
      .not("due_date", "is", null)
      .order("due_date", { ascending: true })
      .limit(5),
  ]);

  const tasks = tasksRes.data || [];
  const tasksDone = tasks.filter((t) => t.status === "done").length;
  const tasksTotal = tasks.length;
  const taskPercent = progressPercent(tasksDone, tasksTotal);

  const budgetLines = budgetRes.data || [];
  const budgetSpent = budgetLines.reduce((sum, b) => sum + Number(b.paid || 0), 0);
  const budgetTotal = wedding.total_budget || 0;

  const guests = guestsRes.data || [];
  const guestsConfirmed = guests.filter((g) => g.status === "confirmed").length;
  const guestsTotal = guests.length;

  const vendors = vendorsRes.data || [];
  const vendorsBooked = vendors.filter((v) => v.status === "booked").length;
  const vendorsTotal = vendors.length;

  const upcomingTasks = upcomingTasksRes.data || [];

  const days = daysLeft(wedding.wedding_date);
  const formattedDate = prettyDate(wedding.wedding_date);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Wedding Hero */}
      <section className="relative overflow-hidden bg-white rounded-2xl shadow-card border border-brand-border/50 p-6 sm:p-8">
        {/* Decorative gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 0% 0%, rgba(216,167,177,0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(167,139,250,0.06) 0%, transparent 50%)",
          }}
        />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Left: text info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              Bienvenue, {wedding.partner1_name} &amp; {wedding.partner2_name}
            </h1>

            {formattedDate && (
              <p className="mt-2 text-muted flex items-center justify-center sm:justify-start gap-1.5">
                <Heart size={14} className="text-pink-main fill-pink-main" />
                {formattedDate}
              </p>
            )}

            {days !== null && days >= 0 && (
              <div className="mt-4 inline-flex items-center gap-2">
                <Badge variant="pink" className="text-sm px-3 py-1 font-semibold">
                  J-{days}
                </Badge>
                <span className="text-sm text-muted">
                  {days === 0
                    ? "C'est aujourd'hui !"
                    : days === 1
                      ? "C'est demain !"
                      : `avant le grand jour`}
                </span>
              </div>
            )}

            {!wedding.wedding_date && (
              <p className="mt-3 text-sm text-muted-light italic">
                Ajoute ta date de mariage dans les paramètres pour voir le décompte.
              </p>
            )}
          </div>

          {/* Right: progress ring */}
          <div className="shrink-0 text-center">
            <ProgressRing percent={taskPercent} size={110} strokeWidth={8} />
            <p className="text-xs text-muted mt-2 font-medium">Avancement global</p>
          </div>
        </div>
      </section>

      {/* Upsell Banner for free users */}
      <UpsellBanner plan={wedding.plan} />

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-tour="stats">
        <StatCard
          icon={<CheckSquare size={20} className="text-emerald-600" />}
          label="Tâches"
          value={`${tasksDone}/${tasksTotal}`}
          subtitle="terminées"
          color="bg-emerald-50"
        />
        <StatCard
          icon={<Wallet size={20} className="text-purple-dark" />}
          label="Budget"
          value={formatPrice(budgetSpent)}
          subtitle={`sur ${formatPrice(budgetTotal)}`}
          color="bg-purple-light"
        />
        <StatCard
          icon={<Users size={20} className="text-blue-600" />}
          label="Invités"
          value={`${guestsConfirmed}/${guestsTotal}`}
          subtitle="confirmés"
          color="bg-blue-50"
        />
        <StatCard
          icon={<Star size={20} className="text-pink-dark" />}
          label="Prestataires"
          value={`${vendorsBooked}/${vendorsTotal}`}
          subtitle="réservés"
          color="bg-pink-light"
        />
      </section>

      {/* Two-column layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming deadlines */}
        <Card data-tour="upcoming">
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <CalendarClock size={18} className="text-pink-main" />
                Prochaines échéances
              </span>
            </CardTitle>
          </CardHeader>

          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8">
              <CalendarClock size={32} className="text-brand-border mx-auto mb-3" />
              <p className="text-sm text-muted">Aucune échéance à venir pour le moment.</p>
              <p className="text-xs text-muted-light mt-1">
                Ajoute des tâches avec des dates limites pour les voir ici.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {upcomingTasks.map((task, index) => {
                const taskDays = daysLeft(task.due_date);
                const isUrgent = taskDays !== null && taskDays <= 7;
                const isOverdue = taskDays !== null && taskDays < 0;

                return (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-ivory/50 hover:bg-ivory hover:shadow-sm transition-all duration-200 cursor-pointer group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isOverdue
                          ? "bg-red-400 animate-pulse"
                          : isUrgent
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate group-hover:text-pink-dark transition-colors">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted">{prettyDate(task.due_date)}</p>
                    </div>
                    {taskDays !== null && (
                      <Badge variant={isOverdue ? "danger" : isUrgent ? "warning" : "default"}>
                        {isOverdue ? `En retard` : taskDays === 0 ? "Aujourd'hui" : `J-${taskDays}`}
                      </Badge>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Activity size={18} className="text-purple-main" />
                Activité récente
              </span>
            </CardTitle>
          </CardHeader>

          <RecentActivity weddingId={wedding.id} />
        </Card>
      </section>
    </div>
  );
}

async function RecentActivity({ weddingId }: { weddingId: string }) {
  const supabase = await createClient();

  // Fetch recent items from different tables
  const [recentTasks, recentGuests, recentVendors, recentBudget] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, created_at")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("guests")
      .select("id, name, created_at")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("vendors")
      .select("id, name, created_at")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("budget_lines")
      .select("id, label, created_at")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  type ActivityItem = {
    id: string;
    label: string;
    type: string;
    icon: React.ReactNode;
    date: string;
    href: string;
  };

  const items: ActivityItem[] = [];

  (recentTasks.data || []).forEach((t) =>
    items.push({
      id: `task-${t.id}`,
      label: t.title,
      type: "Tâche",
      icon: <CheckSquare size={14} className="text-emerald-500" />,
      date: t.created_at,
      href: "/dashboard/taches",
    })
  );

  (recentGuests.data || []).forEach((g) =>
    items.push({
      id: `guest-${g.id}`,
      label: g.name,
      type: "Invité",
      icon: <Users size={14} className="text-blue-500" />,
      date: g.created_at,
      href: "/dashboard/invites",
    })
  );

  (recentVendors.data || []).forEach((v) =>
    items.push({
      id: `vendor-${v.id}`,
      label: v.name,
      type: "Prestataire",
      icon: <Star size={14} className="text-pink-dark" />,
      date: v.created_at,
      href: "/dashboard/prestataires",
    })
  );

  (recentBudget.data || []).forEach((b) =>
    items.push({
      id: `budget-${b.id}`,
      label: b.label,
      type: "Dépense",
      icon: <Wallet size={14} className="text-purple-dark" />,
      date: b.created_at,
      href: "/dashboard/budget",
    })
  );

  // Sort by date descending and take 5
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recent = items.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity size={32} className="text-brand-border mx-auto mb-3" />
        <p className="text-sm text-muted">Aucune activité pour le moment.</p>
        <p className="text-xs text-muted-light mt-1">
          Commence par ajouter des tâches ou des invités.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {recent.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-xl bg-ivory/50 hover:bg-ivory hover:shadow-sm transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-brand-border/50 flex items-center justify-center shrink-0 group-hover:border-pink-main/30 transition-colors">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate group-hover:text-pink-dark transition-colors">{item.label}</p>
              <p className="text-xs text-muted">{item.type}</p>
            </div>
            <time className="text-xs text-muted-light shrink-0">{formatRelativeDate(item.date)}</time>
            <ChevronRight size={14} className="text-muted-light group-hover:text-pink-main transition-colors shrink-0" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function formatRelativeDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return prettyDate(dateString);
}
