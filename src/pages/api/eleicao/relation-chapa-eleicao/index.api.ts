/* eslint-disable camelcase */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === `POST`) {
    const { id, Chapas } = req.body

    try {
      // await prisma.chapas_Eleicoes.create({
      //   data: {
      //     eleicao_id: { connect: { id } },
      //     chapa_id: {
      //       connect: Chapas.map((chapaId: number) => ({ id: chapaId })),
      //     },
      //   },
      // })

      await Promise.all(
        Chapas.map(async (chapaId: any) => {
          await prisma.chapas_Eleicoes.create({
            data: {
              eleicao_id: { connect: { id } },
              chapa_id: { connect: { id: chapaId } },
            },
          })
        }),
      )

      return res.status(200).json({ message: 'Cadastrado com sucesso' })
    } catch (error) {
      console.log(error)
      const MessageError = `Error connect db`
      return res.status(500).json({ message: `${MessageError}`, error })
    } finally {
      await prisma.$disconnect()
    }

    // const MessageErrorMethodInvalid = `Error method invalid`
    // return res.status(405).json({ message: `${MessageErrorMethodInvalid}` })
  } else if (req.method === `GET`) {
    try {
      // Consulta as eleições com suas chapas relacionadas
      const eleicoes = await prisma.eleicoes.findMany({
        include: {
          Chapas_Eleicoes: true,
        },
      })

      // Retorna as eleições com as chapas associadas
      res.status(200).json(eleicoes)
    } catch (error) {
      console.error('Erro ao consultar eleições:', error)
      res.status(500).json({ message: 'Erro ao consultar eleições', error })
    } finally {
      await prisma.$disconnect()
    }
  } else if (req.method === `DELETE`) {
    try {
      const { id } = req.body
      await prisma.chapas_Eleicoes.delete({
        where: {
          id: Number(id),
        },
      })

      // const eleicao = await prisma.eleicoes.findMany({
      //   where: {
      //     id: Number(id),
      //   },
      //   include: {
      //     Chapas_Eleicoes: true,
      //   },
      // })

      // const Eleicao = {
      //   ...eleicao[0],
      //   votacao_inicio:
      //     eleicao && format(new Date(eleicao[0].votacao_inicio), 'dd/MM/yyyy'),
      //   votacao_fim:
      //     eleicao && format(new Date(eleicao[0].votacao_fim), 'dd/MM/yyyy'),
      //   mandato_inicio:
      //     eleicao && format(new Date(eleicao[0].mandato_inicio), 'dd/MM/yyyy'),
      //   mandato_fim:
      //     eleicao && format(new Date(eleicao[0].mandato_fim), 'dd/MM/yyyy'),
      // }

      res.status(200).json({ message: 'Deletado com sucesso!' })
    } catch (error) {
      console.log(error)
    }
  }
}
