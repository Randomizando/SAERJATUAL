import { prisma } from '@/lib/prisma'

export async function getRefinedAssociates() {
  const response = await prisma.associados.findMany({
    where: {
      situacao: {
        not: 'Falecido',
      },
      id: {
        gt: 1,
      },
    },
    orderBy: [
      {
        matricula_SAERJ: 'desc',
      },
    ],
  })

  const data = response.map((item) => {
    return {
      ...item,
      numero_proposta_SBA:
        item.numero_proposta_SBA !== null
          ? item.numero_proposta_SBA.toString()
          : null,
      data_nascimento:
        item.data_nascimento !== null
          ? item.data_nascimento
              .toISOString()
              .replace(/T.*/, '')
              .split('-')
              .reverse()
              .join('/')
          : null,
      data_inicio_especializacao:
        item.data_inicio_especializacao !== null
          ? item.data_inicio_especializacao
              .toISOString()
              .replace(/T.*/, '')
              .split('-')
              .reverse()
              .join('/')
          : null,
      data_previsao_conclusao:
        item.data_previsao_conclusao !== null
          ? item.data_previsao_conclusao
              .toISOString()
              .replace(/T.*/, '')
              .split('-')
              .reverse()
              .join('/')
          : null,
      data_ultimo_envio_email_aniversario:
        item.data_ultimo_envio_email_aniversario !== null
          ? item.data_ultimo_envio_email_aniversario
              .toISOString()
              .replace(/T.*/, '')
              .split('-')
              .reverse()
              .join('/')
          : null,
    }
  })

  return data
}
