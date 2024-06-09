import { BackPage } from '@/components/BackPage'
import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import SelectNoComplete from '@/components/SelectNoComplete'
import DataGridDemo from '@/components/TableList'
import { useContextCustom } from '@/context'
import { prisma } from '@/lib/prisma'
import { EtiquetaPDF } from '@/utils/ticketPagamentos'
import { Modal as MuiModal } from '@mui/material'
import MuiBox from '@mui/material/Box'
import { GridColDef } from '@mui/x-data-grid'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { Box, Container } from './styled'
import {
  dateDefaultPattern,
  dateForFileGeneration,
} from '@/utils/dateFormatter'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Tabelas } from '@prisma/client'
import { maskCPF } from '@/utils/mask'

import { exportJSONToExcel } from '@/utils/export'
import { Loading } from '@/components/Loading'

const schemaFilter = z.object({
  categoria_filter: z.string(),
  situacao_associado_filter: z.string(),
  tipo_pagamento_filter: z.string(),
  forma_pagamento_fiter: z.string(),
  situacao_pagamento_filter: z.string(),
  ano_pagamento_filter: z.string(),
})

type SchemaFilter = z.infer<typeof schemaFilter>

type FilterSelectProps = {
  categoria: string
  situacaoAssociado: string
  tipoPagamento: string
  formaPagamento: string
  situacaoPagamento: string
  anoPagamento: string
}

interface Props {
  dadosTabela: {
    id: string
    matricula_saerj: string
    situacao: string
    nome_completo: string
    cpf: string | null
    categoria: string
    tipo_pagamento: string
    forma_pagamento: string
    ano_anuidade: string
    data_pagto_unico: string | null
    data_pagto_parcela_1: string | null
    data_pagto_parcela_2: string | null
    data_pagto_parcela_3: string | null
  }[]
  tiposPagamentos: Tabelas[]
  formasPagamentos: Tabelas[]
  situacoesPagamentos: Tabelas[]
  categoriasAssociados: Tabelas[]
  situacaoAssociados: Tabelas[]
  anosPagamentos: Tabelas[]
}

