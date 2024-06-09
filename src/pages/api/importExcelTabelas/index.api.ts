import { NextApiRequest, NextApiResponse } from 'next'
import xlsx from 'xlsx'
import * as path from 'path'
import * as fs from 'fs'
import { prisma } from '@/lib/prisma'

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
      'Tabelas.xlsx',
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
    const tabelas = workbook.Sheets.Tabelas
    const dadosTabelas = xlsx.utils.sheet_to_json(tabelas)

    const lerTabela = dadosTabelas.map((item: any) => {
      const modifiedItem: { [key: string]: any } = {}
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          modifiedItem[key] =
            typeof item[key] === 'string' ? item[key] : item[key]
        }
      }
      return modifiedItem
    })

    try {
      for (const item of lerTabela) {
        console.log('Processando items Tabela:', item)
        await prisma.tabelas.create({
          data: {
            codigo_tabela: item.Cod_Tabela,
            complemento_ocorrencia_selecao: item.Occ_Tab_Complemento,
            ocorrencia_tabela: item.Ocorrencia_Tab,
            ocorrencia_ativa: item.Occ_Tab_Ativa,
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
  } catch (error) {
    console.error('Erro ao converter planilha para JSON:', error)
    res.status(500).end()
  }
}
