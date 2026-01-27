import { z } from "zod";

export const VendorSchema = z.object({
  id: z.string().uuid(),
  wedding_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string().min(1),
  category: z.string(),
  status: z.enum(["contact", "quote", "meeting", "negotiating", "booked", "paid", "refused"]).default("contact"),
  price: z.number().default(0),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  rating: z.number().int().min(1).max(5).nullable(),
});

export const CreateVendorSchema = z.object({
  name: z.string().min(1),
  category: z.string(),
  status: z.enum(["contact", "quote", "meeting", "negotiating", "booked", "paid", "refused"]).optional(),
  price: z.number().min(0).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
});

export const UpdateVendorSchema = CreateVendorSchema.partial();

export type Vendor = z.infer<typeof VendorSchema>;
export type CreateVendor = z.infer<typeof CreateVendorSchema>;
export type UpdateVendor = z.infer<typeof UpdateVendorSchema>;
