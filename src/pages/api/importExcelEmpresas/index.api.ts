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
      'Empresas.xlsx',
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
    const tabelas = workbook.Sheets.Empresas
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
        await prisma.empresa.create({
          data: {
            cod_empresa: item.Cod_Empresa,
            tipo_empresa: item.Tipo_Empresa,
            patrocinadora: item.Patrocinadora,
            faculdade_anestesiologia: item.Faculdade_Anestesiologia,
            empresa_ativa: item.Empresa_Ativa,
            cnpj: item.CNPJ,
            razao_social: item.Razao_Social,
            nome_fantasia: item.Nome_Fantasia,
            cep: String(item.CEP),
            logradouro: item.Logradouro,
            numero: item.Numero,
            complemento: item.Complemento,
            pais: item.Pais,
            uf: item.UF,
            cidade: item.Cidade,
            bairro: item.Bairro,
            telefone_comercial: item.Telefone_Comercial,
            nome_contato_primario: item.Nome_Contato_Prim,
            cargo_contato_primario: item.Cargo_Contato_Prim,
            email_contato_primario: item.Email_Contato_Prim,
            telefone_contato_primario: item.Telefone_Celular_Prim || null,
            tratamento_contato_primario: item.Tratamento_Contato_Sec,
            nome_contato_secundario: item.Nome_Contato_Sec || null,
            cargo_contato_secundario: item.Cargo_Contato_Sec,
            email_contato_secundario: item.Email_Contato_Sec || null,
            telefone_contato_secundario: item.Telefone_Celular_Sec || null,
            tratamento_contato_secundario: item.Tratamento_Contato_Sec || null,
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
