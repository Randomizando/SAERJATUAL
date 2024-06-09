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
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ message: 'Invalid data format' })
  }

  try {
    const associate = await prisma.associados.findUnique({
      where: {
        id: data[0],
      },
    })
    let adicionaisSaerjExists
    if (associate?.matricula_SAERJ) {
      adicionaisSaerjExists = await prisma.adicionais_SAERJ.findFirst({
        where: {
          matricula_saerj: Number(associate?.matricula_SAERJ.toString()),
        },
      })
    }

    if (adicionaisSaerjExists) {
      await prisma.$transaction([
        prisma.adicionais_SAERJ.delete({
          where: {
            id: adicionaisSaerjExists.id,
          },
        }),
        prisma.associados.deleteMany({
          where: {
            id: {
              in: data,
            },
          },
        }),
      ])
    } else {
      await prisma.associados.deleteMany({
        where: {
          id: {
            in: data,
          },
        },
      })
    }

    Logs({
      modulo: 'Associado Delete',
      descriptionLog: `empresa ID: ${data} usuario: ' TESTE ' `,
    })
    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
