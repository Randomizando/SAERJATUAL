import { BackPage } from '@/components/BackPage'
import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import SelectNoComplete from '@/components/SelectNoComplete'
import DataGridDemo from '@/components/TableList'
import { useContextCustom } from '@/context'
import { prisma } from '@/lib/prisma'
import { GridColDef } from '@mui/x-data-grid'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { Box, Container } from './styled'

const shemaFilter = z.object({
  codigo_tabela: z.string(),
  status: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>
export default function EmpresaList({ data }: any) {
  const { selectedRowIds } = useContextCustom()
  const [list, setList] = useState(data)
  const router = useRouter()
  const { register, watch, setValue } = useForm<SchemaFilter>()
  // console.log(selectedRowIds)
  const [filterSelect, setFilterSelect] = useState({
    codigo_tabela: 'Todos',
  })
  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID' },
    {
      field: 'codigo_tabela',
      headerName: 'Código tabela',
      width: 170,
    },
    {
      field: 'ocorrencia_tabela',
      headerName: 'Ocorrencia',
      width: 220,
      editable: true,
      disableColumnMenu: true,
    },
    {
      field: 'complemento_ocorrencia_selecao',
      headerName: 'Complemento',
      flex: 0.2,
      editable: true,
      disableColumnMenu: true,
    },

    {
      field: 'ocorrencia_ativa',
      headerName: 'Ativo',
      width: 110,
      editable: true,
      disableColumnMenu: true,
    },
  ]

  let previewCodeToFilter = 'Todos'
  let previewStatus = 'Ativos'

  if (typeof window !== 'undefined') {
    previewCodeToFilter =
      global?.localStorage?.getItem('previewCodeToFilter') || 'Todos'
    previewStatus = global?.localStorage?.getItem('previewStatus') || 'Ativos'
  }

  const codigosTabelaUnicos = new Set()

  const resultadoCodigoTabelasUnicos = data.filter((item: any) => {
    if (!codigosTabelaUnicos.has(item.codigo_tabela)) {
      codigosTabelaUnicos.add(item.codigo_tabela)
      return true
    }
    return false
  })

  function BuscarFiltro() {
    // Inicialize a lista com os dados originais
    let filteredList = data

    const CodigoPesquisado = watch('codigo_tabela') || previewCodeToFilter
    // Realize a filtragem com base nos valores selecionados
    if (CodigoPesquisado !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        const situacaoMatch =
          CodigoPesquisado === 'Todos' ||
          item.codigo_tabela === CodigoPesquisado
        return situacaoMatch
      })
    }

    const statusTable = watch('status') || previewStatus
    console.log(statusTable)
    if (statusTable === undefined) {
      setValue('status', 'Ativos')
    }
    if (statusTable && statusTable === 'Inativos') {
      filteredList = filteredList.filter((item: any) => {
        // console.log(item.ocorrencia_ativa)
        return item.ocorrencia_ativa === 'não'
      })
    } else if (statusTable && statusTable === 'Ativos') {
      filteredList = filteredList.filter((item: any) => {
        // console.log(item.ocorrencia_ativa)
        return item.ocorrencia_ativa === 'sim'
      })
    }

    localStorage.setItem('previewCodeToFilter', CodigoPesquisado || '')
    localStorage.setItem('previewStatusFilter', statusTable || '')
    // Atualize o estado com os dados filtrados
    setList(filteredList)
  }

  const status = [
    {
      id: 1,
      ocorrencia_tabela: 'Inativos',
    },
    {
      id: 2,
      ocorrencia_tabela: 'Todos',
    },
  ]

  useEffect(() => {
    setList(data)
    BuscarFiltro()
  }, [data])

  function createNewDescriptionKeys() {
    let newDescriptionKeys = resultadoCodigoTabelasUnicos.map((item: any) => {
      return {
        ocorrencia_tabela: item.codigo_tabela,
      }
    })
    if (previewCodeToFilter !== 'Todos') {
      newDescriptionKeys.unshift({ ocorrencia_tabela: 'Todos' })
    }
    newDescriptionKeys = newDescriptionKeys.filter(
      (item: any) => item.ocorrencia_tabela !== previewCodeToFilter,
    )

    newDescriptionKeys.sort((a: any, b: any) => {
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

    return newDescriptionKeys
  }

  return (
    <Container>
      <p>Tabelas</p>
      <Box
        style={{
          marginTop: '0.5rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <SelectNoComplete
            p="0px 0px 0px 5px"
            title="Código Tabela"
            value={previewCodeToFilter}
            {...register('codigo_tabela')}
            data={createNewDescriptionKeys()}
          />
          <SelectNoComplete
            p="0px 0px 0px 5px"
            title="Status"
            value={previewStatus}
            {...register('status')}
            data={status}
          />
          <Button
            style={{
              margin: '0px',
              fontSize: '12px',
              width: '5rem',
              border: 'solid 1px',
              padding: '0.5rem',
            }}
            title="Buscar"
            onClick={BuscarFiltro}
          />
        </div>
        <BackPage backRoute="/" discartPageBack />
      </Box>
      <DataGridDemo columns={columns} rows={list} w="100%" />
      <Box>
        <Button
          title="Ver/Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou nenhum para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 item para atualizar')
            } else {
              router.push(`/tabelas/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/tabelas/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0002"
          routeDelete="/tabelas/delete/"
          data={selectedRowIds}
          redirectRouter="tabelas"
        />
      </Box>
    </Container>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await prisma.tabelas.findMany()
    const data = response.map(item => {
      return {
        id: item.id,
        codigo_tabela: item.codigo_tabela,
        ocorrencia_tabela: item.ocorrencia_tabela,
        complemento_ocorrencia_selecao: item.complemento_ocorrencia_selecao,
        ocorrencia_ativa: item.ocorrencia_ativa ? 'sim' : 'não',
      }
    })
    data.sort((a, b) => {
      if (a.ocorrencia_tabela < b.ocorrencia_tabela) {
        return -1
      }
      if (a.ocorrencia_tabela > b.ocorrencia_tabela) {
        return 1
      }
      return 0
    })
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
