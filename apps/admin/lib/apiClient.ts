export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sb-access-token="))
    ?.split("=")[1];

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Erreur reseau" }));
    throw new Error(
      error.error?.message || error.message || "Erreur inconnue"
    );
  }

  return res.json();
}
