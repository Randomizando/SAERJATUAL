import React from 'react'
import { Button } from '@/components/Button'
import { Box, Container } from './styled'
import DataGridDemo from '@/components/TableList'
import { GridColDef } from '@mui/x-data-grid'
import Modal from '@/components/Modal'
import { toast } from 'react-toastify'

import { useRouter } from 'next/router'
import { useContextCustom } from '@/context'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { format } from 'date-fns'

export default function EleicoesList({ data }: any) {
  const { selectedRowIds } = useContextCustom()

  const router = useRouter()
  const columns: GridColDef[] = [
    { field: 'numero_eleicao', headerName: 'Numero Eleição', flex: 1 },
    {
      field: 'titulo_eleicao',
      headerName: 'Titulo da Eleição',
      flex: 1,
    },
    {
      field: 'votacao_inicio',
      headerName: 'Inicio da votação',
      flex: 1,
    },
    {
      field: 'votacao_fim',
      headerName: 'Fim da votação',
      flex: 1,
    },
    {
      field: 'mandato_inicio',
      headerName: 'Inicio do mandato',
      flex: 1,
    },
    {
      field: 'mandato_fim',
      headerName: 'Fim do mandato',
      flex: 1,
    },
  ]

  const dataFormattedDate = data.map((item: any) => ({
    ...item,
    votacao_inicio: format(new Date(item.votacao_inicio), 'dd/MM/yyyy'),
    votacao_fim: format(new Date(item.votacao_fim), 'dd/MM/yyyy'),
    mandato_inicio: format(new Date(item.mandato_inicio), 'dd/MM/yyyy'),
    mandato_fim: format(new Date(item.mandato_fim), 'dd/MM/yyyy'),
  }))

  return (
    <Container>
      <p>
        <span>Eleições</span>
      </p>
      <Box>
        <DataGridDemo columns={columns} rows={dataFormattedDate} w="90%" />
      </Box>
      <Box>
        <Button
          title="Ver/Atualizar"
          style={{ backgroundColor: '#6f9622' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou o cargo para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 cargo para atualizar')
            } else {
              router.push(`/eleicoes/atualizar/${selectedRowIds}`)
            }
          }}
        />
        <Button
          title="Incluir"
          style={{ backgroundColor: '#f67200' }}
          onClick={() => {
            router.push('/eleicoes/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#ff0000"
          routeDelete="/eleicoes/delete"
          data={selectedRowIds}
          redirectRouter="/eleicoes"
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
        id: item.numero_eleicao,
        numero_eleicao: item.numero_eleicao,
        titulo_eleicao: item.titulo_eleicao,
        votacao_inicio: item.votacao_inicio.toString(),
        votacao_fim: item.votacao_fim.toString(),
        mandato_inicio: item.mandato_inicio.toString(),
        mandato_fim: item.mandato_fim.toString(),
      }
    })

    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados dos cargos:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
