import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query

    if (typeof id !== 'string') {
      throw new Error('Slug inválido')
    }
    const associate = await prisma.associados.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    })

    if (!associate) {
      res.status(404).json({ error: 'Associado não encontrado' })
    } else {
      // Tratar a possibilidade de numero_proposta_SBA ser null
      const formattedAssociate = {
        ...associate,
        numero_proposta_SBA: associate.numero_proposta_SBA?.toString() || null,
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
