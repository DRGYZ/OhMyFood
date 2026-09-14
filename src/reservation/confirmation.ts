import { restaurantById, type Restaurant } from "../data/restaurants";
import type { SelectedDish } from "../selection/selection";
import type { ReservationFields } from "./validation";
import { isCalendarDate } from "./dates";

export const CONFIRMATION_STORAGE_KEY = "omf_confirmation_v2";
const VERSION = 2;

export interface ConfirmationDish {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ConfirmationSnapshot {
  version: 2;
  reference: string;
  restaurantId: string;
  restaurantSlug: string;
  restaurantName: string;
  dishes: ConfirmationDish[];
  subtotal: number;
  partySize: number;
  date: string;
  time: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface ConfirmationStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function browserConfirmationStorage(): ConfirmationStorage | undefined {
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

export function createConfirmationSnapshot(
  restaurant: Restaurant,
  dishes: SelectedDish[],
  fields: ReservationFields,
): ConfirmationSnapshot {
  const reference = "OMF-" + Math.random().toString(36).slice(2, 7).toUpperCase().padEnd(5, "0");
  const items = dishes.map(({ item, quantity, lineTotal }) => ({
    itemId: item.id,
    name: item.name,
    quantity,
    unitPrice: item.price,
    lineTotal,
  }));
  return {
    version: VERSION,
    reference,
    restaurantId: restaurant.id,
    restaurantSlug: restaurant.slug,
    restaurantName: restaurant.name,
    dishes: items,
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
    partySize: fields.partySize,
    date: fields.date,
    time: fields.time,
    contact: {
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validSnapshot(value: unknown, slug: string): value is ConfirmationSnapshot {
  if (!isRecord(value) || value.version !== VERSION ||
    typeof value.restaurantId !== "string" ||
    typeof value.restaurantSlug !== "string" ||
    value.restaurantSlug !== slug ||
    typeof value.restaurantName !== "string" ||
    typeof value.reference !== "string" ||
    !/^OMF-[A-Z0-9]{5}$/.test(value.reference) ||
    !Array.isArray(value.dishes) ||
    value.dishes.length === 0 ||
    typeof value.subtotal !== "number" ||
    !Number.isSafeInteger(value.subtotal) ||
    typeof value.partySize !== "number" ||
    !Number.isInteger(value.partySize) ||
    value.partySize < 1 || value.partySize > 8 ||
    typeof value.date !== "string" || !isCalendarDate(value.date) ||
    typeof value.time !== "string" || !/^\d{2}:\d{2}$/.test(value.time) ||
    !isRecord(value.contact)) return false;

  const restaurant = restaurantById(value.restaurantId);
  if (!restaurant || restaurant.slug !== slug || restaurant.name !== value.restaurantName) return false;
  const knownItems = new Map(restaurant.menu.flatMap((section) => section.items).map((item) => [item.id, item]));
  if (!value.dishes.every((dish) => {
    if (!isRecord(dish) || typeof dish.itemId !== "string" ||
      typeof dish.name !== "string" || typeof dish.quantity !== "number" ||
      typeof dish.unitPrice !== "number" || typeof dish.lineTotal !== "number") return false;
    const item = knownItems.get(dish.itemId);
    return item?.name === dish.name && item.price === dish.unitPrice &&
      Number.isInteger(dish.quantity) && dish.quantity >= 1 && dish.quantity <= 99 &&
      dish.lineTotal === dish.unitPrice * dish.quantity;
  })) return false;
  const total = value.dishes.reduce<number>((sum, dish) => sum + (dish as ConfirmationDish).lineTotal, 0);
  if (total !== value.subtotal) return false;
  const contact = value.contact;
  return typeof contact.firstName === "string" && !!contact.firstName.trim() &&
    typeof contact.lastName === "string" && !!contact.lastName.trim() &&
    typeof contact.email === "string" && !!contact.email.trim() &&
    typeof contact.phone === "string" && !!contact.phone.trim();
}

export function saveConfirmation(
  snapshot: ConfirmationSnapshot,
  storage: ConfirmationStorage | undefined,
): boolean {
  if (!storage || !validSnapshot(snapshot, snapshot.restaurantSlug)) return false;
  try {
    storage.setItem(CONFIRMATION_STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

export function readConfirmation(
  storage: ConfirmationStorage | undefined,
  slug: string,
): ConfirmationSnapshot | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(CONFIRMATION_STORAGE_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    return validSnapshot(value, slug) ? value : null;
  } catch {
    return null;
  }
}
