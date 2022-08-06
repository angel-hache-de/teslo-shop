import { createContext } from "react";
import {
  ICartProduct,
  IOrderSummary,
  IShippingAddress,
} from "../../interfaces";

interface ContextProps {
  cart: ICartProduct[];
  isLoaded: boolean;
  orderSummary: IOrderSummary;

  shippingAddress?: IShippingAddress;

  // methods
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: IShippingAddress) => void;

  // orders
  createOrder: () => Promise<{
    hasError: boolean;
    message: string;
  }>;
}

export const CartContext = createContext({} as ContextProps);
