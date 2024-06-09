// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import { getRefinedAssociates } from '@/utils/getAssociatesForBirthdayTable.'
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
    const data = await getRefinedAssociates()

    res.status(200).json(data)
  } catch (error) {
    const MessageError = `Error connect db`
    res.status(500).json({ message: `${MessageError}, ${error}` })
  } finally {
    prisma.$disconnect()
  }
}
