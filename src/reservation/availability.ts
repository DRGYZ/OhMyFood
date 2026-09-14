import { restaurantById } from "../data/restaurants";
import { isBookingDate, weekdayForDate } from "./dates";

export interface AvailabilityRequest {
  restaurantId: string;
  date: string;
  partySize: number;
}

export async function getAvailability(
  request: AvailabilityRequest,
  signal?: AbortSignal,
  online = typeof navigator === "undefined" || typeof navigator.onLine !== "boolean"
    ? true
    : navigator.onLine,
): Promise<string[]> {
  if (
    !restaurantById(request.restaurantId) ||
    !isBookingDate(request.date) ||
    !Number.isInteger(request.partySize) ||
    request.partySize < 1 ||
    request.partySize > 8
  ) {
    throw new Error("Paramètres de disponibilité invalides.");
  }

  // A local delay keeps the loading and cancellation paths realistic without a backend.
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = globalThis.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, 350);
    function onAbort() {
      globalThis.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });

  const weekday = weekdayForDate(request.date);
  // A disconnected browser cannot retrieve availability; retry works once online.
  if (!online) throw new Error("Disponibilités temporairement indisponibles.");
  // Large Monday tables have no slots in this deterministic mock.
  if (request.partySize >= 7 && weekday === 1) return [];

  const base = request.restaurantId === "francaise"
    ? ["12:00", "12:30", "13:00"]
    : ["19:00", "19:30", "20:00", "20:30", "21:00"];
  const offset = (request.date.charCodeAt(9) + request.restaurantId.length) % 2;
  const slots = base.slice(offset);
  return request.partySize >= 6 ? slots.slice(0, 2) : slots;
}
