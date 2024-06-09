// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const response = await prisma.voto.findMany({
      where: {
        usuario_id: 1,
      },
    })

    res.status(200).json(response)
  } catch (error) {
    const MessageError = `Error connect db`
    res.status(500).json({ message: `${MessageError}`, error })
  }
}
