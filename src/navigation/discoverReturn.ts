const FALLBACK = "/#restaurants";

export function discoverReturnTo(state: unknown): string {
  if (!state || typeof state !== "object" || Array.isArray(state)) return FALLBACK;
  const value = (state as Record<string, unknown>).discoverReturnTo;
  if (typeof value !== "string") return FALLBACK;
  try {
    const url = new URL(value, "https://ohmyfood.invalid");
    if (
      url.origin !== "https://ohmyfood.invalid" ||
      url.pathname !== "/" ||
      url.hash !== "#restaurants"
    ) return FALLBACK;
    return url.pathname + url.search + url.hash;
  } catch {
    return FALLBACK;
  }
}
