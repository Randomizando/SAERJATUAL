import { checkAspirantCode } from '@/utils/checkAspirantCode'
import { findCountryByNationality } from '@/utils/findCountryByNationality'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: any, res: any) {
  try {
    const { dataAssociadoToInsert } = req.body
    if (!dataAssociadoToInsert || dataAssociadoToInsert.length === 0) {
      throw new Error('Nenhum associado fornecido no corpo da solicitação.')
    }
    const associadosCreated = []

    for (let i = 0; i < dataAssociadoToInsert.length; i++) {
      const associado = dataAssociadoToInsert[i]
      const isAspirant = checkAspirantCode(associado.codigo_proposta)

     if (!isAspirant) {
        associadosCreated.push({
          error: `Importação só permitida para Aspirantes`,
          type: 'Não Aspirante',
        })

        continue
      } 

      if (associado.cpf) {
        associado.cpf = associado.cpf.replace(/[.-]/g, '')
      }

      const existingCpf = await prisma.associados.findFirst({
        where: {
          cpf: associado.cpf,
        },
      })
     if (existingCpf) {
        associadosCreated.push({
          error: `Ignorado`,
          type: 'Cpf já cadastrado',
        })

        continue
      } 

      let dataNascimento

      if (associado.data_nascimento) {
        const dataNascimentoSplited = associado.data_nascimento.split('/')
        const ano = dataNascimentoSplited[2]
        const mes = dataNascimentoSplited[1]
        const dia = dataNascimentoSplited[0]

        const dataFormatada = `${ano}-${mes}-${dia}`
        dataNascimento = new Date(dataFormatada)
      }

      associado.pais = findCountryByNationality(associado.nacionalidade)
      delete associado.nacionalidade
      delete associado.codigo_proposta

      const biggestMatriculaSaerj = await prisma.associados.findFirst({
        select: {
          matricula_SAERJ: true,
        },
        where: {
          matricula_SAERJ: {
            not: 23434,
          },
        },
        orderBy: {
          matricula_SAERJ: 'desc',
        },
      })

      const newMatriculaSaerj =
        (biggestMatriculaSaerj?.matricula_SAERJ
          ? biggestMatriculaSaerj?.matricula_SAERJ
          : 0) + 1

      const dataToCreate = {
        ...associado,
        data_nascimento: dataNascimento,
        numero: associado.numero ? Number(associado.numero) : null,
        matricula_SAERJ: newMatriculaSaerj,
      }

      try {
        const associadoCreated = await prisma.associados.create({
          data: dataToCreate,
        })
        associadosCreated.push(associadoCreated)
      } catch (error) {
        console.error(`Erro ao inserir o associado na posição ${i}:`, error)
        associadosCreated.push({
          error: `Ignorado`,
          type: 'Desconhecido',
        })
      }
    }

    res.status(200).json({
      message: 'Dados inseridos com sucesso na tabela Associados.',
      result: associadosCreated,
    })
  } catch (error: any) {
    console.error('Erro durante a manipulação da solicitação:', error)
    res.status(500).json({ error: error.message })
  } finally {
    await prisma.$disconnect()
    console.log('Conexão Prisma fechada.')
  }
}