export default function Page({
  dadosTabela,
  tiposPagamentos,
  formasPagamentos,
  situacoesPagamentos,
  categoriasAssociados,
  situacaoAssociados,
  anosPagamentos,
}: Props) {
  const currentYear = new Date().getFullYear().toString()

  const { register, watch, setValue } = useForm<SchemaFilter>()

  const [filterSelect, setFilterSelect] = useState<FilterSelectProps>()

  const router = useRouter()
  const { selectedRowIds, setSelection } = useContextCustom()
  const [rows, setRows] = useState<Props['dadosTabela']>([])

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [openDownload, setOpenDownload] = useState(false)
  const handleOpenDownload = () => setOpenDownload(true)
  const handleCloseDownload = () => setOpenDownload(false)

  const search = () => {
    const categoria = watch('categoria_filter')
    const situacaoAssociado = watch('situacao_associado_filter')
    const tipoPagamento = watch('tipo_pagamento_filter')
    const formaPagamento = watch('forma_pagamento_fiter')
    const situacaoPagamento = watch('situacao_pagamento_filter')
    const anoPagamento = watch('ano_pagamento_filter')

    let filteredList = dadosTabela
    if (categoria !== 'Todos') {
      filteredList = filteredList.filter((item) => {
        return item.categoria === categoria
      })
    }

    filteredList = filteredList.filter((item) => {
      return item.id !== 'associado_1' && item.situacao === situacaoAssociado
    })

    if (formaPagamento !== 'Todos') {
      filteredList = filteredList.filter(
        (item) => item.forma_pagamento === formaPagamento,
      )
    }

    if (tipoPagamento !== 'Todos') {
      filteredList = filteredList.filter(
        (item) => item.tipo_pagamento === tipoPagamento,
      )
    }

    if (situacaoPagamento !== 'Todos') {
      if (situacaoPagamento === 'Pagadores') {
        filteredList = filteredList.filter((item) => item.ano_anuidade)
      } else {
        filteredList = filteredList.filter((item) => !item.ano_anuidade)
      }
    }

    if (anoPagamento !== 'Todos') {
      if (situacaoPagamento === 'Todos') {
        filteredList = filteredList.filter((item) => {
          if (item.ano_anuidade === anoPagamento) {
            return true
          } else if (!item.ano_anuidade) {
            const pagamentosDoAno = dadosTabela.filter(
              (row) =>
                row.ano_anuidade === anoPagamento &&
                row.matricula_saerj === item.matricula_saerj,
            )

            return pagamentosDoAno.length === 0
          }

          return false
        })
      } else if (situacaoPagamento === 'Pagadores') {
        filteredList = filteredList.filter(
          (item) => item.ano_anuidade === anoPagamento,
        )
      } else if (situacaoPagamento === 'Devedores') {
        filteredList = filteredList.filter((item) => {
          const pagamentosDoAno = dadosTabela.filter(
            (row) =>
              row.ano_anuidade === anoPagamento &&
              row.matricula_saerj === item.matricula_saerj,
          )

          return pagamentosDoAno.length === 0
        })
      }
    }

    if (!filteredList.length) {
      toast.error('Não foram localizados associados com os filtros informados')
    } else if (filteredList.length === 1) {
      setSelection([filteredList[0].id])
    } else {
      setSelection([])
    }

    localStorage.setItem(
      '@paymentSelectedFilters',
      JSON.stringify({
        categoria,
        situacaoAssociado,
        tipoPagamento,
        formaPagamento,
        situacaoPagamento,
        anoPagamento,
      }),
    )
    localStorage.setItem('@paymentRows', JSON.stringify(filteredList))

    setRows(() => filteredList)
    setFilterSelect(() => ({
      categoria,
      situacaoAssociado,
      tipoPagamento,
      formaPagamento,
      situacaoPagamento,
      anoPagamento,
    }))
  }

  useEffect(() => {
    let results: Props['dadosTabela'] = []
    const getFilterList = localStorage.getItem('@paymentRows')
    const getFilterSelected = localStorage.getItem('@paymentSelectedFilters')

    if (getFilterList !== null) {
      results = JSON.parse(getFilterList)

      if (results.length === 1) {
        setSelection(() => [results[0].id])
      } else {
        setSelection(() => [])
      }

      setRows(() => results)
    }

    if (getFilterSelected !== null) {
      const getItemsFilter = JSON.parse(getFilterSelected)

      setFilterSelect(() => getItemsFilter)
      setValue('categoria_filter', getItemsFilter.categoria)
      setValue('situacao_associado_filter', getItemsFilter.situacaoAssociado)
      setValue('tipo_pagamento_filter', getItemsFilter.tipoPagamento)
      setValue('forma_pagamento_fiter', getItemsFilter.formaPagamento)
      setValue('situacao_pagamento_filter', getItemsFilter.situacaoPagamento)
      setValue('ano_pagamento_filter', getItemsFilter.anoPagamento)
    } else {
      setFilterSelect(() => ({
        categoria: 'Todos',
        situacaoAssociado: 'Ativo',
        tipoPagamento: 'Todos',
        formaPagamento: 'Todos',
        situacaoPagamento: 'Pagadores',
        anoPagamento: currentYear,
      }))
      setValue('categoria_filter', 'Todos')
      setValue('situacao_associado_filter', 'Ativo')
      setValue('tipo_pagamento_filter', 'Todos')
      setValue('forma_pagamento_fiter', 'Todos')
      setValue('situacao_pagamento_filter', 'Pagadores')
      setValue('ano_pagamento_filter', currentYear)
    }

    if (!results.length) {
      search()
    }
  }, [dadosTabela])

  const columns: GridColDef[] = [
    {
      field: 'matricula_saerj',
      headerName: 'Matricula SAERJ',
      width: 140,
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
      width: 140,
      disableColumnMenu: true,
    },
    {
      field: 'categoria',
      headerName: 'Categoria',
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: 'tipo_pagamento',
      headerName: 'Tipo Pagamento',
      width: 145,
      disableColumnMenu: true,
    },
    {
      field: 'forma_pagamento',
      headerName: 'Forma Pagamento',
      width: 150,
      disableColumnMenu: true,
    },
    {
      field: 'ano_anuidade',
      headerName: 'Ano Pagamento',
      width: 130,
      disableColumnMenu: true,
    },
    {
      field: 'data_pagto_unico',
      headerName: 'Data Parcela Única',
      width: 145,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'data_pagto_parcela_1',
      headerName: 'Data 1ª Parcela',
      width: 130,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'data_pagto_parcela_2',
      headerName: 'Data 2ª Parcela',
      width: 130,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'data_pagto_parcela_3',
      headerName: 'Data 3ª Parcela',
      width: 130,
      disableColumnMenu: true,
      sortable: false,
    },
  ]

  const gerarEtiqueta = () => {
    EtiquetaPDF(selectedRowIds)
    handleClose()
  }

  const printPayers = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF()
    const payersRows: (string | number | null)[][] = []

    dadosTabela.forEach((row) => {
      if (!row.data_pagto_unico && !row.data_pagto_parcela_1) return

      payersRows.push([
        row.id,
        row.matricula_saerj,
        row.nome_completo,
        maskCPF(row.cpf || ''),
        row.tipo_pagamento,
        row.forma_pagamento,
        row.ano_anuidade,
        row.data_pagto_unico,
        row.data_pagto_parcela_1,
        row.data_pagto_parcela_2,
        row.data_pagto_parcela_3,
      ])
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    doc.autoTable({
      head: [
        [
          'ID',
          'Matr SAERJ',
          'Nome Associado',
          'CPF',
          'Categoria',
          'Tipo Pagamento',
          'Forma Pagamento',
          'Ano Pagamento',
          'Data Parc Única',
          'Data 1ª Parc',
          'Data 2ª Parc',
          'Data 3ª Parc',
        ],
      ],
      body: payersRows,
      headStyles: {
        fontSize: 8,
        fillColor: [13, 169, 164],
      },
      styles: { fontSize: 6 },
    })

    doc.autoPrint()
    window.open(
      doc.output('bloburl'),
      '_blank',
      'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes',
    )
  }

  const downloadTableRows = () => {
    const tablePattern = (row: Props['dadosTabela'][number]) => ({
      'Matricula SAERJ': row.matricula_saerj,
      'Nome Associado': row.nome_completo,
      CPF: maskCPF(row.cpf || ''),
      Categoria: row.categoria,
      'Tipo Pagamento': row.tipo_pagamento,
      'Forma Pagamento': row.forma_pagamento,
      'Ano Pagamento': row.ano_anuidade,
      'Data Parc Única': row.data_pagto_unico,
      'Data 1ª Parc': row.data_pagto_parcela_1,
      'Data 2ª Parc': row.data_pagto_parcela_2,
      'Data 3ª Parc': row.data_pagto_parcela_3,
    })

    const data = () => {
      if (selectedRowIds.length) {
        return rows
          .filter((row) => selectedRowIds.includes(row.id))
          .map(tablePattern)
      }

      return rows.map(tablePattern)
    }

    exportJSONToExcel(data(), `pagamentos_${dateForFileGeneration()}`, [
      { wpx: 100 },
      { wpx: 200 },
      { wpx: 100 },
      { wpx: 150 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 90 },
      { wpx: 90 },
      { wpx: 80 },
      { wpx: 80 },
      { wpx: 80 },
    ])

    handleCloseDownload()
  }

  if (!filterSelect) return <Loading />

  return (
    <Container>
      {/* Etiquetas modal */}
      <MuiModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MuiBox
          sx={{
            p: 4,
            top: '50%',
            left: '50%',
            width: 400,
            bgcolor: 'background.paper',
            position: 'absolute' as const,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <p style={{ fontFamily: 'Roboto' }}>
            Confirma a impressão de etiquetas para os Associados selecionados?
          </p>

          <MuiBox
            style={{
              gap: '2rem',
              width: '100%',
              display: 'flex',
              marginTop: '1.5rem',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <Button title={'Ok'} onClick={gerarEtiqueta} />

            <Button title={'Cancelar'} onClick={handleClose} />
          </MuiBox>
        </MuiBox>
      </MuiModal>

      {/* Download modal */}
      <MuiModal
        open={openDownload}
        onClose={handleCloseDownload}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MuiBox
          sx={{
            p: 4,
            top: '50%',
            left: '50%',
            width: 400,
            bgcolor: 'background.paper',
            position: 'absolute' as const,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <p style={{ fontFamily: 'Roboto' }}>
            O Download será efetuado com base nos critérios especificados nesta
            tela.
          </p>

          <MuiBox
            style={{
              gap: '2rem',
              width: '100%',
              display: 'flex',
              marginTop: '1.5rem',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <Button title="Continuar" onClick={downloadTableRows} />

            <Button title={'Cancelar'} onClick={handleCloseDownload} />
          </MuiBox>
        </MuiBox>
      </MuiModal>

      <p>Pagamentos</p>

      <Box
        style={{
          alignItems: 'end',
          marginTop: '0.5rem',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <SelectNoComplete
            value={filterSelect?.categoria}
            data={categoriasAssociados.filter(
              (ca) => ca.ocorrencia_tabela !== filterSelect?.categoria,
            )}
            title="Categoria"
            p="0px 0px 0px 0.5rem"
            {...register('categoria_filter')}
          />

          <SelectNoComplete
            value={filterSelect?.situacaoAssociado}
            data={situacaoAssociados.filter(
              (sa) => sa.ocorrencia_tabela !== filterSelect?.situacaoAssociado,
            )}
            title="Situação Associados"
            p="0px 0px 0px 0.5rem"
            {...register('situacao_associado_filter')}
          />
          <SelectNoComplete
            value={filterSelect?.tipoPagamento}
            data={tiposPagamentos.filter(
              (tp) => tp.ocorrencia_tabela !== filterSelect?.tipoPagamento,
            )}
            title="Tipo Pagamento"
            p="0px 0px 0px 0.5rem"
            {...register('tipo_pagamento_filter')}
          />

          <SelectNoComplete
            value={filterSelect?.formaPagamento}
            data={formasPagamentos.filter(
              (fp) => fp.ocorrencia_tabela !== filterSelect?.formaPagamento,
            )}
            title="Forma Pagamento"
            p="0px 0px 0px 0.5rem"
            {...register('forma_pagamento_fiter')}
          />

          <SelectNoComplete
            value={filterSelect?.situacaoPagamento}
            data={situacoesPagamentos.filter(
              (sp) => sp.ocorrencia_tabela !== filterSelect?.situacaoPagamento,
            )}
            title="Situação Pagamento"
            p="0px 0px 0px 0.5rem"
            {...register('situacao_pagamento_filter')}
          />

          <SelectNoComplete
            value={filterSelect?.anoPagamento}
            data={anosPagamentos.filter(
              (ap) => ap.ocorrencia_tabela !== filterSelect?.anoPagamento,
            )}
            title="Ano Pagamento"
            p="0px 0px 0px 0.5rem"
            {...register('ano_pagamento_filter')}
          />

          <Button
            title="Buscar"
            onClick={search}
            style={{ width: '5rem', fontSize: '12px' }}
          />

          <Button
            title="Imprimir Pagadores"
            onClick={printPayers}
            style={{ width: '8rem', fontSize: '12px' }}
          />

          {rows.length > 0 && (
            <Button
              title="Download"
              onClick={handleOpenDownload}
              style={{ width: '5rem', fontSize: '12px' }}
            />
          )}

          {selectedRowIds.length > 0 && (
            <Button
              title="Gerar etiqueta"
              onClick={handleOpen}
              style={{ width: '6rem', fontSize: '12px' }}
            />
          )}
        </div>
        <BackPage backRoute="/" discartPageBack />
      </Box>

      {rows && <DataGridDemo columns={columns} rows={rows} w="100%" />}

      <Box>
        <Button
          title="Ver/Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('Você não selecionou o pagamento para ver/atualizar')
            } else if (
              selectedRowIds.length >= 2 &&
              selectedRowIds.every((id: string) => {
                return rows.find((row) => row.id === id)?.ano_anuidade
              })
            ) {
              toast.warn('Selecione 1 pagamento para ver/atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione 1 associado')
            } else if (
              !rows.find(
                (row) => row.id === selectedRowIds[0] && row.ano_anuidade,
              )
            ) {
              toast.warn('Não há pagamento para este associado')
            } else {
              router.push(`/pagamentos/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/pagamentos/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0000"
          data={selectedRowIds}
          redirectRouter="pagamentos"
          routeDelete="/pagamentos/delete/"
        />
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const resultadoPagamentos = await prisma.pagamentos.findMany()
    const resultadoAssociados = await prisma.associados.findMany()
    const tabelas = await prisma.tabelas.findMany({
      where: {
        AND: {
          ocorrencia_ativa: true,
        },
        OR: [
          {
            codigo_tabela: 'Tipo_Pagamento',
          },
          {
            codigo_tabela: 'Forma_Pagamento',
          },
          {
            codigo_tabela: 'Categoria_Associado',
          },
          {
            codigo_tabela: 'Situação_Associado',
          },
        ],
      },
    })

    const tiposPagamentos: Tabelas[] = [
      {
        id: 1,
        codigo_tabela: 'Tipo_Pagamento',
        ocorrencia_tabela: 'Todos',
        complemento_ocorrencia_selecao: '',
        ocorrencia_ativa: true,
      },
    ]
    const formasPagamentos: Tabelas[] = [
      {
        id: 1,
        codigo_tabela: 'Forma_Pagamento',
        ocorrencia_tabela: 'Todos',
        complemento_ocorrencia_selecao: '',
        ocorrencia_ativa: true,
      },
    ]
    const categoriasAssociados: Tabelas[] = [
      {
        id: 1,
        codigo_tabela: 'Categoria_Associado',
        ocorrencia_tabela: 'Todos',
        complemento_ocorrencia_selecao: '',
        ocorrencia_ativa: true,
      },
    ]
    const situacaoAssociados: Tabelas[] = []
    tabelas.forEach((item) => {
      if (item.codigo_tabela === 'Tipo_Pagamento') {
        return tiposPagamentos.push(item)
      } else if (item.codigo_tabela === 'Forma_Pagamento') {
        return formasPagamentos.push(item)
      } else if (item.codigo_tabela === 'Categoria_Associado') {
        return categoriasAssociados.push(item)
      } else if (item.codigo_tabela === 'Situação_Associado') {
        return situacaoAssociados.push(item)
      }
    })

    const situacoesPagamentos: Tabelas[] = [
      {
        id: 1,
        codigo_tabela: 'Situacao_Pagamento',
        ocorrencia_tabela: 'Todos',
        complemento_ocorrencia_selecao: '',
        ocorrencia_ativa: true,
      },
      {
        id: 2,
        codigo_tabela: 'Situacao_Pagamento',
        ocorrencia_tabela: 'Pagadores',
        complemento_ocorrencia_selecao: '',
        ocorrencia_ativa: true,
      },
      {
        id: 3,
        codigo_tabela: 'Situacao_Pagamento',
        ocorrencia_tabela: 'Devedores',
        complemento_ocorrencia_selecao: '',
        ocorrencia_ativa: true,
      },
    ]

    const anosPagamentos: Tabelas[] = []
    const dadosTabela: Props['dadosTabela'] = []

    for (let i = 0; i < resultadoAssociados.length; i++) {
      const pagamentos = resultadoPagamentos.filter((pagamento) => {
        if (
          pagamento.ano_anuidade &&
          !anosPagamentos.find(
            (ano) => ano.ocorrencia_tabela === pagamento.ano_anuidade,
          )
        ) {
          anosPagamentos.push({
            id: anosPagamentos.length + 1,
            codigo_tabela: 'Ano_Pagamento',
            ocorrencia_tabela: pagamento.ano_anuidade,
            complemento_ocorrencia_selecao: '',
            ocorrencia_ativa: true,
          })
        }

        return (
          resultadoAssociados[i].matricula_SAERJ ===
          parseInt(pagamento.matricula_saerj, 10)
        )
      })

      if (pagamentos.length > 0) {
        pagamentos.forEach((pagamento) =>
          dadosTabela.push({
            id: pagamento.id.toString(),
            matricula_saerj: pagamento.matricula_saerj,
            situacao: resultadoAssociados[i].situacao || '',
            nome_completo: resultadoAssociados[i].nome_completo || '',
            cpf: resultadoAssociados[i].cpf
              ? maskCPF(resultadoAssociados[i].cpf)
              : null,
            categoria: resultadoAssociados[i].categoria || '',
            tipo_pagamento: pagamento.tipo_pagamento || '',
            forma_pagamento: pagamento.forma_pagamento || '',
            ano_anuidade: pagamento.ano_anuidade || '',
            data_pagto_unico: pagamento.data_pagto_unico
              ? dateDefaultPattern(pagamento.data_pagto_unico?.toString() || '')
              : null,
            data_pagto_parcela_1: pagamento.data_pagto_parcela_1
              ? dateDefaultPattern(
                  pagamento.data_pagto_parcela_1?.toString() || '',
                )
              : null,
            data_pagto_parcela_2: pagamento.data_pagto_parcela_2
              ? dateDefaultPattern(
                  pagamento.data_pagto_parcela_2?.toString() || '',
                )
              : null,
            data_pagto_parcela_3: pagamento.data_pagto_parcela_3
              ? dateDefaultPattern(
                  pagamento.data_pagto_parcela_3?.toString() || '',
                )
              : null,
          }),
        )
      } else {
        dadosTabela.push({
          id: `associado_${resultadoAssociados[i].id}`,
          matricula_saerj:
            resultadoAssociados[i].matricula_SAERJ?.toString() || '',
          situacao: resultadoAssociados[i].situacao || '',
          nome_completo: resultadoAssociados[i].nome_completo || '',
          cpf: resultadoAssociados[i].cpf
            ? maskCPF(resultadoAssociados[i].cpf)
            : null,
          categoria: resultadoAssociados[i].categoria || '',
          tipo_pagamento: '',
          forma_pagamento: '',
          ano_anuidade: '',
          data_pagto_unico: null,
          data_pagto_parcela_1: null,
          data_pagto_parcela_2: null,
          data_pagto_parcela_3: null,
        })
      }
    }

    anosPagamentos.push({
      id: anosPagamentos.length + 1,
      codigo_tabela: 'Ano_Pagamento',
      ocorrencia_tabela: 'Todos',
      complemento_ocorrencia_selecao: '',
      ocorrencia_ativa: true,
    })

    return {
      props: {
        dadosTabela,
        tiposPagamentos,
        formasPagamentos,
        situacoesPagamentos,
        categoriasAssociados,
        situacaoAssociados,
        anosPagamentos,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados da empresa:', error)

    return {
      props: {
        dadosTabela: [],
        tiposPagamentos: [],
        formasPagamentos: [],
        situacoesPagamentos: [],
        categoriasAssociados: [],
        situacaoAssociados: [],
        anosPagamentos: [],
      },
    }
  } finally {
    await prisma.$disconnect()
  }
}
