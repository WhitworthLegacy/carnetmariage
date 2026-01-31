"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Users, UserPlus, GripVertical, Settings2 } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  Card,
  Modal,
  Input,
  Select,
  useToast,
} from "@carnetmariage/ui";
import { PremiumGate } from "@/components/app/PremiumGate";
import type { Guest } from "@carnetmariage/core";

interface SeatingTable {
  id: string;
  name: string;
  capacity: number;
  shape: "round" | "rectangle" | "long";
  position_x: number;
  position_y: number;
}

interface GuestWithTable extends Guest {
  table_id: string | null;
}

// Draggable Guest Chip
function DraggableGuest({ guest, isOverlay }: { guest: GuestWithTable; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: guest.id,
    data: { type: "guest", guest },
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  if (isOverlay) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-main text-white rounded-full text-sm font-medium shadow-lg">
        <Users className="w-3.5 h-3.5" />
        {guest.name}
        <span className="text-xs opacity-80">({guest.adults + guest.kids})</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm cursor-grab active:cursor-grabbing hover:border-pink-main hover:shadow-sm transition-all ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <GripVertical className="w-3 h-3 text-gray-400" />
      <span className="text-ink font-medium">{guest.name}</span>
      <span className="text-xs text-muted">({guest.adults + guest.kids})</span>
    </div>
  );
}

