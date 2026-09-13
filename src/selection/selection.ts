import type { MenuItem, MenuSection } from "../restaurant/types";

export interface SelectionState {
  restaurantId: string | null;
  quantities: Record<string, number>;
}

export type SelectionAction =
  | { type: "add"; restaurantId: string; itemId: string }
  | { type: "remove"; restaurantId: string; itemId: string }
  | { type: "setQuantity"; restaurantId: string; itemId: string; quantity: number }
  | { type: "clear" };

export const initialSelection: SelectionState = {
  restaurantId: null,
  quantities: {},
};

export function selectionReducer(
  state: SelectionState,
  action: SelectionAction,
): SelectionState {
  if (action.type === "clear") return initialSelection;

  if (action.type === "add") {
    const quantities = state.restaurantId === action.restaurantId
      ? state.quantities
      : {};
    return {
      restaurantId: action.restaurantId,
      quantities: {
        ...quantities,
        [action.itemId]: (quantities[action.itemId] ?? 0) + 1,
      },
    };
  }

  if (state.restaurantId !== action.restaurantId) return state;
  const current = state.quantities[action.itemId] ?? 0;
  const next = action.type === "remove"
    ? current - 1
    : Math.max(0, Math.floor(Number.isFinite(action.quantity) ? action.quantity : 0));
  if (next === current) return state;

  const quantities = { ...state.quantities };
  if (next <= 0) {
    delete quantities[action.itemId];
  } else {
    quantities[action.itemId] = next;
  }
  return {
    restaurantId: Object.keys(quantities).length ? state.restaurantId : null,
    quantities,
  };
}

export interface SelectedDish {
  item: MenuItem;
  quantity: number;
  lineTotal: number;
}

export function summarizeSelection(
  state: SelectionState,
  restaurantId: string,
  menu: MenuSection[],
) {
  if (state.restaurantId !== restaurantId) {
    return { dishes: [] as SelectedDish[], itemCount: 0, subtotal: 0 };
  }

  const dishes = menu.flatMap((section) => section.items)
    .flatMap((item) => {
      const quantity = state.quantities[item.id] ?? 0;
      return quantity > 0 ? [{ item, quantity, lineTotal: item.price * quantity }] : [];
    });
  return {
    dishes,
    itemCount: dishes.reduce((sum, dish) => sum + dish.quantity, 0),
    subtotal: dishes.reduce((sum, dish) => sum + dish.lineTotal, 0),
  };
}
