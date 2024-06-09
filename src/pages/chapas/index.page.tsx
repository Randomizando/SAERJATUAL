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
import Link from 'next/link'
import { ArrowBendDownLeft } from 'phosphor-react'

export default function ChapasList({ data }: any) {
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
      field: 'nome_chapa',
      headerName: 'Nome da chapa',
      width: 150,
    },
    {
      field: 'membros_chapa',
      headerName: 'Membros da chapa',
      width: 270,
      renderCell: ({ row }) => {
        return (
          <Typography>
            {row?.membros_chapa?.map((membro: any) => `${membro.nome}, `)}
          </Typography>
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

      <p>Chapas</p>

      <DataGridDemo columns={columns} rows={data} w="100%" />

      <Box>
        <Button
          title="Ver/Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou a chapa para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 chapa para atualizar')
            } else {
              router.push(`/chapas/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/chapas/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0000"
          routeDelete="/votacao/delete"
          data={selectedRowIds}
          redirectRouter="/chapas"
        />
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await prisma.chapas.findMany()

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
