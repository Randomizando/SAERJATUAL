import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== `PUT`) {
    const MessageErrorMethodInvalid = `Error method invalid`;
    return res.status(405).json({ message: `${MessageErrorMethodInvalid}` });
  }

  const data = req.body;
  // console.log(data.data.fileName)
  try {
    if (data && data.data && data.data.fileName !== undefined) {
      const checkAnexo = data.data.fileName.split("_")[1][0];
      
      console.log(checkAnexo);

      if (checkAnexo === '0') {
        await prisma.protocolos.update({
          where: { id: Number(data.data.id) },
          data: {
            anexos: null
          },
        });
        return res.status(200).end();
      } else if (checkAnexo === '1') {
        await prisma.protocolos.update({
          where: { id: Number(data.data.id) },
          data: {
            anexos2: null
          },
        });
        return res.status(200).end();
      }
    } else {
      await prisma.protocolos.update({
        where: { id: Number(data.id) },
        data: {
          ...data,
        },
      });
      return res.status(200).end();
    }
  } catch (error) {
    console.log(error);
    const MessageError = `Error connect db`;
    return res.status(500).json({ message: `${MessageError}`, error });
  }
}