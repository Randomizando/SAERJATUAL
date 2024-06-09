// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import { Logs } from '@/utils/Logs'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = req.body

  try {
    await prisma.associados.create({
      data: {
        ...data,
      },
    })
    Logs({
      modulo: 'ASSOCIADO Cadastro',
      descriptionLog: `CRM :${data.crm} usuario: 'teste' `,
    })
    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  } finally {
    prisma.$disconnect()
  }
}
