import { z } from "zod";

export const BudgetLineSchema = z.object({
  id: z.string().uuid(),
  wedding_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  label: z.string().min(1),
  category: z.string().nullable(),
  estimated: z.number().default(0),
  paid: z.number().default(0),
  status: z.enum(["planned", "booked", "paid"]).default("planned"),
  notes: z.string().nullable(),
  vendor_id: z.string().uuid().nullable(),
});

export const CreateBudgetLineSchema = z.object({
  label: z.string().min(1),
  category: z.string().nullable().optional(),
  estimated: z.number().min(0).optional(),
  paid: z.number().min(0).optional(),
  status: z.enum(["planned", "booked", "paid"]).optional(),
  notes: z.string().nullable().optional(),
  vendor_id: z.string().uuid().nullable().optional(),
});

export const UpdateBudgetLineSchema = CreateBudgetLineSchema.partial();

export type BudgetLine = z.infer<typeof BudgetLineSchema>;
export type CreateBudgetLine = z.infer<typeof CreateBudgetLineSchema>;
export type UpdateBudgetLine = z.infer<typeof UpdateBudgetLineSchema>;
