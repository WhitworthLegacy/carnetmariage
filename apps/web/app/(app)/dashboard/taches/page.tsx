"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X, Calendar, ListTodo as _ListTodo, Columns3 as _Columns3, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Button, Card, Modal, Input, Select, Badge, Tabs, useToast } from "@carnetmariage/ui";
import {
  TASK_STATUSES,
  TASK_CATEGORIES,
  PLAN_LIMITS,
  type Task,
  type TaskStatus,
} from "@carnetmariage/core";
import { useWedding } from "@/contexts/WeddingContext";
import { prettyDate } from "@/lib/utils";

const statusOptions = Object.entries(TASK_STATUSES).map(([value, label]) => ({
  value,
  label,
}));

const categoryOptions = TASK_CATEGORIES.map((c) => ({ value: c, label: c }));

const emptyForm = {
  title: "",
  category: "General",
  status: "todo" as TaskStatus,
  due_date: "",
  notes: "",
};

export default function TachesPage() {
  const { wedding } = useWedding();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const planLimits = PLAN_LIMITS[wedding.plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free;
  const taskLimit = planLimits.tasks;
  const isNearLimit = taskLimit !== Infinity && tasks.length >= taskLimit - 5;

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      const json = await res.json();
      if (json.ok) setTasks(json.data);
    } catch {
      toast("Erreur lors du chargement des tâches", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      category: task.category || "General",
      status: task.status as TaskStatus,
      due_date: task.due_date || "",
      notes: task.notes || "",
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);

    const body = {
      title: form.title.trim(),
      category: form.category,
      status: form.status,
      due_date: form.due_date || null,
      notes: form.notes || null,
    };

    try {
      const url = editingId ? `/api/tasks/${editingId}` : "/api/tasks";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!json.ok) {
        toast(json.error?.message || "Erreur", "error");
        setSaving(false);
        return;
      }

      if (editingId) {
        setTasks((prev) => prev.map((t) => (t.id === editingId ? json.data : t)));
        toast("Tâche mise à jour");
      } else {
        setTasks((prev) => [...prev, json.data]);
        toast("Tâche ajoutée");
      }

      setModalOpen(false);
    } catch {
      toast("Une erreur est survenue", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        toast("Tâche supprimée");
      } else {
        toast(json.error?.message || "Erreur", "error");
      }
    } catch {
      toast("Une erreur est survenue", "error");
    }
  }

  const groupedTasks: Record<string, Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    doing: tasks.filter((t) => t.status === "doing"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const statusBadgeVariant: Record<string, "default" | "warning" | "success"> = {
    todo: "default",
    doing: "warning",
    done: "success",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl sm:text-3xl text-ink">Tâches</h1>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une tâche
        </Button>
      </div>

      {/* Plan limit banner */}
      {isNearLimit && taskLimit !== Infinity && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            {tasks.length}/{taskLimit} tâches utilisées.{" "}
            <a href="/dashboard/parametres" className="font-semibold underline">
              Passe à Premium
            </a>{" "}
            pour en ajouter plus.
          </p>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "kanban", label: "Kanban" },
          { id: "list", label: "Liste" },
        ]}
        defaultTab="kanban"
      >
        {(activeTab) =>
          loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-pink-main border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeTab === "kanban" ? (
            /* Kanban View */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(TASK_STATUSES) as TaskStatus[]).map((statusKey) => (
                <div key={statusKey} className="bg-ivory rounded-2xl p-4 min-h-[300px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-ink text-sm">{TASK_STATUSES[statusKey]}</h3>
                    <Badge variant={statusBadgeVariant[statusKey]}>
                      {groupedTasks[statusKey]?.length ?? 0}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {(groupedTasks[statusKey] ?? []).map((task) => (
                      <Card
                        key={task.id}
                        padding="sm"
                        className="group cursor-pointer hover:shadow-soft transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0" onClick={() => openEditModal(task)}>
                            <p className="text-sm font-medium text-ink truncate">{task.title}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="purple" className="text-[10px]">
                                {task.category}
                              </Badge>
                              {task.due_date && (
                                <span className="flex items-center gap-1 text-[11px] text-muted">
                                  <Calendar className="w-3 h-3" />
                                  {prettyDate(task.due_date)}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(task.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </Card>
                    ))}
                    {(groupedTasks[statusKey] ?? []).length === 0 && (
                      <p className="text-xs text-muted text-center py-8">Aucune tâche</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-border">
                      <th className="text-left font-medium text-muted px-4 py-3">Titre</th>
                      <th className="text-left font-medium text-muted px-4 py-3">Catégorie</th>
                      <th className="text-left font-medium text-muted px-4 py-3">Statut</th>
                      <th className="text-left font-medium text-muted px-4 py-3">Échéance</th>
                      <th className="text-right font-medium text-muted px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-12">
                          Aucune tâche pour le moment.
                        </td>
                      </tr>
                    )}
                    {tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-brand-border/50 hover:bg-ivory/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-ink">{task.title}</td>
                        <td className="px-4 py-3">
                          <Badge variant="purple">{task.category}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusBadgeVariant[task.status]}>
                            {TASK_STATUSES[task.status as TaskStatus]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {task.due_date ? prettyDate(task.due_date) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(task)}
                              className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-ivory transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )
        }
      </Tabs>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Modifier la tâche" : "Nouvelle tâche"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Confirmer le traiteur"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Catégorie"
              options={categoryOptions}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Select
              label="Statut"
              options={statusOptions}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
            />
          </div>
          <Input
            label="Échéance"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes supplémentaires..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm transition-colors bg-white text-ink placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-pink-main/30 focus:border-pink-main resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" loading={saving}>
              {editingId ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
