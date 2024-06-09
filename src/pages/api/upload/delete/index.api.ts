import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

interface Body {
  fileName: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== `DELETE`) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fileName }: Body = req.body;

  if (!fileName) {
    return res.status(417).json({ message: 'File name is required' });
  }

  const annexUploadPath = path.join(
    process.cwd(),
    'public/upload',
    fileName,
  );

  fs.unlink(annexUploadPath, (err) => {
    if (err) {
      return res.status(500).json({
        message: err.message
      });
    }
    return res.status(200).json({ message: 'File deleted' });
  });
}
