const BASE_URL = "http://localhost:3001/api";

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/auth/me`, { credentials: "include" });
  return res.ok ? res.json() : null;
}

export async function getBoards(orgId: string) {
  const res = await fetch(`${BASE_URL}/boards/org/${orgId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch boards");
  return res.json();
}
