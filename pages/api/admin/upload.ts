import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
// import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data = {
  message: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return updaloadFile(req, res);
    default:
      res.status(400).json({ message: "Bad request" });
  }
}

// MANERA NO RECOMENDADA Y QUE NO DEBEMOS USAR

// const saveFile = (file: formidable.File) => {
//   const data = fs.readFileSync(file.filepath);
//   fs.writeFileSync(`./public/${file.originalFilename}`, data);

//   fs.unlinkSync(file.filepath);
//   return;
// };

const parseFiles = (req: NextApiRequest): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);

      const url = await saveFile(files.file as formidable.File);
      resolve(url);
    });
  });
};

const saveFile = async (file: formidable.File): Promise<string | null> => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(file.filepath);
    return secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updaloadFile = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const imageURL = await parseFiles(req);
    if (!imageURL)
      return res
        .status(500)
        .json({ message: "Internal error while uploading image" });

    res.status(201).json({ message: imageURL });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal error while uploading image" });
  }
};
