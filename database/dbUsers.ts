import bcrypt from "bcryptjs";
import { User } from "../models";
import { db } from "./";

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  try {
    await db.connect();

    const user = await User.findOne({ email });
    await db.disconnect();

    if (!user) return null;

    if (!bcrypt.compareSync(password, user.password!)) return null;

    const { name, role, _id } = user;

    return {
      _id,
      email: email.toLocaleLowerCase(),
      role,
      name,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Create/Verify the incoming oauth user
 */
export const oAuthDbUser = async (oAuthEmail: string, oAuthName: string) => {
  try {
    await db.connect();
    const user = await User.findOne({ email: oAuthEmail });

    if (user) {
      await db.disconnect();
      const { _id, name, email, role } = user;
      return { _id, name, email, role };
    }

    const newUser = new User({
      email: oAuthEmail,
      name: oAuthName,
      password: "@",
      role: "client",
    });

    await newUser.save();
    await db.disconnect();

    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };
  } catch (error) {
    console.log(error);
    return null;
  }
};
