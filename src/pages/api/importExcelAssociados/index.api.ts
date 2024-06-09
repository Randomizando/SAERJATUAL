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
      'ASSOCIADOS.xlsx',
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
    const tabela = workbook.Sheets.ASSOCIADOS
    const dadosTabela = xlsx.utils.sheet_to_json(tabela)

    const lerTabela = dadosTabela.map((item: any) => {
      const modifiedItem: { [key: string]: any } = {}
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          modifiedItem[key] = item[key]
        }
      }
      return modifiedItem
    })
    console.log(lerTabela)
    try {
      for (const item of lerTabela) {
        console.log('Processando items Tabela:', item)

        // const getDateOriginalFormat = item.Data_Nascimento
        //   ? useArrayDate.extrairComponentesData(item.Data_Nascimento)
        //   : null

        // console.log(getDateOriginalFormat)

        // const transformDateTimeISO = getDateOriginalFormat
        //   ? useArrayDate.MontarDate(
        //       String(getDateOriginalFormat.ano),
        //       String(getDateOriginalFormat.mes),
        //       String(getDateOriginalFormat.dia),
        //     )
        //   : null

        await prisma.associados.create({
          data: {
            numero_proposta_SBA: Number(item.Numero_Proposta_SBA),
            matricula_SAERJ: item.Matricula_SAERJ,
            matricula_SBA: item.Matricula_SBA,
            situacao: item.Situacao,
            uf_crm: item.UF_CRM,
            crm: String(item.CRM),
            nome_completo: String(item.Nome_Completo),
            cpf: String(item.CPF),
            sexo: String(item.Sexo),
            nome_profissional: item.Nome_Profissional,
            data_nascimento: item.Data_Nascimento,
            categoria: item.Categoria,
            pais: item.Pais,
            cep: item.CEP,
            uf: item.UF,
            cidade: item.Cidade,
            bairro: item.Bairro,
            logradouro: item.Logradouro,
            numero: item['Número'],
            complemento: item.Complemento,
            telefone_celular: item.Telefone_Celular,
            telefone_residencial: item.Telefone_Residencial,
            email: item.Email,
            nome_instituicao_ensino_graduacao:
              item['Nome_Instituicao_Ensino_graduação'],
            ano_conclusao_graduacao: String(item.Ano_conclusao_graduacao),
            data_inicio_especializacao: item.Data_Inicio_especializacao,
            data_previsao_conclusao: item.Data_Previsao_Conclusao,
            residencia_mec_cnrm: item['Residencia_ MEC-CNRM'],
            nivel_residencia: item.Nivel_Residencia,
            nome_hospital_mec: item.Nome_Hospital_MEC,
            uf_prm: item.UF_PRM,
            comprovante_cpf: String(item.Comprovante_CPF),
            comprovante_endereco: String(item.Comprovante_endereco),
            carta_indicacao_2_membros: String(item.Carta_Indicacao_2_membros),
            declaracao_hospital: String(item.Declaracao_hospital),
            diploma_medicina: String(item.Diploma_medicina),
            certidao_quitacao_crm: String(item.Certidao_Quitacao_CRM),
            certificado_conclusao_especializacao: String(
              item.Certificado_conclusao_especializacao,
            ),
            declaro_verdadeiras: item.Declaro_Verdadeiras,
            declaro_quite_SAERJ: item.Declaro_quite_SAERJ,
            pendencias_SAERJ: item.Pendencias_SAERJ,
            nome_presidente_regional: item.Nome_Presidente_Regional,
            sigla_regional: item.Sigla_Regional,
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
