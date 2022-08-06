import type { NextApiRequest, NextApiResponse } from "next";
import { db, seedDatabase } from "../../database";

import { Product, User } from "../../models";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === "production")
    return res.status(401).json({ message: "Unauthorized" });

  await db.connect();
  await Product.deleteMany({});
  await User.deleteMany({});
  await Product.insertMany(seedDatabase.initialData.products);
  await User.insertMany(seedDatabase.initialData.users);

  return res.status(200).json({ message: "Successfuly done" });
}
