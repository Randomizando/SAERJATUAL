import { NextApiRequest, NextApiResponse } from 'next'
import xlsx from 'xlsx'
import * as path from 'path'
import * as fs from 'fs'
import { prisma } from '@/lib/prisma'
import { useArrayDate } from '@/utils/useArrayDate'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const diretorioAtual = process.cwd()
    console.log('Diretório Atual:', diretorioAtual)

    const caminhoPlanilha = path.resolve(
      diretorioAtual,
      'src',
      'planilhas',
      'PROTOCOLO.xlsx',
    )
    console.log('Caminho da planilha:', caminhoPlanilha)

    // Verifique se o arquivo existe
    if (!fs.existsSync(caminhoPlanilha)) {
      console.error('O arquivo da planilha não foi encontrado.')
      res.status(404).end()
      return
    }

    const workbook = xlsx.readFile(caminhoPlanilha)

    // Selecione a aba 'tabelas'
    const tabela = workbook.Sheets.PROTOCOLO
    const dadosTabela = xlsx.utils.sheet_to_json(tabela)

    const lerTabela = dadosTabela.map((item: any) => {
      const modifiedItem: { [key: string]: any } = {}
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          // Limpar '()', '-' e espaços em branco dos campos TEL1 e TEL2
          if (
            (key === 'TEL1' ||
              key === 'TEL2' ||
              key === 'CEP' ||
              key === 'CPF' ||
              key === 'CRM' ||
              key === 'CELULAR') &&
            typeof item[key] === 'string'
          ) {
            // eslint-disable-next-line no-useless-escape
            modifiedItem[key] = item[key].replace(/[\s()\-.']/g, '')
          } else {
            modifiedItem[key] = item[key]
          }
        }
      }
      return modifiedItem
    })
    console.log(lerTabela)
    try {
      for (const item of lerTabela) {
        console.log('Processando items Tabela:', item)

        const OriginalDateDesmontar = (date: any) => {
          const getDateOriginalFormat =
            useArrayDate.extrairComponentesData(date)

          return getDateOriginalFormat
        }
        const DateSaveDB = (dataDesmontada: any) => {
          const dateSaveDatabase = useArrayDate.MontarDate(
            String(dataDesmontada.ano),
            String(dataDesmontada.mes),
            String(dataDesmontada.dia),
          )
          return dateSaveDatabase
        }

        const dataRecebimentoOld = OriginalDateDesmontar(item.Data_Recebimento)
        const dataRecebimento = DateSaveDB(dataRecebimentoOld)

        const dataEnvioOld = OriginalDateDesmontar(item.Data_Envio)
        const dataEnvio = DateSaveDB(dataEnvioOld)

        await prisma.protocolos.createMany({
          data: {
            num_protocolo: item.Codigo,
            data_recebimento: dataRecebimento,
            data_envio: dataEnvio,
            meio_recebimento: item.Tipo_correspondencia,
            remetente: item.Remetente,
            assunto_protocolo: item.Assunto,
            entregue_em_maos: item.Entregue_maos,
          },
        })
      }
      res.status(200).json({ message: 'dados importados com sucesso!' })
    } catch (error) {
      console.error('Erro ao inserir dados da Tabela no banco:', error)
      res.status(500).json({
        error: 'Erro interno do servidor ao inserir dados da Tabela.',
      })
    }
    console.log('importação finalizada')
  } catch (error) {
    console.error('Erro ao converter planilha para JSON:', error)
    res.status(500).end()
  }
}
