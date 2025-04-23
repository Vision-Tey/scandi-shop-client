// state/StateProvider.tsx
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

// State shape
export interface State {
  cart: any[];
  user: any | null;
  orders: any[];
  showCart: boolean;
  products: any[];
  categories: any[];
  active: string;
}

// Action types
export type Action =
  | { type: "SET_PRODUCTS"; products: any[] }
  | { type: "SET_CATEGORIES"; categories: any[] }
  | { type: "TOGGLE_CART" }
  | { type: "SET_USER"; user: any }
  | { type: "SUBMIT_ORDER"; orders: any[] }
  | { type: "ADD_TO_CART"; id: string; item: any }
  | { type: "REMOVE_FROM_CART"; id: string }
  | {
      type: "UPDATE_CART_ITEM";
      id: string;
      size: any;
      capacity: any;
      ports: any;
      touchIdKeyboard: any;
      attributes: any;
      color: any;
      quantity: number;
    }
  | { type: "EMPTY_CART" }
  | { type: "SET_ACTIVE_CATEGORY"; active: string };

interface StateContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

export const StateContext = createContext<StateContextType | undefined>(undefined);

interface StateProviderProps {
  reducer: (state: State, action: Action) => State;
  initialState: State;
  children: ReactNode;
}

// Provider component
export const StateProvider = ({ reducer, initialState, children }: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

// Hook to use context
export const useStateValue = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateValue must be used within a StateProvider");
  }
  return context;
};
