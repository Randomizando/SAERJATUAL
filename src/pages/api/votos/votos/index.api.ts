// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== `GET`) {
    const MessageErrorMethodInvalid = `Error method invalid`
    return res.status(405).json({ message: `${MessageErrorMethodInvalid}` })
  }

  try {
    if (!req.query.id) {
      return res.status(400).json({ message: 'id is required' })
    }

    const { id } = req.query

    const eleicao = await prisma.votacao.findFirst({
      where: {
        id: Number(id),
      },
    })

    if (!eleicao) {
      return res.status(404).json({ message: 'not found' })
    }

    const chapas = eleicao.chapas as any

    const chapaNomes = chapas.chapas.map((chapa: any) => chapa.nome_chapa)

    const votosCount = await prisma.voto.count({
      where: {
        votacao_id: Number(id),
      },
    })

    const votosChapasPromise = chapaNomes?.map(async (chapaNome: string) => {
      const res = await prisma.voto.count({
        where: {
          votacao_id: Number(id),
          nome_chapa: chapaNome,
        },
      })

      return {
        chapaNome,
        count: res,
      }
    })

    const votosChapas = await Promise.all(votosChapasPromise)

    const votosBranco = await prisma.voto.count({
      where: {
        votacao_id: Number(id),
        nome_chapa: 'BRANCO',
      },
    })

    const votosNulo = await prisma.voto.count({
      where: {
        votacao_id: Number(id),
        nome_chapa: 'NULO',
      },
    })

    const response = {
      name: eleicao?.matricula_saerj,
      votosCount,
      votosChapas,
      votosBranco,
      votosNulo,
    }

    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
