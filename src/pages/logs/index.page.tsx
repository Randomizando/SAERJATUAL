import DataGridDemo from '@/components/TableList'
import { Box, Container } from './styled'
import { GetStaticProps } from 'next'
import { prisma } from '@/lib/prisma'
import { GridColDef } from '@mui/x-data-grid'
import { useContextCustom } from '@/context'
import { Button } from '@/components/Button'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { BackPage } from '@/components/BackPage'

export default function Logs({ data }: any) {
  // console.log(data)
  const { selectedRowIds } = useContextCustom()
  const router = useRouter()

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'id',
    },
    {
      field: 'cod_log',
      headerName: 'Código log',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'ocorrencia_log',
      headerName: 'Ocorrencia log',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'data_hora_log',
      headerName: 'Data Hora Log',
      flex: 1,
      disableColumnMenu: true,
    },
  ]
  return (
    <Container>
      <p>Logs</p>
      <BackPage backRoute="/" />

      <DataGridDemo columns={columns} rows={data} w={'100%'} />

      <Box>
        <Button
          style={{ backgroundColor: '#4471C6' }}
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou nenhum Log para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 Log para visualizar')
            } else {
              router.push(`/logs/visualizar/${selectedRowIds}`)
            }
          }}
        />
      </Box>
    </Container>
  )
}
export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await prisma.logs.findMany({
      orderBy: {
        id: 'desc',
      },
    })

    const convertedData = response.map((log) => ({
      ...log,
      data_hora_log: log.data_hora_log.toISOString(),
    }))

    return {
      props: {
        data: convertedData,
      },
    }
  } catch (error) {
    console.error(error, 'Erro ao buscar Logs no Banco')
    return {
      props: {
        data: [],
      },
    }
  } finally {
    await prisma.$disconnect()
  }
}
