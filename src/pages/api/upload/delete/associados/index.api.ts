import { prisma } from "@/lib/prisma";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

interface Fields {
  id: string;
  fileName: string;
  fieldName: string;
}

export default async function DeleteFiles(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== `POST`) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, fileName, fieldName } = req.body as Fields;

  if (!id) {
    return res.status(400).json({ message: 'ID não encontrado' });
  }

  if (!fileName || !fieldName) {
    return res.status(417).json({ message: 'File name is required' });
  }

  const annexUploadPath = path.join(
    process.cwd(),
    'public/upload',
    fileName,
  );

  try {
    fs.rm(annexUploadPath, (err) => {

    });

    await prisma.associados.update({
      where: {
        id: Number(id),
      },
      data: {
        [fieldName]: ''
      }
    });

    return res.status(200).json({ message: 'File deleted' });
  } catch (error) {

    return res.status(500).json({ message: 'Error on delete file' });
  }
}