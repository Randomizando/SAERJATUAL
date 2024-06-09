import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = req.body
  try {
    await prisma.chapas.deleteMany({
      where: {
        id: {
          in: data,
        },
      },
    })
    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
