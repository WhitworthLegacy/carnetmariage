import { z } from "zod";

export const GuestSchema = z.object({
  id: z.string().uuid(),
  wedding_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string().min(1),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  adults: z.number().int().default(1),
  kids: z.number().int().default(0),
  status: z.enum(["pending", "confirmed", "declined", "relaunch", "maybe"]).default("pending"),
  group_name: z.string().nullable(),
  dietary_notes: z.string().nullable(),
  table_number: z.number().int().nullable(),
  plus_one: z.boolean().default(false),
  notes: z.string().nullable(),
});

export const CreateGuestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  adults: z.number().int().min(0).optional(),
  kids: z.number().int().min(0).optional(),
  status: z.enum(["pending", "confirmed", "declined", "relaunch", "maybe"]).optional(),
  group_name: z.string().nullable().optional(),
  dietary_notes: z.string().nullable().optional(),
  table_number: z.number().int().nullable().optional(),
  plus_one: z.boolean().optional(),
  notes: z.string().nullable().optional(),
});

export const UpdateGuestSchema = CreateGuestSchema.partial();

export type Guest = z.infer<typeof GuestSchema>;
export type CreateGuest = z.infer<typeof CreateGuestSchema>;
export type UpdateGuest = z.infer<typeof UpdateGuestSchema>;
