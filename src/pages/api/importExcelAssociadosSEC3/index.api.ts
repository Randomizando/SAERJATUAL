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
          // Limpar '()', '-' e espaços em branco
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
          console.log(getDateOriginalFormat)
          // Verifique se o ano é um número e tem mais de 4 caracteres
          if (
            typeof getDateOriginalFormat?.ano === 'number' &&
            getDateOriginalFormat.ano.toString().length > 4
          ) {
            console.log('Ano com mais de 4 caracteres. Cadastrado errado!')
            return null
          }
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

        if (item.CATEGORIA === 'REM') {
          item.CATEGORIA = 'REM - Remido'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'AAD') {
          item.CATEGORIA = 'AAD - Aspirante-Adjunto'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'ADJ') {
          item.CATEGORIA = 'ADJ - Adjunto'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'ATV') {
          item.CATEGORIA = 'ATV - Ativo'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'D-1') {
          item.CATEGORIA = 'D-1 - Inadimplente'
          item.SITUACAO = 'Inativo'
        } else if (item.CATEGORIA === 'D-2') {
          item.CATEGORIA = 'D-2 - Transferido'
          item.SITUACAO = 'Inativo'
        } else if (item.CATEGORIA === 'D-3') {
          item.CATEGORIA = 'D-3 - Pediu desligamento'
          item.SITUACAO = 'Inativo'
        } else if (item.CATEGORIA === 'D-4') {
          item.CATEGORIA = 'D-4 - Falecido'
          item.SITUACAO = 'Falecido'
        } else if (item.CATEGORIA === 'D-6') {
          item.CATEGORIA = 'D-6 - Pend. Alt. Categoria SBA'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'D-5') {
          item.CATEGORIA = 'D-5 - Fora do Pais'
          item.SITUACAO = 'Inativo'
        } else if (item.CATEGORIA === 'D-7') {
          item.CATEGORIA = 'D-7 - Fora do Pais'
          item.SITUACAO = 'Inativo'
        } else if (item.CATEGORIA === 'HON') {
          item.CATEGORIA = 'HON - Honorário'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'ME1') {
          item.CATEGORIA = 'ME1 - Aspirante'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'ME2') {
          item.CATEGORIA = 'ME2 - Aspirante'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'ME3') {
          item.CATEGORIA = 'ME3 - Aspirante'
          item.SITUACAO = 'Ativo'
        } else if (item.CATEGORIA === 'ME4') {
          item.CATEGORIA = 'ME4 - Aspirante pend. SBA'
          item.SITUACAO = 'Ativo'
        }

        await prisma.associados.createMany({
          data: {
            // numero_proposta_SBA: Number(item.Numero_Proposta_SBA),
            matricula_SBA: Number(item.MODALIDADE),
            // uf_crm: item.UF_CRM,
            // nome_profissional: item.Nome_Profissional,
            matricula_SAERJ: Number(item.MATRICULA),
            situacao: item.SITUACAO,
            crm: item.CRM,
            nome_completo: item.NOME,
            cpf: String(item.CPF) || null,
            sexo: String(item.SEXO) === 'M' ? 'Masculino' : 'Feminino',
            data_nascimento: DateTransform(item.NASCI) || null,
            categoria: `${item.CATEGORIA}`,
            pais: 'Brasil',
            cep: item.CEP,
            uf: item.ESTADO,
            cidade: item.CIDADE,
            bairro: item.BAIRRO,
            logradouro: item.ENDERECO,
            // numero: item['Número'],
            // complemento: item.Complemento,
            telefone_celular: `${item.DDD ? item.DDD : ''} ${
              item.CELULAR ? item.CELULAR : ''
            }`,
            telefone_residencial: `${item.DDD ? item.DDD : ''} ${
              item.TEL1 ? item.TEL1 : ''
            }`,
            email: item['E-MAIL'],
            // nome_instituicao_ensino_graduacao:
            //   item['Nome_Instituicao_Ensino_graduação'],
            // ano_conclusao_graduacao: String(item.Ano_conclusao_graduacao),
            // data_inicio_especializacao: item.Data_Inicio_especializacao,
            // data_previsao_conclusao: item.Data_Previsao_Conclusao,
            // residencia_mec_cnrm: item['Residencia_ MEC-CNRM'],
            // nivel_residencia: item.Nivel_Residencia,
            // nome_hospital_mec: item.Nome_Hospital_MEC,
            // uf_prm: item.UF_PRM,
            // comprovante_cpf: String(item.Comprovante_CPF),
            // comprovante_endereco: String(item.Comprovante_endereco),
            // carta_indicacao_2_membros: String(item.Carta_Indicacao_2_membros),
            // declaracao_hospital: String(item.Declaracao_hospital),
            // diploma_medicina: String(item.Diploma_medicina),
            // certidao_quitacao_crm: String(item.Certidao_Quitacao_CRM),
            // certificado_conclusao_especializacao: String(
            //   item.Certificado_conclusao_especializacao,
            // ),
            // declaro_verdadeiras: item.Declaro_Verdadeiras,
            // declaro_quite_SAERJ: item.Declaro_quite_SAERJ,
            // pendencias_SAERJ: item.Pendencias_SAERJ,
            // nome_presidente_regional: item.Nome_Presidente_Regional,
            // sigla_regional: item.Sigla_Regional,
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
