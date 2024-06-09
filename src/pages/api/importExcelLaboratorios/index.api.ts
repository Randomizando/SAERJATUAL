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
      'LABORATORIOS.xlsx',
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
    const tabela = workbook.Sheets.LABORATORIOS
    const dadosTabela = xlsx.utils.sheet_to_json(tabela)

    const lerTabela = dadosTabela.map((item: any) => {
      const modifiedItem: { [key: string]: any } = {}
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          // Limpar '()', '-', '.' e espaços
          if (
            key === 'TEL' ||
            key === 'TEL (PESSOAL)' ||
            key === 'CGC' ||
            key === 'INSC ESTADUAL' ||
            key === 'INSC MUNICIPAL' ||
            (key === 'CEP' && typeof item[key] === 'string')
          ) {
            modifiedItem[key] = item[key].replace(/[\s().\-/,]/g, '') // Remove '()', '-', '.', '/', ','  e espaços
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
            tipo_empresa: 'Laboratório',
            razao_social: item.NOME,
            cod_empresa: item.SIGLA,
            logradouro: item.ENDERECO,
            bairro: item.BAIRRO,
            cidade: item.CIDADE,
            uf: item.ESTADO,
            cep: item.CEP,
            // modificado ilmo[26] tel[25] SECUNDARIO
            tratamento_contato_secundario: item.ILMO,
            telefone_contato_secundario: item.TEL,
            nome_contato_secundario: item['OUTROS NOMES'],
            // modificado TEL(PESSOAL)[25] PREZADO[26] PRIMÁRIO
            telefone_contato_primario: item['TEL (PESSOAL)'],
            tratamento_contato_primario: item.PREZADO,
            nome_contato_primario: item.CARGO,
            email_contato_primario: item['E-MAIL'],

            home_page: item['HOME PAGE'],
            cnpj: item.CGC,
            inscricao_estadual: item['INSC ESTADUAL'],
            inscricao_municipal: item['INSC MUNICIPAL'],
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
