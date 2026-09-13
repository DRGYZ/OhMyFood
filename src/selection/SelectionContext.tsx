import { createContext, useContext, useReducer, type ReactNode } from "react";
import {
  initialSelection,
  selectionReducer,
  type SelectionAction,
  type SelectionState,
} from "./selection";

interface SelectionContextValue {
  state: SelectionState;
  dispatch: React.Dispatch<SelectionAction>;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(selectionReducer, initialSelection);
  return (
    <SelectionContext.Provider value={{ state, dispatch }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const value = useContext(SelectionContext);
  if (!value) throw new Error("SelectionProvider is missing");
  return value;
}
