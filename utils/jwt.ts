import jwt from "jsonwebtoken";

export const signToken = (id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED)
    throw new Error("There is not jwt seed -- Check env variables");

  return jwt.sign(
    // payload
    {
      id,
      email,
    },
    // Seed
    process.env.JWT_SECRET_SEED,
    // Options
    {
      expiresIn: "30d",
    }
  );
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED)
    throw new Error("There is no seed for jwt -- check env variables");

  if (token.length < 10) return Promise.reject("Invalid JWT");

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || "", (err, payload) => {
        if (err) return reject("Invalid jwt");

        const { id } = payload as { id: string };

        resolve(id);
      });
    } catch (error) {
      console.log("-----ERROR-----");
      console.log(error);
      reject("Invalid jwt");
    }
  });
};
