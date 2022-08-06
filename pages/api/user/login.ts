import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

import { db } from "../../../database";
import { User } from "../../../models";
import { jwt } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
        role: string;
        name: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return loginUser(req, res);
    default:
      res.status(400).json({
        message: "Bad request",
      });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "" } = req.body;

  if (email.trim().length === 0 || password.trim().length === 0)
    res.status(400).json({
      message: "Provide user and email",
    });

  await db.connect();

  const user = await User.findOne({ email });
  await db.disconnect();

  if (!user)
    res.status(400).json({
      message: "Invalid credentials",
    });

  if (!bcrypt.compareSync(password, user!.password!))
    res.status(400).json({
      message: "Invalid credentials",
    });

  const { role, name, _id } = user!;

  const token = jwt.signToken(_id, email);

  res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  });
};
