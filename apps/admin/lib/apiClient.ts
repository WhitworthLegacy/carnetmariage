import { createBrowserClient } from "./supabase";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const supabase = createBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erreur reseau" }));
    throw new Error(error.error?.message || error.message || "Erreur inconnue");
  }

  return res.json();
}
