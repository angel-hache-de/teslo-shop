import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order, Product, User } from "../../../models";

type Data =
  | {
      message: string;
    }
  | {
      numberOfOrders: number;
      paidOrders: number;
      notPaidOrders: number;
      numberOfClients: number;
      numberOfProducts: number;
      productsWithNoInventory: number;
      lowInvetory: number;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await db.connect();

    const [
      numberOfOrders,
      paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWithNoInventory,
      lowInvetory,
    ] = await Promise.all([
      Order.count(),
      Order.find({ isPaid: true }).count(),
      User.find({ role: "client" }).count(),
      Product.count(),
      Product.find({ inStock: 0 }).count(),
      Product.find({ inStock: { $lte: 10 } }).count(),
    ]);

    await db.disconnect();

    res.status(200).json({
      numberOfOrders,
      paidOrders,
      notPaidOrders: numberOfOrders - paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWithNoInventory,
      lowInvetory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
