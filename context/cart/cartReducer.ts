import {
  ICartProduct,
  IOrderSummary,
  IShippingAddress,
} from "../../interfaces";
import { CartState } from "./";

type CartActionType =
  | {
      type: "Cart - LoadCard from cookies | storage";
      payload: ICartProduct[];
    }
  | {
      type: "Cart - Update Products in Cart";
      payload: ICartProduct[];
    }
  | {
      type: "Cart - Change Product Quantity";
      payload: ICartProduct;
    }
  | {
      type: "Cart - Remove Product";
      payload: ICartProduct;
    }
  | {
      type: "Cart - Update Order Summary";
      payload: IOrderSummary;
    }
  | {
      type: "Cart - Update Shipping Address";
      payload: IShippingAddress;
    }
  | {
      type: "Cart - Clear Cart";
    };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "Cart - LoadCard from cookies | storage":
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case "Cart - Update Products in Cart":
      return {
        ...state,
        cart: [...action.payload],
      };
    case "Cart - Change Product Quantity":
      return {
        ...state,
        cart: state.cart.map((p) => {
          if (p._id !== action.payload._id) return p;
          if (p.size !== action.payload.size) return p;

          return action.payload;
        }),
      };
    case "Cart - Remove Product":
      return {
        ...state,
        cart: state.cart.filter(
          (p) => p._id !== action.payload._id || p.size !== action.payload.size
        ),
      };
    case "Cart - Update Order Summary":
      return {
        ...state,
        orderSummary: { ...action.payload },
      };
    case "Cart - Update Shipping Address":
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case "Cart - Clear Cart":
      return {
        ...state,
        cart: [],
        orderSummary: {
          numberOfItems: 0,
          subTotal: 0,
          tax: 0,
          total: 0,
        },
      };
    default:
      return state;
  }
};
