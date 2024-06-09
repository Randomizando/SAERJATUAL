// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import { Logs } from '@/utils/Logs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export const schemaPagamentos = z.object({
  matricula_saerj: z.string(),
  tipo_pagamento: z.string(),
  ano_anuidade: z.string(),
  data_pagto_unico: z.string(),
  valor_pagto_unico: z.string(),
  data_pagto_parcela_1: z.string(),
  valor_pagto_parcela_1: z.string(),
  data_pagto_parcela_2: z.string(),
  valor_pagto_parcela_2: z.string(),
  data_pagto_parcela_3: z.string(),
  valor_pagto_parcela_3: z.string(),
})

type SchemaPagamentos = z.infer<typeof schemaPagamentos>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data: SchemaPagamentos = req.body

  try {
    await prisma.pagamentos.create({
      data: {
        ...data,
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
