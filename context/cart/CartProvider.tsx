import { FC, useEffect, useReducer } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import {
  ICartProduct,
  IOrder,
  IOrderSummary,
  IShippingAddress,
} from "../../interfaces";
import { CartContext, cartReducer } from "./";
import { cookies } from "../../utils";
import { tesloApi } from "../../api";

export interface CartState {
  cart: ICartProduct[];
  orderSummary: IOrderSummary;
  isLoaded: boolean;
  shippingAddress?: IShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  isLoaded: false,
  orderSummary: {
    numberOfItems: 0,
    tax: 0,
    subTotal: 0,
    total: 0,
  },

  shippingAddress: undefined,
};

interface CartProviderProps {
  children: JSX.Element;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cart = !!Cookies.get("cart")
        ? JSON.parse(Cookies.get("cart")!)
        : [];

      dispatch({
        type: "Cart - LoadCard from cookies | storage",
        payload: cart,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "Cart - LoadCard from cookies | storage",
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    if (Cookies.get("firstName") === undefined) return;

    const shippingAddress = cookies.getAddressFromCookies();
    dispatch({
      type: "Cart - Update Shipping Address",
      payload: shippingAddress,
    });
  }, []);

  useEffect(() => {
    if (!state.isLoaded) return;
    const newCart = JSON.stringify(state.cart);
    Cookies.set("cart", newCart);
  }, [state.cart, state.isLoaded]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );

    const subTotal = state.cart.reduce(
      (prev, current) => current.quantity * current.price + prev,
      0
    );

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    };

    dispatch({ type: "Cart - Update Order Summary", payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );

    if (!productInCart)
      return dispatch({
        type: "Cart - Update Products in Cart",
        payload: [...state.cart, product],
      });

    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      p.quantity += product.quantity;
      return p;
    });

    dispatch({
      type: "Cart - Update Products in Cart",
      payload: updatedProducts,
    });
  };

  /**
   * Used with item counter
   * @param product
   */
  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "Cart - Change Product Quantity", payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: "Cart - Remove Product", payload: product });
  };

  const updateAddress = (address: IShippingAddress) => {
    cookies.setAddressInCookies(address);

    dispatch({ type: "Cart - Update Shipping Address", payload: address });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) throw new Error("There is no shipping address");

    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.orderSummary.numberOfItems,
      subTotal: state.orderSummary.subTotal,
      tax: state.orderSummary.tax,
      total: state.orderSummary.total,
      isPaid: false,
    };

    try {
      const { data } = await tesloApi.post<IOrder>("/orders", body);

      dispatch({ type: "Cart - Clear Cart" });

      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: (error.response?.data as any).message,
        };
      }

      return {
        hasError: true,
        message: "Uncontroled error, contact the admin",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        //  Methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,

        // Orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
