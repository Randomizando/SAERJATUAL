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

  function generateRandom(): string {
    const randomChar = (charSet: string, len: number) =>
      Array.from(
        { length: len },
        () => charSet[Math.floor(Math.random() * charSet.length)],
      ).join('')

    return [
      randomChar('!@#$%^&*()_-+=<>?/', 3),
      randomChar('0123456789', 3),
      randomChar('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 3),
    ]
      .sort(() => Math.random() - 0.5)
      .join('')
  }

  try {
    await prisma.parametros.updateMany({
      where: { id: 1 },
      data: {
        random: generateRandom(),
        ...data,
      },
    })
    Logs({
      modulo: 'PARAMETROS UPDATE',
      descriptionLog: `PARAMETRO ATUALIZADO`,
    })
    return res.status(200).end()
  } catch (error) {
    console.log(error)
    const MessageError = `Error connect db`
    return res.status(500).json({ message: `${MessageError}`, error })
  }
}
