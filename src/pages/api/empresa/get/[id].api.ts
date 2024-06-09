import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query

    if (typeof id !== 'string') {
      throw new Error('Slug inválido')
    }
    const company = await prisma.empresa.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    })

    if (!company) {
      res.status(404).json({ error: 'Associado não encontrado' })
    } else {
      // Tratar a possibilidade de numero_proposta_SBA ser null
      const formattedAssociate = {
        ...company,
      }

      res.status(200).json(formattedAssociate)
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro Interno do Servidor' })
  } finally {
    await prisma.$disconnect()
  }
}

export default handler
