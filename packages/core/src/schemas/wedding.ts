import { z } from "zod";

export const WeddingSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  owner_id: z.string().uuid(),
  partner1_name: z.string().default(""),
  partner2_name: z.string().default(""),
  wedding_date: z.string().nullable(),
  total_budget: z.number().default(0),
  currency: z.string().default("EUR"),
  locale: z.string().default("fr"),
  timezone: z.string().default("Europe/Paris"),
  plan: z.enum(["free", "premium", "ultimate", "lifetime"]).default("free"),
  stripe_customer_id: z.string().nullable(),
  stripe_subscription_id: z.string().nullable(),
  settings: z.record(z.unknown()).default({}),
});

export const CreateWeddingSchema = z.object({
  partner1_name: z.string().min(1),
  partner2_name: z.string().min(1),
  wedding_date: z.string().nullable().optional(),
  total_budget: z.number().min(0).optional(),
});

export const UpdateWeddingSchema = CreateWeddingSchema.partial();

export type Wedding = z.infer<typeof WeddingSchema>;
export type CreateWedding = z.infer<typeof CreateWeddingSchema>;
export type UpdateWedding = z.infer<typeof UpdateWeddingSchema>;
