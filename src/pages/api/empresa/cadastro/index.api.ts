// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import { Logs } from '@/utils/Logs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const schemaEmpresaForm = z.object({
  cod_empresa: z.string(),
  tipo_empresa: z.string(),
  patrocinadora: z.boolean(),
  faculdade_anestesiologia: z.boolean(),
  empresa_ativa: z.boolean(),
  cnpj: z.string(),
  razao_social: z.string(),
  nome_fantasia: z.string(),
  cep: z.string(),
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string(),
  cidade: z.string(),
  pais: z.string(),
  bairro: z.string(),
  uf: z.string(),
  telefone_comercial: z.string(),
  tratamento_contato_primario: z.string(),
  nome_contato_primario: z.string(),
  cargo_contato_primario: z.string(),
  email_contato_primario: z.string(),
  telefone_contato_primario: z.string(),
  tratamento_contato_secundario: z.string(),
  nome_contato_secundario: z.string(),
  cargo_contato_secundario: z.string(),
  email_contato_secundario: z.string(),
  telefone_contato_secundario: z.string(),
})

type SchemaEmpresaForm = z.infer<typeof schemaEmpresaForm>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data: SchemaEmpresaForm = req.body

  try {
    await prisma.empresa.create({
      data: {
        ...data,
        numero: data.numero,
      },
    })
    Logs({
      modulo: 'EMPRESA Cadastro',
      descriptionLog: `codigo empresa:${data.cod_empresa} usuario: 'teste' `,
    })
    return res.status(201).end()
  } catch (error) {
    console.log(error)
    const ErrorMessage = `Error conect database`
    return res.status(500).json({ message: `${ErrorMessage}` })
  }
}
