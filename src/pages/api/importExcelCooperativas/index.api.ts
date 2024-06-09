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
      'COOPERATIVAS.xlsx',
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
    const tabela = workbook.Sheets.COOPERATIVAS
    const dadosTabela = xlsx.utils.sheet_to_json(tabela)

    const lerTabela = dadosTabela.map((item: any) => {
      const modifiedItem: { [key: string]: any } = {}
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          // Limpar '()', '-', '.' e espaços em branco dos campos TEL1, TEL2, DDD e CGC
          if (
            key === 'TEL1' ||
            key === 'TEL2' ||
            key === 'DDD' ||
            key === 'CGC' ||
            (key === 'CEP' && typeof item[key] === 'string')
          ) {
            modifiedItem[key] = item[key].replace(/[\s().\-/]/g, '') // Remove '()', '-', '.', '/' e espaços
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
        await prisma.empresa.create({
          data: {
            tipo_empresa: 'Cooperativa',
            cod_empresa: item.SIGLA,
            razao_social: item.COOPERATIV,
            logradouro: item.ENDERECO,
            bairro: item.BAIRRO,
            cidade: item.CIDADE,
            uf: item.UF,
            cep: item.CEP,
            telefone_contato_primario: `${item.DDD}${item.TEL1}`,
            telefone_contato_secundario: `${item.DDD}${item.TEL2}`,
            nome_contato_primario: item.NOME,
            tratamento_contato_secundario: item.DR,
            cargo_contato_primario: item.MD,
            tratamento_contato_primario: item.PREZADO,
            email_contato_primario: item.EMAIL,
            cnpj: item.CGC,
            observacoes: item['ALTERAÇÃO'],
          },
        })
      }
      res.status(200).json({ message: 'Dados importados com sucesso!' })
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
