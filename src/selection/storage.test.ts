import { describe, expect, it } from "vitest";
import { menus } from "../restaurant/menus";
import { initialSelection } from "./selection";
import {
  persistSelection,
  readStoredSelection,
  SELECTION_STORAGE_KEY,
  type SelectionStorage,
} from "./storage";

function memoryStorage(): SelectionStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: (key) => { values.delete(key); },
  };
}

const firstId = menus.palette[0].items[0].id;

describe("selection persistence", () => {
  it("hydrates a valid single-restaurant selection", () => {
    const storage = memoryStorage();
    storage.setItem(SELECTION_STORAGE_KEY, JSON.stringify({
      version: 2, restaurantId: "palette", quantities: { [firstId]: 2 },
    }));
    expect(readStoredSelection(storage)).toEqual({
      restaurantId: "palette", quantities: { [firstId]: 2 },
    });
  });

  it("ignores corrupted JSON and unknown restaurants", () => {
    const storage = memoryStorage();
    storage.setItem(SELECTION_STORAGE_KEY, "{broken");
    expect(readStoredSelection(storage)).toEqual(initialSelection);
    storage.setItem(SELECTION_STORAGE_KEY, JSON.stringify({
      version: 2, restaurantId: "old-table", quantities: { [firstId]: 1 },
    }));
    expect(readStoredSelection(storage)).toEqual(initialSelection);
  });

  it("ignores unknown dishes while preserving valid ones", () => {
    const storage = memoryStorage();
    storage.setItem(SELECTION_STORAGE_KEY, JSON.stringify({
      version: 2,
      restaurantId: "palette",
      quantities: { [firstId]: 2, "retired-dish": 5 },
    }));
    expect(readStoredSelection(storage)).toEqual({
      restaurantId: "palette", quantities: { [firstId]: 2 },
    });
  });

  it("rejects malformed quantities and old storage versions", () => {
    const storage = memoryStorage();
    storage.setItem(SELECTION_STORAGE_KEY, JSON.stringify({
      version: 2, restaurantId: "palette", quantities: { [firstId]: -1 },
    }));
    expect(readStoredSelection(storage)).toEqual(initialSelection);
    storage.setItem(SELECTION_STORAGE_KEY, JSON.stringify({
      version: 1, restaurantId: "palette", quantities: { [firstId]: 1 },
    }));
    expect(readStoredSelection(storage)).toEqual(initialSelection);
  });

  it("writes valid state and removes storage after clear", () => {
    const storage = memoryStorage();
    persistSelection({ restaurantId: "palette", quantities: { [firstId]: 3 } }, storage);
    expect(readStoredSelection(storage).quantities[firstId]).toBe(3);
    persistSelection(initialSelection, storage);
    expect(storage.getItem(SELECTION_STORAGE_KEY)).toBeNull();
  });

  it("does not throw when storage is unavailable", () => {
    const storage: SelectionStorage = {
      getItem: () => { throw new Error("blocked"); },
      setItem: () => { throw new Error("blocked"); },
      removeItem: () => { throw new Error("blocked"); },
    };
    expect(readStoredSelection(storage)).toEqual(initialSelection);
    expect(() => persistSelection(initialSelection, storage)).not.toThrow();
  });
});
