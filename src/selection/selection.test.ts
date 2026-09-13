import { describe, expect, it } from "vitest";
import { menus } from "../restaurant/menus";
import { initialSelection, selectionReducer, summarizeSelection } from "./selection";

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

  it("keeps one restaurant selection at a time and clears it", () => {
    let state = selectionReducer(initialSelection, { type: "add", restaurantId: "palette", itemId: first.id });
    state = selectionReducer(state, { type: "add", restaurantId: "note", itemId: menus.note[0].items[0].id });
    expect(summarizeSelection(state, "palette", menus.palette).itemCount).toBe(0);
    expect(state.restaurantId).toBe("note");
    expect(selectionReducer(state, { type: "clear" })).toEqual(initialSelection);
  });
});
