import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IProduct;

export default function hanlder(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProduct(req, res);
    default:
      res.status(400).json({ message: "Bad request" });
  }
}

const getProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug } = req.query;

  await db.connect();

  const product = await Product.findOne({ slug }).lean();

  if (!product) return res.status(404).json({ message: "Product not found" });

  await db.disconnect();

  product.images = product.images.map((image) => {
    return image.includes("http")
      ? image
      : `${process.env.HOST_NAME}/products/${image}`;
  });

  return res.status(200).json(product);
};
