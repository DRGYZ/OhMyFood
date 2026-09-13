import { restaurantById } from "../data/restaurants";
import {
  initialSelection,
  MAX_QUANTITY,
  type SelectionState,
} from "./selection";

export const SELECTION_STORAGE_KEY = "omf_selection_v2";
const STORAGE_VERSION = 2;

export interface SelectionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function browserSelectionStorage(): SelectionStorage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function validSelection(value: unknown): SelectionState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return initialSelection;
  }

  const record = value as Record<string, unknown>;
  if (
    record.version !== STORAGE_VERSION ||
    typeof record.restaurantId !== "string"
  ) {
    return initialSelection;
  }
  const restaurant = restaurantById(record.restaurantId);
  if (
    !restaurant ||
    !record.quantities ||
    typeof record.quantities !== "object" ||
    Array.isArray(record.quantities)
  ) {
    return initialSelection;
  }

  const validItems = new Set(
    restaurant.menu.flatMap((section) => section.items.map((item) => item.id)),
  );
  const quantities: Record<string, number> = {};
  for (const [itemId, quantity] of Object.entries(record.quantities)) {
    if (
      validItems.has(itemId) &&
      typeof quantity === "number" &&
      Number.isSafeInteger(quantity) &&
      quantity > 0 &&
      quantity <= MAX_QUANTITY
    ) {
      quantities[itemId] = quantity;
    }
  }

  return Object.keys(quantities).length
    ? { restaurantId: restaurant.id, quantities }
    : initialSelection;
}

export function readStoredSelection(storage: SelectionStorage | undefined): SelectionState {
  if (!storage) return initialSelection;
  try {
    const raw = storage.getItem(SELECTION_STORAGE_KEY);
    return raw ? validSelection(JSON.parse(raw)) : initialSelection;
  } catch {
    return initialSelection;
  }
}

export function persistSelection(
  state: SelectionState,
  storage: SelectionStorage | undefined,
): void {
  if (!storage) return;
  try {
    const valid = validSelection({ version: STORAGE_VERSION, ...state });
    if (!valid.restaurantId) {
      storage.removeItem(SELECTION_STORAGE_KEY);
    } else {
      storage.setItem(
        SELECTION_STORAGE_KEY,
        JSON.stringify({ version: STORAGE_VERSION, ...valid }),
      );
    }
  } catch {
    // Storage may be unavailable or full; selection still works for this visit.
  }
}
