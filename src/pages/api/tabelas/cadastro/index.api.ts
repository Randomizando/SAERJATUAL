// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import { Logs } from '@/utils/Logs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const schemaTabelas = z.object({
  codigo_tabela: z.string(),
  ocorrencia_tabela: z.string(),
  complemento_ocorrencia_selecao: z.string(),
  ocorrencia_ativa: z.boolean(),
})

type SchemaTabelas = z.infer<typeof schemaTabelas>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data: SchemaTabelas = req.body

  try {
    await prisma.tabelas.create({
      data: {
        codigo_tabela: data.codigo_tabela,
        ocorrencia_ativa: data.ocorrencia_ativa,
        ocorrencia_tabela: data.ocorrencia_tabela,
        complemento_ocorrencia_selecao: data.complemento_ocorrencia_selecao,
      },
    })
    Logs({
      modulo: 'TABELAS CADASTRO',
      descriptionLog: `ITEM CADASTRADO`,
    })
    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
