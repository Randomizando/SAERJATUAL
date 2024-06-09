import { Button } from '@/components/Button'
import { Container, Box } from './styled'
import { useRouter } from 'next/router'
import DataGridDemo from '@/components/TableList'
import { useContextCustom } from '@/context'
import { GridColDef } from '@mui/x-data-grid'
import { toast } from 'react-toastify'
import Modal from '@/components/Modal'
import { GetServerSideProps } from 'next'
import { Typography } from '@mui/material'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import Link from 'next/link'
import { ArrowBendDownLeft } from 'phosphor-react'
import ModalCheckUser from '@/components/ModalCheckUser'

export default function EleicaoList({ data }: any) {
  const router = useRouter()
  const { selectedRowIds } = useContextCustom()

  const columns: GridColDef[] = [
    // {
    //   field: "id",
    //   headerName: "id",
    //   disableColumnMenu: true,
    //   width: 80,
    // },
    {
      field: 'numero_eleicao',
      headerName: 'Número Eleição',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Situação',
      disableColumnMenu: true,
      width: 100,
      renderCell: (params) => {
        return (
          <Typography>
            {params.value === 'INATIVA' ? 'Inativa' : 'Ativa'}
          </Typography>
        )
      },
    },
    {
      field: 'titulo_eleicao',
      headerName: 'Título Eleição',
      width: 300,
    },
    {
      field: 'votacao_inicio',
      headerName: 'Data início Votação',
      width: 200,
      renderCell: (params) => {
        return (
          <Typography>{dayjs(params.value).format('DD/MM/YYYY')}</Typography>
        )
      },
    },
    {
      field: 'votacao_fim',
      headerName: 'Data Fim Votação',
      width: 200,
      renderCell: (params) => {
        return (
          <Typography>{dayjs(params.value).format('DD/MM/YYYY')}</Typography>
        )
      },
    },
    {
      field: 'mandato_inicio',
      headerName: 'Data início Mandato',
      width: 200,
      renderCell: (params) => {
        return (
          <Typography>{dayjs(params.value).format('DD/MM/YYYY')}</Typography>
        )
      },
    },
    {
      field: 'mandato_fim',
      headerName: 'Data Fim Mandato',
      width: 200,
      renderCell: (params) => {
        return (
          <Typography>{dayjs(params.value).format('DD/MM/YYYY')}</Typography>
        )
      },
    },
  ]

  return (
    <Container>
      <Box style={{ justifyContent: 'end' }}>
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            fontFamily: 'Roboto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            color: '#000',
          }}
        >
          <ArrowBendDownLeft size={32} />
          Retornar
        </Link>
      </Box>
      <p>Eleições</p>
      <DataGridDemo columns={columns} rows={data} w="100%" />

      <Box>
        <Button
          title="Ver/Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('Você não selecionou a eleição para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 eleição para atualizar')
            } else {
              router.push(`/eleicao/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/eleicao/cadastro')
          }}
        />

        <ModalCheckUser
          title="Excluir"
          message="Operação não autorizada. Favor utilizar o campo “Está Ativa” através do botão Ver/Atualizar para inativar a Eleição, Chapas e Diretorias subordinadas"
          bgColor="#BE0000"
          routeDelete="/eleicao/delete/"
          data={selectedRowIds}
          redirectRouter="/eleicao/lista"
        />

        <Button
          title="Ver resultado"
          style={{ backgroundColor: '#b34db2' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('Você não selecionou a eleição para ver resultado')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 eleição para ver resultado')
            } else {
              router.push(`/eleicao/resultado/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir Chapas"
          style={{ backgroundColor: 'blue' }}
          onClick={() => {
            router.push(`/eleicao/lista/chapas-incluir/${selectedRowIds}`)
          }}
        />

        <Button
          title="Chapas"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/chapas')
          }}
        />

        <Button
          title="Diretorias"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/diretorias')
          }}
        />
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await prisma.eleicoes.findMany()

    const data = response.map((item) => {
      return {
        id: item.id,
        numero_eleicao: item.numero_eleicao,
        titulo_eleicao: item.titulo_eleicao,
        votacao_inicio: item.votacao_inicio.toString(),
        votacao_fim: item.votacao_fim.toString(),
        mandato_inicio: item.mandato_inicio.toString(),
        mandato_fim: item.mandato_fim.toString(),
        status: item.status.toString(),
      }
    })

    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados da chapa:', error)
    return {
      props: {
        data: [],
        dataTipochapa: [],
      },
    }
  }
}
