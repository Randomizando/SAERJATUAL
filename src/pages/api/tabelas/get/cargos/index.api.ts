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
    const response = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Cargos_Dir',
        ocorrencia_ativa: true
      },
    })
    res.status(200).json(response)
  } catch (error) {
    const MessageError = `Error connect db`
    res.status(500).json({ message: `${MessageError}, ${error}` })
  } finally {
    prisma.$disconnect()
  }
}
