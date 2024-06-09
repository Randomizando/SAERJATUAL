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
  const {
    id,
    titulo_eleicao,
    numero_eleicao,
    votacao_inicio,
    votacao_fim,
    mandato_inicio,
    mandato_fim,
    chapas,
    status,
    Chapas,
  } = req.body

  try {
    await prisma.eleicoes.update({
      where: { id },
      data: {
        titulo_eleicao,
        numero_eleicao,
        votacao_inicio: new Date(votacao_inicio).toISOString(),
        votacao_fim: new Date(votacao_fim).toISOString(),
        mandato_inicio: new Date(mandato_inicio).toISOString(),
        mandato_fim: new Date(mandato_fim).toISOString(),
        chapas: [...chapas],
        status,
        Chapas,
      },
    })
    return res.status(200).end()
  } catch (error) {
    console.log(error)
    const MessageError = `Error connect db`
    return res.status(500).json({ message: `${MessageError}`, error })
  }
}
