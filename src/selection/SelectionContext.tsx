import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import {
  selectionReducer,
  type SelectionAction,
  type SelectionState,
} from "./selection";
import { browserSelectionStorage, persistSelection, readStoredSelection } from "./storage";

interface SelectionContextValue {
  state: SelectionState;
  dispatch: React.Dispatch<SelectionAction>;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    selectionReducer,
    undefined,
    () => readStoredSelection(browserSelectionStorage()),
  );

  useEffect(() => {
    persistSelection(state, browserSelectionStorage());
  }, [state]);
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