// Droppable Table
function DroppableTable({
  table,
  guests,
  onRemoveGuest,
  onEditTable,
  onDeleteTable,
}: {
  table: SeatingTable;
  guests: GuestWithTable[];
  onRemoveGuest: (guestId: string) => void;
  onEditTable: (table: SeatingTable) => void;
  onDeleteTable: (tableId: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: table.id,
    data: { type: "table", table },
  });

  const assignedGuests = guests.filter((g) => g.table_id === table.id);
  const totalSeated = assignedGuests.reduce((sum, g) => sum + g.adults + g.kids, 0);
  const isFull = totalSeated >= table.capacity;
  const isOverCapacity = totalSeated > table.capacity;

  return (
    <div
      ref={setNodeRef}
      className={`relative p-4 rounded-2xl border-2 transition-all ${
        isOver
          ? "border-pink-main bg-pink-50 shadow-lg scale-[1.02]"
          : isFull
            ? "border-green-200 bg-green-50/50"
            : "border-gray-200 bg-white hover:border-gray-300"
      } ${isOverCapacity ? "border-red-300 bg-red-50" : ""}`}
    >
      {/* Table header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              table.shape === "round"
                ? "bg-purple-100 text-purple-600"
                : table.shape === "long"
                  ? "bg-pink-100 text-pink-600"
                  : "bg-blue-100 text-blue-600"
            }`}
          >
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-ink text-sm">{table.name}</h3>
            <p className="text-xs text-muted">
              {totalSeated}/{table.capacity} places
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEditTable(table)}
            className="p-1.5 text-gray-400 hover:text-ink hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteTable(table.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Capacity indicator */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isOverCapacity ? "bg-red-500" : isFull ? "bg-green-500" : "bg-pink-main"
          }`}
          style={{ width: `${Math.min(100, (totalSeated / table.capacity) * 100)}%` }}
        />
      </div>

      {/* Assigned guests */}
      <div className="flex flex-wrap gap-1.5 min-h-[40px]">
        {assignedGuests.length === 0 ? (
          <p className="text-xs text-muted italic w-full text-center py-2">
            Glisse des invités ici
          </p>
        ) : (
          assignedGuests.map((guest) => (
            <div
              key={guest.id}
              className="group inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
            >
              <span className="text-ink">{guest.name}</span>
              <span className="text-muted">({guest.adults + guest.kids})</span>
              <button
                onClick={() => onRemoveGuest(guest.id)}
                className="opacity-0 group-hover:opacity-100 ml-0.5 text-gray-400 hover:text-red-500 transition-opacity"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Unassigned guests drop zone
function UnassignedZone({ guests }: { guests: GuestWithTable[] }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "unassigned",
    data: { type: "unassigned" },
  });

  const unassignedGuests = guests.filter((g) => !g.table_id && g.status !== "declined");

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-2xl border-2 border-dashed transition-all ${
        isOver ? "border-pink-main bg-pink-50" : "border-gray-200 bg-gray-50/50"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <UserPlus className="w-4 h-4 text-muted" />
        <h3 className="font-medium text-ink text-sm">
          Invités non placés ({unassignedGuests.length})
        </h3>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[60px]">
        {unassignedGuests.length === 0 ? (
          <p className="text-sm text-muted italic">Tous les invités sont placés !</p>
        ) : (
          unassignedGuests.map((guest) => <DraggableGuest key={guest.id} guest={guest} />)
        )}
      </div>
    </div>
  );
}

export default function TablesPage() {
  const { toast } = useToast();
  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [guests, setGuests] = useState<GuestWithTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGuest, setActiveGuest] = useState<GuestWithTable | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<SeatingTable | null>(null);
  const [tableForm, setTableForm] = useState({
    name: "",
    capacity: "8",
    shape: "round" as "round" | "rectangle" | "long",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const fetchData = useCallback(async () => {
    try {
      const [tablesRes, guestsRes] = await Promise.all([
        fetch("/api/tables"),
        fetch("/api/guests"),
      ]);
      const tablesJson = await tablesRes.json();
      const guestsJson = await guestsRes.json();

      if (tablesJson.ok) setTables(tablesJson.data);
      if (guestsJson.ok) setGuests(guestsJson.data);
    } catch {
      toast("Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const guest = guests.find((g) => g.id === active.id);
    if (guest) setActiveGuest(guest);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveGuest(null);

    if (!over) return;

    const guestId = active.id as string;
    const targetId = over.id as string;
    const guest = guests.find((g) => g.id === guestId);

    if (!guest) return;

    // Don't do anything if dropping on same location
    if (targetId === "unassigned" && !guest.table_id) return;
    if (targetId === guest.table_id) return;

    // Optimistically update UI
    const newTableId = targetId === "unassigned" ? null : targetId;
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, table_id: newTableId } : g))
    );

    // Update in database
    try {
      const res = await fetch(`/api/guests/${guestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_id: newTableId }),
      });
      const json = await res.json();
      if (!json.ok) {
        // Revert on error
        setGuests((prev) =>
          prev.map((g) => (g.id === guestId ? { ...g, table_id: guest.table_id } : g))
        );
        toast("Erreur lors du déplacement", "error");
      }
    } catch {
      // Revert on error
      setGuests((prev) =>
        prev.map((g) => (g.id === guestId ? { ...g, table_id: guest.table_id } : g))
      );
      toast("Erreur lors du déplacement", "error");
    }
  }

  async function handleRemoveGuest(guestId: string) {
    const guest = guests.find((g) => g.id === guestId);
    if (!guest) return;

    // Optimistically update
    setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...g, table_id: null } : g)));

    try {
      const res = await fetch(`/api/guests/${guestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_id: null }),
      });
      const json = await res.json();
      if (!json.ok) {
        setGuests((prev) =>
          prev.map((g) => (g.id === guestId ? { ...g, table_id: guest.table_id } : g))
        );
      }
    } catch {
      setGuests((prev) =>
        prev.map((g) => (g.id === guestId ? { ...g, table_id: guest.table_id } : g))
      );
    }
  }

  function openAddTableModal() {
    setEditingTable(null);
    setTableForm({ name: "", capacity: "8", shape: "round" });
    setModalOpen(true);
  }

  function openEditTableModal(table: SeatingTable) {
    setEditingTable(table);
    setTableForm({
      name: table.name,
      capacity: String(table.capacity),
      shape: table.shape,
    });
    setModalOpen(true);
  }

  async function handleSaveTable(e: React.FormEvent) {
    e.preventDefault();
    if (!tableForm.name.trim()) return;

    const body = {
      name: tableForm.name.trim(),
      capacity: parseInt(tableForm.capacity) || 8,
      shape: tableForm.shape,
    };

    try {
      if (editingTable) {
        const res = await fetch(`/api/tables/${editingTable.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (json.ok) {
          setTables((prev) => prev.map((t) => (t.id === editingTable.id ? json.data : t)));
          toast("Table mise à jour");
        }
      } else {
        const res = await fetch("/api/tables", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (json.ok) {
          setTables((prev) => [...prev, json.data]);
          toast("Table créée");
        }
      }
      setModalOpen(false);
    } catch {
      toast("Erreur", "error");
    }
  }

  async function handleDeleteTable(tableId: string) {
    if (!confirm("Supprimer cette table ? Les invités seront dé-assignés.")) return;

    try {
      const res = await fetch(`/api/tables/${tableId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        setTables((prev) => prev.filter((t) => t.id !== tableId));
        setGuests((prev) => prev.map((g) => (g.table_id === tableId ? { ...g, table_id: null } : g)));
        toast("Table supprimée");
      }
    } catch {
      toast("Erreur", "error");
    }
  }

  // Stats
  const totalGuests = guests.filter((g) => g.status !== "declined").reduce((sum, g) => sum + g.adults + g.kids, 0);
  const seatedGuests = guests
    .filter((g) => g.table_id && g.status !== "declined")
    .reduce((sum, g) => sum + g.adults + g.kids, 0);
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl sm:text-3xl text-ink">Plan de table</h1>
        <Button onClick={openAddTableModal}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une table
        </Button>
      </div>

      <PremiumGate feature="tables">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="text-center">
              <p className="text-2xl font-bold text-ink">{tables.length}</p>
              <p className="text-sm text-muted">Tables</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-bold text-ink">
                {seatedGuests}/{totalGuests}
              </p>
              <p className="text-sm text-muted">Invités placés</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-bold text-ink">{totalCapacity}</p>
              <p className="text-sm text-muted">Places total</p>
            </Card>
          </div>

          {/* Unassigned guests */}
          <UnassignedZone guests={guests} />

          {/* Tables grid */}
          {tables.length === 0 ? (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted mb-4">Aucune table créée</p>
              <Button onClick={openAddTableModal}>
                <Plus className="w-4 h-4 mr-2" />
                Créer ma première table
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => (
                <DroppableTable
                  key={table.id}
                  table={table}
                  guests={guests}
                  onRemoveGuest={handleRemoveGuest}
                  onEditTable={openEditTableModal}
                  onDeleteTable={handleDeleteTable}
                />
              ))}
            </div>
          )}

          {/* Drag overlay */}
          <DragOverlay>
            {activeGuest ? <DraggableGuest guest={activeGuest} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </PremiumGate>

      {/* Add/Edit Table Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTable ? "Modifier la table" : "Nouvelle table"}
      >
        <form onSubmit={handleSaveTable} className="space-y-4">
          <Input
            label="Nom de la table"
            value={tableForm.name}
            onChange={(e) => setTableForm({ ...tableForm, name: e.target.value })}
            placeholder="Ex: Table 1, Table d'honneur..."
            required
          />
          <Input
            label="Capacité (nombre de places)"
            type="number"
            min="1"
            max="20"
            value={tableForm.capacity}
            onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })}
          />
          <Select
            label="Forme de la table"
            options={[
              { value: "round", label: "Ronde" },
              { value: "rectangle", label: "Rectangle" },
              { value: "long", label: "Longue (banquet)" },
            ]}
            value={tableForm.shape}
            onChange={(e) =>
              setTableForm({ ...tableForm, shape: e.target.value as "round" | "rectangle" | "long" })
            }
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">{editingTable ? "Enregistrer" : "Créer"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
