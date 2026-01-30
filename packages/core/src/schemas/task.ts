import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string().uuid(),
  wedding_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  title: z.string().min(1),
  category: z.string().default("Général"),
  status: z.enum(["todo", "doing", "done"]).default("todo"),
  due_date: z.string().nullable(),
  position: z.number().int().default(0),
  notes: z.string().nullable(),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  category: z.string().optional(),
  status: z.enum(["todo", "doing", "done"]).optional(),
  due_date: z.string().nullable().optional(),
  position: z.number().int().optional(),
  notes: z.string().nullable().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
