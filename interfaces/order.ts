import { IUser, IShippingAddress } from "./";

export interface IOrderSummary {
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

export interface IOrder extends IOrderSummary {
  _id?: string;
  user?: IUser | string;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentResult?: string;
  isPaid: boolean;
  paidAt?: string;

  transactionId?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface IOrderItem {
  _id: string;
  title: string;
  size: string;
  quantity: number;
  slug: string;
  image: string;
  gender: string;
  price: number;
}
