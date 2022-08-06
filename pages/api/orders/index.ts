import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order, Product } from "../../../models";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}
const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  //   Verificar el auth
  const session = await getSession({ req });

  if (!session)
    return res.status(401).json({ message: "You must be authenticated" });

  // Build array with products
  const productsIds = orderItems.map((product) => product._id);

  try {
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (prod) => prod.id === current._id
      )?.price;
      if (!currentPrice)
        throw new Error("CUSTOM-Something is wrong with the cart");

      return current.quantity * current.price + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const estimatedTotal = subTotal * (taxRate + 1);

    if (total !== estimatedTotal)
      throw new Error("CUSTOM-Total does not match with the prices");

    const userId = (session.user as any)._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    newOrder.total = Math.round(newOrder.total * 100) / 100;

    await newOrder.save();
    await db.disconnect();

    return res.status(201).json({ message: "Hello World" });
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    let message = "Internal server error";
    let code = 500;

    if ((error.message as string).startsWith("CUSTOM-")) {
      message = error.message.split("-")[1];
      code = 400;
    }

    return res.status(code).json({ message });
  }
};
