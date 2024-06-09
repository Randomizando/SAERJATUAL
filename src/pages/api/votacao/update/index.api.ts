/* eslint-disable camelcase */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== `PUT`) {
    const MessageErrorMethodInvalid = `Error method invalid`
    return res.status(405).json({ message: `${MessageErrorMethodInvalid}` })
  }
  const { id, membros_chapa, nome_chapa } = req.body
  console.log(id, membros_chapa, nome_chapa)
  try {
    await prisma.chapas.update({
      where: { id },
      data: {
        id,
        membros_chapa,
        nome_chapa,
      },
    })
    return res.status(200).end()
  } catch (error) {
    console.log(error)
    const MessageError = `Error connect db`
    return res.status(500).json({ message: `${MessageError}`, error })
  }
}
