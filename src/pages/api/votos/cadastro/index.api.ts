/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { nome_chapa, usuario_id, votacao_id } = req.body

    await prisma.voto.create({
      data: {
        nome_chapa,
        usuario_id,
        votacao_id,
      },
    })

    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
