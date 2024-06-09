import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query

    if (typeof id !== 'string') {
      throw new Error('Slug inválido')
    }

    const associate = await prisma.associados.findFirst({
      where: {
        matricula_SAERJ: parseInt(id, 10),
      },
    })

    if (!associate) {
      res.status(404).json({ error: 'Matrícula não encontrada' })
    } else {
      const formattedAssociate = {
        ...associate,
        numero_proposta_SBA: Number(associate.numero_proposta_SBA),
      }

      res.status(200).json({ associado: formattedAssociate })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro Interno do Servidor' })
  } finally {
    await prisma.$disconnect()
  }
}

export default handler
