import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  phone: z.string().nullable(),
  role: z.enum(["user", "admin", "super_admin"]).default("user"),
  is_active: z.boolean().default(true),
});

export type Profile = z.infer<typeof ProfileSchema>;
