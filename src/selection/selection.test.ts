import { describe, expect, it } from "vitest";
import { menus } from "../restaurant/menus";
import { initialSelection, selectionReducer, selectionStatus, summarizeSelection } from "./selection";

const first = menus.palette[0].items[0];
const second = menus.palette[0].items[1];

describe("menu selection", () => {
  it("adds a dish and increments its quantity", () => {
    const once = selectionReducer(initialSelection, { type: "add", restaurantId: "palette", itemId: first.id });
    const twice = selectionReducer(once, { type: "add", restaurantId: "palette", itemId: first.id });
    expect(twice.quantities[first.id]).toBe(2);
    expect(summarizeSelection(twice, "palette", menus.palette)).toMatchObject({
      itemCount: 2,
      subtotal: first.price * 2,
    });
  });

  it("removes one unit and deletes the final unit", () => {
    let state = selectionReducer(initialSelection, { type: "setQuantity", restaurantId: "palette", itemId: first.id, quantity: 2 });
    // A quantity change alone cannot create a selection for a different table.
    expect(state).toEqual(initialSelection);
    state = selectionReducer(initialSelection, { type: "add", restaurantId: "palette", itemId: first.id });
    state = selectionReducer(state, { type: "add", restaurantId: "palette", itemId: first.id });
    state = selectionReducer(state, { type: "remove", restaurantId: "palette", itemId: first.id });
    expect(state.quantities[first.id]).toBe(1);
    state = selectionReducer(state, { type: "remove", restaurantId: "palette", itemId: first.id });
    expect(state).toEqual(initialSelection);
  });

  it("derives subtotal from different selected dishes", () => {
    let state = selectionReducer(initialSelection, { type: "add", restaurantId: "palette", itemId: first.id });
    state = selectionReducer(state, { type: "add", restaurantId: "palette", itemId: second.id });
    state = selectionReducer(state, { type: "setQuantity", restaurantId: "palette", itemId: second.id, quantity: 3 });
    expect(summarizeSelection(state, "palette", menus.palette)).toMatchObject({
      itemCount: 4,
      subtotal: first.price + second.price * 3,
    });
  });

  it("guards cross-restaurant additions until replacement is confirmed", () => {
    const previous = selectionReducer(initialSelection, {
      type: "add", restaurantId: "palette", itemId: first.id,
    });
    const newItemId = menus.note[0].items[0].id;
    const refused = selectionReducer(previous, {
      type: "add", restaurantId: "note", itemId: newItemId,
    });
    expect(refused).toBe(previous);
    const replaced = selectionReducer(refused, {
      type: "replace", restaurantId: "note", itemId: newItemId,
    });
    expect(replaced).toEqual({
      restaurantId: "note", quantities: { [newItemId]: 1 },
    });
    expect(selectionReducer(replaced, { type: "clear" })).toEqual(initialSelection);
  });

  it("ignores unknown dishes and restaurants", () => {
    expect(selectionReducer(initialSelection, {
      type: "add", restaurantId: "palette", itemId: "missing",
    })).toEqual(initialSelection);
    expect(selectionReducer(initialSelection, {
      type: "add", restaurantId: "missing", itemId: first.id,
    })).toEqual(initialSelection);
  });

  it("announces the resulting quantity after repeated changes", () => {
    expect(selectionStatus(first.name, 1)).toContain("1 portion");
    expect(selectionStatus(first.name, 2)).toContain("2 portions");
    expect(selectionStatus(first.name, 0)).toContain("retiré");
  });
});
