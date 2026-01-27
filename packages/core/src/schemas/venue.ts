import { z } from "zod";

export const VenueSchema = z.object({
  id: z.string().uuid(),
  wedding_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string().min(1),
  location: z.string().nullable(),
  price: z.number().default(0),
  capacity: z.number().int().default(0),
  status: z.enum(["visit", "option", "booked"]).default("visit"),
  contact_name: z.string().nullable(),
  contact_email: z.string().nullable(),
  contact_phone: z.string().nullable(),
  visit_date: z.string().nullable(),
  notes: z.string().nullable(),
  photos: z.array(z.string()).default([]),
});

export const CreateVenueSchema = z.object({
  name: z.string().min(1),
  location: z.string().nullable().optional(),
  price: z.number().min(0).optional(),
  capacity: z.number().int().min(0).optional(),
  status: z.enum(["visit", "option", "booked"]).optional(),
  contact_name: z.string().nullable().optional(),
  contact_email: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  visit_date: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const UpdateVenueSchema = CreateVenueSchema.partial();

export type Venue = z.infer<typeof VenueSchema>;
export type CreateVenue = z.infer<typeof CreateVenueSchema>;
export type UpdateVenue = z.infer<typeof UpdateVenueSchema>;
