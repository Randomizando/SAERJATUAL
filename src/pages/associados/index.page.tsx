/* eslint-disable camelcase */
import { BackPage } from '@/components/BackPage'
import { Button } from '@/components/Button'
// import Modal from '@/components/Modal'
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
import { Box, Container, ContainerFormFilter } from './styled'
import { Associados } from '@prisma/client'
import { format } from 'date-fns'
import ModalCheckUser from '../../components/ModalCheckUser'

const shemaFilter = z.object({
  categoria_filter: z.string(),
  pendenciaAssociado_filter: z.string(),
  situacao_filter: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>

export default function AssociadoList({
  data,
  situacaoAssociado,
  categoriaAssociado,
  AssociadosPayment,
}: any) {
  const router = useRouter()
  const { selectedRowIds } = useContextCustom()
  const [List, setList] = useState(AssociadosPayment)

  const [filterSelect, setFilterSelect] = useState({
    situacao_filter: 'Todos',
    categoria_filter: 'Todos',
    pendenciaAssociado_filter: 'Todos',
  })

  const columns: GridColDef[] = [
    // { field: "id", headerName: "id", width: 60 },
    {
      field: 'matricula_SAERJ',
      headerName: 'Matricula SAERJ',
      width: 177,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'matricula_SBA',
      headerName: 'Matricula SBA',
      width: 140,
      align: 'left',
      headerAlign: 'left',
      disableColumnMenu: true,
    },
    {
      field: 'nome_completo',
      headerName: 'Nome Associado',
      width: 250,
      disableColumnMenu: true,
    },
    {
      field: 'cpf',
      headerName: 'CPF',
      width: 150,
      disableColumnMenu: true,
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      width: 110,
      align: 'left',
      headerAlign: 'left',
      disableColumnMenu: true,
    },
    {
      field: 'categoria',
      headerName: 'Categoria',
      width: 150,
      align: 'left',
      headerAlign: 'left',
      disableColumnMenu: true,
    },
    {
      field: 'ultimo_pagamento',
      headerName: 'Último Pagamento',
      width: 150,
      align: 'left',
      headerAlign: 'left',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'pendencias_SAERJ',
      headerName: 'Pendencias Saerj',
      width: 170,
      align: 'left',
      headerAlign: 'left',
      disableColumnMenu: true,
    },
  ]

  const { register, watch, setValue } = useForm<SchemaFilter>()

  const dataSimNao = [
    {
      id: 1,
      ocorrencia_tabela: 'sim',
    },
    {
      id: 2,
      ocorrencia_tabela: 'não',
    },
  ]

  function BuscarFiltro() {
    const situacaoFilter = watch('situacao_filter')
    const categoriaFilter = watch('categoria_filter')
    const pendenciaAssociadoFilter = watch('pendenciaAssociado_filter')

    // Inicialize a lista com os dados originais
    let filteredList = AssociadosPayment

    const filterSelected = {
      situacao_filter: situacaoFilter,
      categoria_filter: categoriaFilter,
      pendenciaAssociado_filter: pendenciaAssociadoFilter,
    }
    // Realize a filtragem com base nos valores selecionados
    if (situacaoFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        const situacaoMatch =
          situacaoFilter === 'Todos' || item.situacao === situacaoFilter
        return situacaoMatch
      })
    }

    if (categoriaFilter && categoriaFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.categoria === categoriaFilter
      })
    }

    if (pendenciaAssociadoFilter && pendenciaAssociadoFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.pendenciaAssociado === pendenciaAssociadoFilter
      })
    }

    localStorage.setItem('@valuesSelected', JSON.stringify(filterSelected))
    localStorage.setItem('@filtro', JSON.stringify(filteredList))
    setList(filteredList)

    // Imprima a lista filtrada (opcional, apenas para fins de depuração)
    // console.log(filteredList);
  }

  function valuesDefaultFilter() {
    setValue('situacao_filter', 'Todos')
    setValue('categoria_filter', 'Todos')
    setValue('pendenciaAssociado_filter', 'Todos')
  }

  useEffect(() => {
    setList(AssociadosPayment)
    const getFilterList = localStorage.getItem('@filtro')
    if (getFilterList !== null) {
      setList(JSON.parse(getFilterList))
    } else {
      setList(AssociadosPayment)
    }

    const getFilterSelected = localStorage.getItem('@valuesSelected')
    if (getFilterSelected !== null) {
      const getItemsFilter = JSON.parse(getFilterSelected)
      setFilterSelect(getItemsFilter)
      setValue('situacao_filter', getItemsFilter.situacao_filter)
      setValue('categoria_filter', getItemsFilter.categoria_filter)
      setValue(
        'pendenciaAssociado_filter',
        getItemsFilter.pendenciaAssociado_filter,
      )
      BuscarFiltro()
    } else {
      valuesDefaultFilter()
    }
  }, [data])

  const isDataSituacao = situacaoAssociado?.map((item: any) => {
    return {
      ...item,
    }
  })

  const objTodos = {
    id: 0,
    codigo_tabela: 'Situação_Associado',
    ocorrencia_tabela: 'Todos',
  }
  isDataSituacao.unshift(objTodos)
  const objDataSimNaoTodos = {
    id: 0,
    ocorrencia_tabela: 'Todos',
  }

  const isDataSimNao = dataSimNao?.map((item: any) => {
    return {
      ...item,
    }
  })
  isDataSimNao.unshift(objDataSimNaoTodos)

  const isDataCategoria = situacaoAssociado?.map((item: any) => {
    return {
      ...item,
    }
  })

  const objTodosCategoria = {
    id: 0,
    codigo_tabela: 'Categoria_Associado',
    ocorrencia_tabela: 'Todos',
  }
  isDataCategoria.unshift(objTodosCategoria)

  return (
    <Container>
      <p>Associados</p>
      <ContainerFormFilter>
        <Box style={{ justifyContent: 'start', alignItems: 'end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {filterSelect.situacao_filter &&
            filterSelect.situacao_filter !== 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value={`${filterSelect.situacao_filter}`}
                title="Situação"
                data={isDataSituacao}
                {...register('situacao_filter')}
              />
            ) : null}

            {filterSelect.situacao_filter &&
            filterSelect.situacao_filter === 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value="Todos"
                title="Situação"
                data={situacaoAssociado}
                {...register('situacao_filter')}
              />
            ) : null}

            {filterSelect.categoria_filter &&
            filterSelect.categoria_filter !== 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value={`${filterSelect.categoria_filter}`}
                title="Categoria"
                data={isDataCategoria}
                {...register('categoria_filter')}
              />
            ) : null}

            {filterSelect.categoria_filter &&
            filterSelect.categoria_filter === 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value="Todos"
                title="Categoria"
                {...register('categoria_filter')}
                data={categoriaAssociado}
              />
            ) : null}

            {filterSelect.pendenciaAssociado_filter &&
            filterSelect.pendenciaAssociado_filter !== 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value={`${filterSelect.pendenciaAssociado_filter}`}
                title="Pendência Associado"
                data={isDataSimNao}
                {...register('pendenciaAssociado_filter')}
              />
            ) : null}

            {filterSelect.pendenciaAssociado_filter &&
            filterSelect.pendenciaAssociado_filter === 'Todos' ? (
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                value="Todos"
                title="Pendência Associado"
                {...register('pendenciaAssociado_filter')}
                data={dataSimNao}
              />
            ) : null}
          </div>

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
        </Box>
        <BackPage backRoute="/" discartPageBack />
      </ContainerFormFilter>

      <DataGridDemo columns={columns} rows={List} w="100%" />

      <Box>
        <Button
          title="Ver/Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn(
                'Você não selecionou nenhum associado para ver/atualizar',
              )
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione 1 associado para ver/atualizar')
            } else {
              router.push(`/associados/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/associados/cadastro')
          }}
        />

        <ModalCheckUser
          title="Excluir"
          bgColor="#BE0000"
          routeDelete="/associados/delete/"
          message="Operação não autorizada. Favor utilizar o campo Situação através do botão Ver/Atualizar para colocar o Associado como Inativo, Falecido, Cassado, Aposentado, etc"
          data={selectedRowIds}
          redirectRouter="/associados"
        />

        <Button
          title="Adicionais SAERJ"
          style={{ backgroundColor: '#af36f5' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn(
                'Você não selecionou nenhum associado para adicionar dados',
              )
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione 1 associado para adicionar dados')
            } else {
              router.push(`/adicionaisSAERJ/${selectedRowIds}`)
            }
          }}
        />
        <Button
          title="Pagamentos"
          style={{ backgroundColor: '#3663f5' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn(
                'Você não selecionou nenhum associado para visualizar os pagamentos',
              )
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione 1 associado para visualizar os pagamentos')
            } else {
              const searchPaymentAssociado = List.filter((payment_id: any) => {
                return payment_id.id === selectedRowIds[0]
              })
              // console.log(searchPaymentAssociado)
              const payment_id = searchPaymentAssociado[0].pagamento_id
              if (payment_id === null) {
                return toast.warn('Não foi cadastrado pagamento')
              } else {
                router.push(`/pagamentos/atualizar/${payment_id}`)
              }
            }
          }}
        />
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const notViewId = 1
    const response: Associados[] = await prisma.associados.findMany({
      orderBy: {
        matricula_SAERJ: 'desc',
      },
      where: {
        id: {
          not: notViewId,
        },
      },
    })

    const formatarCPF = (cpf: any) => {
      if (!cpf) {
        return null
      }
      cpf = cpf.replace(/\D/g, '')

      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    const data = response.map((item: Associados) => {
      return {
        id: item.id,
        situacao: item.situacao,
        categoria: item.categoria,
        pendencias_SAERJ: item.pendencias_SAERJ,
        matricula_SAERJ: item.matricula_SAERJ,
        nome_completo: item.nome_completo,
        matricula_SBA: item.matricula_SBA,
        cpf: formatarCPF(item.cpf),
      }
    })
    const pagamentos = await prisma.pagamentos.findMany()
    const AssociadosPayment = data.map((associado) => {
      const pagamentoCorrespondente = pagamentos.find(
        (pagamento) =>
          pagamento.matricula_saerj === String(associado.matricula_SAERJ),
      )
      const ultimoPagamento =
        pagamentoCorrespondente &&
        pagamentoCorrespondente.data_pagto_parcela_3 !== null
          ? format(
              new Date(pagamentoCorrespondente.data_pagto_parcela_3),
              'dd/MM/yyyy',
            )
          : pagamentoCorrespondente && pagamentoCorrespondente.data_pagto_unico
            ? format(
                new Date(pagamentoCorrespondente.data_pagto_unico),
                'dd/MM/yyyy',
              )
            : pagamentoCorrespondente &&
                pagamentoCorrespondente.data_pagto_parcela_2
              ? format(
                  new Date(pagamentoCorrespondente.data_pagto_parcela_2),
                  'dd/MM/yyyy',
                )
              : null

      return {
        ...associado,
        pagamento_id:
          pagamentoCorrespondente && pagamentoCorrespondente.id !== null
            ? pagamentoCorrespondente.id
            : null,
        data_pagto_parcela_1:
          pagamentoCorrespondente &&
          pagamentoCorrespondente.data_pagto_parcela_1 !== null
            ? format(
                new Date(pagamentoCorrespondente.data_pagto_parcela_1),
                'dd-MM-yyyy',
              )
            : null,
        data_pagto_parcela_2:
          pagamentoCorrespondente &&
          pagamentoCorrespondente.data_pagto_parcela_2 !== null
            ? format(
                new Date(pagamentoCorrespondente.data_pagto_parcela_2),
                'yyyy-MM-dd',
              )
            : null,
        data_pagto_parcela_3:
          pagamentoCorrespondente &&
          pagamentoCorrespondente.data_pagto_parcela_3 !== null
            ? format(
                new Date(pagamentoCorrespondente.data_pagto_parcela_3),
                'dd/MM/yyyy',
              )
            : null,
        data_pagto_unico:
          pagamentoCorrespondente &&
          pagamentoCorrespondente.data_pagto_unico !== null
            ? format(
                new Date(pagamentoCorrespondente.data_pagto_unico),
                'yyyy-MM-dd',
              )
            : null,
        valor_pagto_parcela_1:
          pagamentoCorrespondente &&
          pagamentoCorrespondente.valor_pagto_parcela_1 !== null
            ? pagamentoCorrespondente.valor_pagto_parcela_1.toString()
            : null,
        valor_pagto_parcela_2:
          pagamentoCorrespondente &&
          pagamentoCorrespondente.valor_pagto_parcela_2 !== null
            ? pagamentoCorrespondente.valor_pagto_parcela_2.toString()
            : null,
        valor_pagto_parcela_3:
          pagamentoCorrespondente &&
          pagamentoCorrespondente.valor_pagto_parcela_3 !== null
            ? pagamentoCorrespondente.valor_pagto_parcela_3.toString()
            : null,
        valor_pagto_unico:
          pagamentoCorrespondente &&
          pagamentoCorrespondente.valor_pagto_unico !== null
            ? pagamentoCorrespondente.valor_pagto_unico.toString()
            : null,
        ultimo_pagamento: ultimoPagamento,
      }
    })

    const situacaoAssociado = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Situação_Associado',
        ocorrencia_ativa: true,
      },
    })
    situacaoAssociado.sort((a, b) => {
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

    const categoriaAssociado = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Categoria_Associado',
        ocorrencia_ativa: true,
      },
    })
    categoriaAssociado.sort((a, b) => {
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

    return {
      props: {
        data,
        situacaoAssociado,
        categoriaAssociado,
        AssociadosPayment,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados da empresa:', error)
    return {
      props: {
        data: [],
        situacaoAssociado: [],
        categoriaAssociado: [],
        AssociadosPayment: [],
      },
    }
  }
}
