// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Error method invalid' });
  }

  const { id, ...data } = req.body;

  try {
    await prisma.adicionais_SAERJ.update({
      where: {
        id: id,
      },
      data
    });

    return res.status(200).end();
  } catch (error) {
    console.log(error);
    const MessageError = `Error connect db`;
    return res.status(500).json({ message: `${MessageError}`, error });
  }
}
