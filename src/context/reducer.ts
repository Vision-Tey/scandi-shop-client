import {
    ADD_TO_CART,
    EMPTY_CART,
    REMOVE_FROM_CART,
    SET_CATEGORIES,
    SET_PRODUCTS,
    SET_USER,
    SUBMIT_ORDER,
    TOGGLE_CART,
    UPDATE_CART_ITEM,
    SET_ACTIVE_CATEGORY
  } from "../constants/constants";
  
  // --- Type Definitions ---
  
  export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    capacity?: string;
    ports?: string;
    touchIdKeyboard?: string;
    attributes?: any[];
    image?: string;
    description?: string;
    category?: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    price: number;
    // Add other product properties as needed
  }
  
  export interface Category {
    name: string;
  }
  
  export interface User {
    id: string;
    name: string;
    // Add more user fields as necessary
  }
  
  export interface Order {
    id: string;
    products: CartItem[];
    total: number;
    // Add other order details as needed
  }
  
  export interface State {
    cart: CartItem[];
    user: User | null;
    orders: Order[];
    showCart: boolean;
    products: Product[];
    categories: Category[];
    active: string;
  }
  
  export const initialState: State = {
    cart: [],
    user: null,
    orders: [],
    showCart: false,
    products: [],
    categories: [],
    active: "all",
  };
  
  // --- Action Types ---
  
  type Action =
    | { type: typeof SET_PRODUCTS; products: Product[] }
    | { type: typeof SET_CATEGORIES; categories: Category[] }
    | { type: typeof TOGGLE_CART }
    | { type: typeof SET_USER; user: User }
    | { type: typeof SUBMIT_ORDER; orders: Order[] }
    | { type: typeof ADD_TO_CART; item: CartItem }
    | { type: typeof REMOVE_FROM_CART; id: string }
    | {
        type: typeof UPDATE_CART_ITEM;
        id: string;
        size?: string;
        color?: string;
        quantity: number;
        capacity?: string;
        ports?: string;
        touchIdKeyboard?: string;
        attributes?: any[];
      }
    | { type: typeof EMPTY_CART }
    | { type: typeof SET_ACTIVE_CATEGORY; active: string };
  
  // --- Cart Total Function ---
  
  export const getCartTotal = (cart: CartItem[]) =>
    cart?.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // --- Reducer ---
  
  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case SET_PRODUCTS:
        return {
          ...state,
          products: action.products,
        };
  
      case SET_CATEGORIES:
        return {
          ...state,
          categories: action.categories,
        };
  
      case TOGGLE_CART:
        return {
          ...state,
          showCart: !state.showCart,
        };
  
      case SET_USER:
        return {
          ...state,
          user: action.user,
        };
  
      case SUBMIT_ORDER:
        return {
          ...state,
          orders: action.orders,
        };
  
      case ADD_TO_CART:
        return {
          ...state,
          cart: [...state.cart, action.item],
        };
  
      case REMOVE_FROM_CART: {
        const newCart = [...state.cart];
        const index = newCart.findIndex((item) => item.id === action.id);
        if (index >= 0) {
          newCart.splice(index, 1);
        } else {
          console.warn(`Can't remove product (id: ${action.id}) as it's not in cart!`);
        }
        return {
          ...state,
          cart: newCart,
        };
      }

      case UPDATE_CART_ITEM:
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.id &&
            item.size === action.size &&
            item.color === action.color &&
            item.capacity === action.capacity &&
            item.ports === action.ports &&
            item.touchIdKeyboard === action.touchIdKeyboard &&
            item.attributes === action.attributes
              ? { ...item, quantity: action.quantity }
              : item
            
          ),
        };
  
      case EMPTY_CART:
        return {
          ...state,
          cart: [],
        };

      case SET_ACTIVE_CATEGORY:
        return {
          ...state,
          active: action.active,
        };
  
      default:
        return state;
    }
  };
  
  export default reducer;
  