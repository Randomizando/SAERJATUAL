import { prisma } from '@/lib/prisma'
import { Logs } from '@/utils/Logs'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(404).json({ message: 'invalid method' })
  }
  const data = req.body
  // console.log(data)
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ message: 'Invalid data format' })
  }
  try {
    await prisma.empresa.deleteMany({
      where: {
        id: {
          in: data,
        },
      },
    })
    Logs({
      modulo: 'DELETE EMPRESA',
      descriptionLog: `empresa ID: ${data} usuario: ' TESTE ' `,
    })
    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
