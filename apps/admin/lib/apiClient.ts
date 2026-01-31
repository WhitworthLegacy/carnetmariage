const WEB_API_URL = process.env.NEXT_PUBLIC_WEB_API_URL || "http://localhost:3002";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  // Read token from cookie (set by login page)
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sb-access-token="))
    ?.split("=")[1];

  // Call web API directly (not through rewrite) to ensure headers are passed
  const url = path.startsWith("/api/admin") ? `${WEB_API_URL}${path}` : path;

  const res = await fetch(url, {
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
