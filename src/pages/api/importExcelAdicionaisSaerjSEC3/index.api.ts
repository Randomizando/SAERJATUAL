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
      'SEC3.xlsx',
      // 'SEC3.xlsx',
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
    const tabela = workbook.Sheets._SEC3
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

        const DateTransform = (dataTable: any) => {
          const getDateOriginalFormat = dataTable
            ? useArrayDate.extrairComponentesData(dataTable)
            : null

          if (
            getDateOriginalFormat?.dia === 0 &&
            getDateOriginalFormat?.mes === 0 &&
            getDateOriginalFormat?.ano === 0
          ) {
            return null
          }

          const transformDateTimeISO = getDateOriginalFormat
            ? useArrayDate.MontarDate(
                String(getDateOriginalFormat.ano),
                String(getDateOriginalFormat.mes),
                String(getDateOriginalFormat.dia),
              )
            : null
          return transformDateTimeISO?.toString()
        }

        // if (item.CATEGORIA === 'REM') {
        //   item.CATEGORIA = 'REM - Remido'
        //   item.SITUACAO = 'Ativo'
        // } else if (item.CATEGORIA === 'AAD') {
        //   item.CATEGORIA = 'AAD - Aspirante-Adjunto'
        //   item.SITUACAO = 'Ativo'
        // } else if (item.CATEGORIA === 'ADJ') {
        //   item.CATEGORIA = 'ADJ - Adjunto'
        //   item.SITUACAO = 'Ativo'
        // } else if (item.CATEGORIA === 'ATV') {
        //   item.CATEGORIA = 'ATV - Ativo'
        //   item.SITUACAO = 'Ativo'
        // } else if (item.CATEGORIA === 'D-1') {
        //   item.CATEGORIA = 'D-1 - Inadimplente'
        //   item.SITUACAO = 'Inativo'
        // } else if (item.CATEGORIA === 'D-2') {
        //   item.CATEGORIA = 'D-2 - Transferido'
        //   item.SITUACAO = 'Inativo'
        // } else if (item.CATEGORIA === 'D-3') {
        //   item.CATEGORIA = 'D-3 - Pediu desligamento'
        //   item.SITUACAO = 'Inativo'
        // } else if (item.CATEGORIA === 'D-4') {
        //   item.CATEGORIA = 'D-4 - Falecido'
        //   item.SITUACAO = 'Falecido'
        // } else if (item.CATEGORIA === 'D-6') {
        //   item.CATEGORIA = 'D-6 - Pend. Alt. Categoria SBA'
        //   item.SITUACAO = 'Ativo'
        // } else if (item.CATEGORIA === 'D-5') {
        //   item.CATEGORIA = 'D-5 - Fora do Pais'
        //   item.SITUACAO = 'Inativo'
        // } else if (item.CATEGORIA === 'D-7') {
        //   item.CATEGORIA = 'D-7 - Fora do Pais'
        //   item.SITUACAO = 'Inativo'
        // }

        await prisma.adicionais_SAERJ.createMany({
          data: {
            matricula_saerj: Number(item.MATRICULA),
            admissao_saerj: DateTransform(item.ADMI),
            categoria_saerj: `${item.CATEGORIA}`,
            cooperativa: item.COOP,
            nome_pai: item.PAI,
            nome_mae: item.MAE,
            // tsa: ? ,
            observacao_1: item.OBS,
            observacao_2: item.OBS1,
            observacao_3: String(item.OBS2) || null,

            hospital_1: item.HOSP1,
            nome_responsavel: item.HOSP2,
            tratamento: item.ILMO,
            cet_data_inicio: DateTransform(item.CETIN),
            cet_data_fim: DateTransform(item.CETFN),

            ano_ult_pgto_sba: String(item.SITUACAO),
            cet: item.CET,
            ano_ult_pgto_regional: item.REGIONAL,
            cat_saerj: item.CAT,
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
