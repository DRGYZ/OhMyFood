import { describe, expect, it } from "vitest";
import { restaurantById } from "../data/restaurants";
import { initialSelection, selectionReducer, summarizeSelection } from "../selection/selection";
import {
  CONFIRMATION_STORAGE_KEY,
  createConfirmationSnapshot,
  readConfirmation,
  saveConfirmation,
  type ConfirmationStorage,
} from "./confirmation";
import type { ReservationFields } from "./validation";

function memoryStorage(): ConfirmationStorage {
  const items = new Map<string, string>();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => { items.set(key, value); },
  };
}

const fields: ReservationFields = {
  partySize: 2, date: "2026-09-20", time: "19:30",
  firstName: "  Yazan ", lastName: " Test ",
  email: " yazan@example.com ", phone: " 06 12 34 56 78 ",
};

describe("confirmation snapshot", () => {
  it("captures menu totals independently and saves/reads for the matching route", () => {
    const restaurant = restaurantById("palette")!;
    const first = restaurant.menu[0].items[0];
    const second = restaurant.menu[0].items[1];
    let selection = selectionReducer(initialSelection, {
      type: "add", restaurantId: restaurant.id, itemId: first.id,
    });
    selection = selectionReducer(selection, {
      type: "add", restaurantId: restaurant.id, itemId: second.id,
    });
    selection = selectionReducer(selection, {
      type: "add", restaurantId: restaurant.id, itemId: second.id,
    });
    const summary = summarizeSelection(selection, restaurant.id, restaurant.menu);
    const snapshot = createConfirmationSnapshot(restaurant, summary.dishes, fields);
    expect(snapshot.subtotal).toBe(first.price + second.price * 2);
    expect(snapshot.dishes.map(({ quantity }) => quantity)).toEqual([1, 2]);
    expect(snapshot.contact.firstName).toBe("Yazan");
    const storage = memoryStorage();
    expect(saveConfirmation(snapshot, storage)).toBe(true);
    expect(readConfirmation(storage, restaurant.slug)).toEqual(snapshot);
    expect(readConfirmation(storage, "la-note-enchantee")).toBeNull();
    expect(selectionReducer(selection, { type: "clear" })).toEqual(initialSelection);
    expect(readConfirmation(storage, restaurant.slug)).toEqual(snapshot);
  });

  it("rejects corrupt, mismatched and inaccessible storage", () => {
    const storage = memoryStorage();
    storage.setItem(CONFIRMATION_STORAGE_KEY, "{broken");
    expect(readConfirmation(storage, "la-palette-du-gout")).toBeNull();
    const restaurant = restaurantById("palette")!;
    const dish = restaurant.menu[0].items[0];
    const snapshot = createConfirmationSnapshot(restaurant, [{
      item: dish, quantity: 1, lineTotal: dish.price,
    }], fields);
    storage.setItem(CONFIRMATION_STORAGE_KEY, JSON.stringify({
      ...snapshot, restaurantSlug: "la-note-enchantee",
    }));
    expect(readConfirmation(storage, restaurant.slug)).toBeNull();
    storage.setItem(CONFIRMATION_STORAGE_KEY, JSON.stringify({
      ...snapshot, subtotal: snapshot.subtotal + 1,
    }));
    expect(readConfirmation(storage, restaurant.slug)).toBeNull();
    expect(readConfirmation(undefined, restaurant.slug)).toBeNull();
    expect(saveConfirmation(snapshot, undefined)).toBe(false);
  });
});
