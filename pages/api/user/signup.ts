import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

import { db } from "../../../database";
import { User } from "../../../models";
import { jwt, validations } from "../../../utils";

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
      return registerUser(req, res);
    default:
      res.status(400).json({
        message: "Bad request",
      });
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { email = "", password = "", name = "" } = req.body;

  if (name.length < 2)
    res.status(400).json({
      message: "Name min length is 2",
    });

  if (password.length < 6)
    res.status(400).json({
      message: "Passowrd min lenth is 6",
    });

  if (!validations.isValidEmail(email))
    res.status(400).json({
      message: "Invalid email",
    });

  await db.connect();
  const user = await User.findOne({ email });

  if (user)
    res.status(400).json({
      message: "Email alredy in use",
    });

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    role: "client",
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
    await db.disconnect();
  } catch (error) {
    console.log("---------ERROR---------");
    console.log(error);
    return res.status(500).json({
      message: "Internal error",
    });
  }
  const { _id } = newUser;

  const token = jwt.signToken(_id, email);

  res.status(200).json({
    token,
    user: {
      email,
      role: "client",
      name,
    },
  });
};
