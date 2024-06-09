// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import { Logs } from '@/utils/Logs'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== `PUT`) {
    const MessageErrorMethodInvalid = `Error method invalid`
    return res.status(405).json({ message: `${MessageErrorMethodInvalid}` })
  }
  const data = req.body

  try {
    await prisma.pagamentos.updateMany({
      where: { id: data.id },
      data: {
        ...data,
      },
    })
    Logs({
      modulo: 'PAGAMENTOS ATUALIZADO',
      descriptionLog: `ITEM ATUALIZADO ${data.id}`,
    })
    return res.status(200).end()
  } catch (error) {
    console.log(error)
    const MessageError = `Error connect db`
    return res.status(500).json({ message: `${MessageError}`, error })
  }
}
