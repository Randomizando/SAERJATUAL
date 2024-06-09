/* eslint-disable dot-notation */
/* eslint-disable camelcase */
import { Box, Container } from './styled'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { GridColDef } from '@mui/x-data-grid'
import TableBirthdays from '@/components/TableBirthdays'
import { ArrowBendDownLeft } from 'phosphor-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '../../../lib/axios'
import { BackPage } from '../../../components/BackPage'
import { Associados } from '@prisma/client'
import { getRefinedAssociates } from '@/utils/getAssociatesForBirthdayTable.'

interface ResponseItem {
  id: number
  data_nascimento?: string | null
  data_inicio_especializacao?: string | null
  data_previsao_conclusao?: string | null
  comprovante_cpf?: string | null
  numero_proposta_SBA?: string | null
  matricula_SAERJ?: number | null
  matricula_SBA?: number | null
  situacao?: string | null
  uf_crm?: string | null
  crm?: string | null
  nome_completo?: string | null
  cpf?: string | null
  sexo?: string | null
  nome_profissional?: string | null
  categoria?: string | null
  cep?: string | null
  logradouro?: string | null
  numero?: number | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  uf?: string | null
  pais?: string | null
  telefone_celular?: string | null
  telefone_residencial?: string | null
  email?: string | null
  nome_instituicao_ensino_graduacao?: string | null
  ano_conclusao_graduacao?: string | null
  residencia_mec_cnrm?: string | null
  nivel_residencia?: string | null
  nome_hospital_mec?: string | null
  uf_prm?: string | null
  comprovante_endereco?: string | null
  carta_indicacao_2_membros?: string | null
  declaracao_hospital?: string | null
  diploma_medicina?: string | null
  certidao_quitacao_crm?: string | null
  certificado_conclusao_especializacao?: string | null
  declaro_verdadeiras?: string | null
  declaro_quite_SAERJ?: string | null
  pendencias_SAERJ?: string | null
  nome_presidente_regional?: string | null
  sigla_regional?: string | null
  tratamento?: string | null
}

export default function Aniversariantes({ data }: any) {
  const columnsBirthdays: GridColDef[] = [
    {
      field: 'matricula_SAERJ',
      headerName: 'Matrícula SAERJ',
      width: 180,
    },
    {
      field: 'tratamento',
      headerName: 'Tratamento',
      disableColumnMenu: true,
      width: 150,
    },

    {
      field: 'nome_completo',
      disableColumnMenu: true,
      headerName: 'Nome',
      width: 250,
    },
    {
      field: 'data_nascimento',
      headerName: 'Data Nascimento',
      disableColumnMenu: true,
      width: 200,
    },
    {
      field: 'categoria',
      headerName: 'Categoria',
      disableColumnMenu: true,
      width: 150,
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      disableColumnMenu: true,
      width: 150,
    },

    {
      field: 'email',
      headerName: 'E-mail',
      disableColumnMenu: true,
      width: 290,
    },
  ]

  const [situacaoAssociado, setSituacaoAssociado] = useState([])
  const [categoriaAssociado, setCategoriaAssociado] = useState([])
  const [rows, setRows] = useState(data)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/associados/get/refinedGetAll')
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }

      const newData = await res.json()

      setRows(newData)
    } catch (error: any) {
      console.error(error)
      setRows([])
    }
  }

  const getFiltros = async (filtro: string) => {
    let rtn
    try {
      const response = await api.get('/tabelas/get/' + filtro)
      rtn = response.data
    } catch (error) {
      console.log(error)
    }

    return rtn
  }

  useEffect(() => {
    const fetchFiltros = async () => {
      const categoriaData = await getFiltros('categoria')
      const situacaoData = await getFiltros('situacao')
      categoriaData.sort((a: any, b: any) => {
        const descricaoA = a.ocorrencia_tabela.toUpperCase()
        const descricaoB = b.ocorrencia_tabela.toUpperCase()
        if (descricaoA < descricaoB) {
          return -1
        }
        if (descricaoA > descricaoB) {
          return 1
        }
        return 0
      })
      situacaoData.sort((a: any, b: any) => {
        const descricaoA = a.ocorrencia_tabela.toUpperCase()
        const descricaoB = b.ocorrencia_tabela.toUpperCase()
        if (descricaoA < descricaoB) {
          return -1
        }
        if (descricaoA > descricaoB) {
          return 1
        }
        return 0
      })

      setCategoriaAssociado(categoriaData || [])
      setSituacaoAssociado(situacaoData || [])
    }

    fetchFiltros()
  }, [])

  return (
    <Container>
      <Box style={{ justifyContent: 'space-between' }}>
        <p>Aniversariantes</p>
      </Box>

      <TableBirthdays
        columns={columnsBirthdays}
        rows={rows}
        onRefetch={fetchData}
        w="100%"
        situacaoAssociado={situacaoAssociado}
        categoriaAssociado={categoriaAssociado}
      />
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await getRefinedAssociates()

    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados da empresa:', error)

    return {
      props: {
        data: [],
      },
    }
  }
}
