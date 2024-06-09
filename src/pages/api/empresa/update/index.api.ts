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
  console.log(Number(data.numero))
  try {
    await prisma.empresa.update({
      where: { id: Number(data.id) },
      data: {
        ...data,
        numero: data.numero,
      },
    })

    Logs({
      modulo: 'EMPRESA UPDATE',
      descriptionLog: `Atualizado Empresa, empresa ID: ${data.id} codigo empresa:${data.cod_empresa} usuario: ' TESTE ' `,
    })

    return res.status(200).end()
  } catch (error) {
    console.log(error)
    const MessageError = `Error connect db`
    return res.status(500).json({ message: `${MessageError}`, error })
  }
}
