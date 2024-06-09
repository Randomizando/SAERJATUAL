/* eslint-disable camelcase */
'User-server'

import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { useContextCustom } from '@/context'
import { CircularProgress, Modal } from '@mui/material'
import { ContainerFilters, HeaderBirthdays } from './styled'
import { Button } from '@ignite-ui/react'
import { EtiquetaPDF } from '@/utils/ticketsAssociates'
import { Button as ButtonEtiqueta } from '../Button'
import SelectNoComplete from '../SelectNoComplete'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { BackPage } from '../BackPage'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import ConfirmationModal from '../ModalConfirmation'
import { DownloadSimple, File } from 'phosphor-react'
import DataGridDemo from '../TableList'
import TestConfirmationModal from '../ModalTestConfirmation'
import { AssociateDTO } from '@/pages/api/associados/sendEmailAniversario/index.api'

const shemaFilter = z.object({
  data_filter: z.string(),
  situacao_filter: z.string(),
  categoria_filter: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>

const TableBirthdays = ({
  rows,
  onRefetch,
  columns,
  w,
  situacaoAssociado,
  categoriaAssociado,
}: any) => {
  const { setSelection, selectedRowIds } = useContextCustom()

  const [openTagConfirmationModal, setOpenTagConfirmationModal] =
    useState(false)
  const handleOpenTagConfirmationModal = () => setOpenTagConfirmationModal(true)
  const handleCloseTagConfirmationModal = () =>
    setOpenTagConfirmationModal(false)

  const [openErrorModal, setOpenErrorModal] = useState(false)
  const handleOpenErrorModal = () => setOpenErrorModal(true)
  const handleCloseErrorModal = () => setOpenErrorModal(false)

  const [loader, setLoader] = useState(false)

  const [quantidadeLinhas, setQuantidadeLinhas] = useState(10)

  const [dia, setDia] = useState<number>(0)
  const [mes, setMes] = useState<string>('')
  const [ano, setAno] = useState<number>(0)
  const [primeiroDiaSemana, setPrimeiroDiaSemana] = useState<Date>()
  const [ultimoDiaSemana, setUltimoDiaSemana] = useState<Date>()

  const [defaultFile, setDefaultFile] = useState('')
  const [nameFile, setNameFile] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [htmlNotContent, setHtmlNotContent] = useState(false)

  const [suitableAssociates, setSuitableAssociates] = useState<AssociateDTO[]>(
    [],
  )
  const [showFilteredData, setShowFilteredData] = useState(false)
  const [openSendEmailConfirmationModal, setOpenSendEmailConfirmationModal] =
    useState(false)
  const [emailError, setEmailError] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState(rows)
  const [confirmationMessage, setConfirmationMessage] = useState<string>(
    'Tem certeza de que deseja enviar um e-mail para os aniversariantes dos últimos 5 dias que ainda não receberam uma mensagem?',
  )
  const [
    openSendTestEmailConfirmationModal,
    setOpenSendTestEmailConfirmationModal,
  ] = useState(false)

  const { register, watch, setValue } = useForm<SchemaFilter>()

  const filterSelect = {
    data_filter: 'Todos',
    situacao_filter: 'Todos, exceto falecidos',
    categoria_filter: 'Todos',
  }

  const filtroData = [
    {
      id: 'month',
      ocorrencia_tabela: 'Mês',
    },
    {
      id: 'week',
      ocorrencia_tabela: 'Semana',
    },
    {
      id: 'day',
      ocorrencia_tabela: 'Dia',
    },
  ]

  useEffect(() => {
    getQuantityRows()
    setSelection([])
  }, [])

  useEffect(() => {
    async function verificarPasta() {
      try {
        const response = await fetch('/api/checkExistHTML/')
        if (!response.ok) {
          throw new Error('Erro ao chamar a API')
        }
        const data = await response.json()
        const nomeDoArquivo = data.arquivos[0]

        setNameFile(nomeDoArquivo)
        setDefaultFile(data.conteudoArquivo)
        setHtmlNotContent(true)
      } catch (error) {
        console.error('Erro ao chamar a API:', error)
      }
    }

    verificarPasta()
  }, [rows])

  useEffect(() => {
    if (rows.length === 1) {
      setSelection([rows[0].id])
    }
    valuesDefaultFilter()

    const date = new Date()

    // Define o primeiro dia da semana
    const primeiroDia = new Date(date)
    primeiroDia.setDate(date.getDate() - date.getDay()) // Define o primeiro dia da semana atual

    // Define o último dia da semana
    const ultimoDia = new Date(primeiroDia)
    ultimoDia.setDate(primeiroDia.getDate() + 6) // Define o último dia da semana atual

    setPrimeiroDiaSemana(primeiroDia)
    setUltimoDiaSemana(ultimoDia)

    setMes(
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : (date.getMonth() + 1).toString(),
    )
    setDia(date.getDate())
    setAno(date.getFullYear())

    const diaAtual = date.getDay()

    const diferencaDomingo = diaAtual - 0
    date.setDate(date.getDate() - diferencaDomingo)

    for (let i = 0; i < 7; i++) {
      date.setDate(date.getDate() + 1)
    }
  }, [rows])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0])
      readHtmlFile(acceptedFiles[0])
    },
  })

  function BuscarFiltro() {
    setShowFilteredData(false)
    setLoader(true)
    const situacaoFilter = watch('situacao_filter')
    const categoriaFilter = watch('categoria_filter')
    const dataFilter = watch('data_filter')

    // Inicialize a lista com os dados originais
    let filteredList = rows

    if (dataFilter && dataFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        if (item.situacao !== 'Falecido') {
          if (item.data_nascimento != null) {
            const data_nasc = item.data_nascimento.split('/')

            if (dataFilter === 'Mês') {
              const filterMonth = data_nasc[1] === mes

              return filterMonth
            }

            if (dataFilter === 'Semana') {
              const dataNascString = item.data_nascimento.split('/')
              const dataNascimento = new Date(
                ano + '-' + dataNascString[1] + '-' + dataNascString[0],
              )

              if (
                primeiroDiaSemana !== undefined &&
                ultimoDiaSemana !== undefined
              ) {
                const filterWeek =
                  dataNascimento >= primeiroDiaSemana &&
                  dataNascimento <= ultimoDiaSemana
                return filterWeek
              }
            }

            if (dataFilter === 'Dia') {
              const filterDay =
                parseInt(data_nasc[0], 10) === dia && data_nasc[1] === mes

              return filterDay
            }

            return true // Caso não seja nenhum dos filtros, incluir na lista
          } else {
            return false
          }
        } else {
          return false
        }
      })
    }

    if (situacaoFilter !== 'Todos, exceto falecidos') {
      filteredList = filteredList.filter((item: any) => {
        const situacaoMatch =
          item.situacao === situacaoFilter && item.situacao !== 'Falecido'
        return situacaoMatch
      })
    }

    if (categoriaFilter !== 'Todos') {
      filteredList = filteredList.filter((item: any) => {
        return item.categoria === categoriaFilter
      })
    }

    if (filteredList.length > 0) {
      // Atualize o estado com os dados filtrados
      setLoader(false)
      setShowFilteredData(true)
      setFilteredData(filteredList)
    } else {
      setLoader(false)
      toast.warn('A consulta não possui dados para serem exibidos.')
      setFilteredData([])
    }
  }

  const getQuantityRows = async () => {
    const response = await fetch(`/api/parametros`)
    const data = await response.json()

    if (data && data.length > 0) {
      setQuantidadeLinhas(data[0].quantidade_linhas_listas)
    }
  }

  const gerarEtiqueta = () => {
    EtiquetaPDF(selectedRowIds)
    handleCloseTagConfirmationModal()
  }

  function valuesDefaultFilter() {
    setValue('data_filter', '')
    setValue('situacao_filter', 'Todos, exceto falecidos')
    setValue('categoria_filter', 'Todos')
  }

  const readHtmlFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target) {
        const htmlString = event.target.result as string
        // setHtmlContent(htmlString);
        toast.success('Operação concluída com sucesso!')
      }
    }
    reader.readAsText(file)
  }

  const handleUploadHTML = async (file: any) => {
    try {
      if (!file) {
        console.error('Nenhum arquivo selecionado.')
        return
      }

      const formData = new FormData()
      formData.append('htmlFile', file)

      const { data } = await axios.post(
        '/api/parametros/uploadHTML',
        {
          formData: file,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleSendEmails = async () => {
    if (htmlNotContent && !file) {
      if (suitableAssociates.length > 0) {
        try {
          const result = await axios.post(
            '/api/associados/sendEmailAniversario',
            {
              associates: suitableAssociates,
              htmlBody: defaultFile,
            },
          )

          if (file) {
            handleUploadHTML(file)
          }

          const failedEmails = result.data.failedEmails
          setEmailError(failedEmails)

          if (failedEmails) {
            if (failedEmails.length > 0) {
              toast.warning('Alguns email não foram enviados!')
              handleOpenErrorModal()
            }
          } else {
            toast.success('Operação concluída com sucesso!')
          }
        } catch (error) {
          console.error(error)
          toast.error('Erro ao enviar o email!')
        }
      } else {
        return false
      }
    } else {
      if (suitableAssociates.length > 0) {
        if (file && file.type === 'text/html') {
          try {
            const result = await axios.post(
              '/api/associados/sendEmailAniversario',
              {
                associates: suitableAssociates,
                htmlBody: defaultFile,
              },
            )

            if (file) {
              handleUploadHTML(file)
            }

            const failedEmails = result.data.failedEmails
            setEmailError(failedEmails)

            if (failedEmails) {
              if (failedEmails.length > 0) {
                toast.warning('Alguns email não foram enviados!')
                handleOpenErrorModal()
              }
            } else {
              toast.success('Operação concluída com sucesso!')
            }
          } catch (error) {
            console.error(error)
            toast.error('Erro ao enviar o email!')
          }
        } else {
          toast.warning('Formato inválido, informe um arquivo HTML.')
        }
      } else {
        return false
      }
    }
  }

  const handleSendTestEmails = async (sendMultiple: boolean) => {
    const emailList = suitableAssociates.map((associate) => associate.email)
    if (htmlNotContent && !file) {
      if (suitableAssociates.length > 0) {
        try {
          const result = await axios.post(
            '/api/associados/sendTestEmailAniversario',
            {
              emailList,
              htmlBody: defaultFile,
              sendMultiple,
            },
          )

          if (file) {
            handleUploadHTML(file)
          }

          const failedEmails = result.data.failedEmails
          setEmailError(failedEmails)

          if (failedEmails) {
            if (failedEmails.length > 0) {
              toast.warning('Alguns email não foram enviados!')
              handleOpenErrorModal()
            }
          } else {
            toast.success('Operação concluída com sucesso!')
          }
        } catch (error) {
          console.error(error)
          toast.error('Erro ao enviar o email!')
        }
      } else {
        return false
      }
    } else {
      if (suitableAssociates.length > 0) {
        if (file && file.type === 'text/html') {
          try {
            const result = await axios.post(
              '/api/associados/sendTestEmailAniversario',
              {
                emailList,
                htmlBody: defaultFile,
                sendMultiple,
              },
            )

            if (file) {
              handleUploadHTML(file)
            }

            const failedEmails = result.data.failedEmails
            setEmailError(failedEmails)

            if (failedEmails) {
              if (failedEmails.length > 0) {
                toast.warning('Alguns email não foram enviados!')
                handleOpenErrorModal()
              }
            } else {
              toast.success('Operação concluída com sucesso!')
            }
          } catch (error) {
            console.error(error)
            toast.error('Erro ao enviar o email!')
          }
        } else {
          toast.warning('Formato inválido, informe um arquivo HTML.')
        }
      } else {
        return false
      }
    }
  }

  function getSuitableAssociates() {
    const today = new Date()
    const refinedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    )
    const fiveDaysAgo = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 5,
    )

    const filteredAssociates = rows.filter((associate: any) => {
      // Nãa incluir associados sem data de nascimento
      if (!associate.data_nascimento) return false

      const [lastBirthdayDay, lastBirthdayMonth] =
        associate.data_nascimento.split('/')
      // Extrair o aniversário do Associado no ano atual
      const lastBirthday = new Date(
        today.getFullYear(),
        lastBirthdayMonth - 1,
        lastBirthdayDay,
      )
      // Se aniversário do ano atual estiver no futuro, extrair o aniversário do ano passado
      const refinedLastBirthday =
        lastBirthday.getTime() <= today.getTime()
          ? lastBirthday
          : new Date(
              today.getFullYear() - 1,
              lastBirthdayMonth - 1,
              lastBirthdayDay,
            )

      // Não incluir aniversários anteriores à data de 5 dias atrás (hoje - 5)
      if (fiveDaysAgo.getTime() > refinedLastBirthday.getTime()) return false

      // Incluir associados sem data de último envio do email
      if (!associate.data_ultimo_envio_email_aniversario) return true

      // Extrair data do último envio
      const [lastEmailDay, lastEmailMonth, lastEmailYear] =
        associate.data_ultimo_envio_email_aniversario.split('/')
      const lastEmail = new Date(
        lastEmailYear,
        lastEmailMonth - 1,
        lastEmailDay,
      )

      // Se o email tiver sido enviado hoje,
      if (lastEmail.getTime() === refinedToday.getTime()) {
        // salvar mensagem de confirmação customizada
        setConfirmationMessage(
          'Email Aniversariantes já enviado na data atual, confirma novo envio?',
        )
        // Incluir como apto a receber email novamente
        return true
      } else {
        // Se email não tiver sido enviado hoje, não incluir
        return false
      }
    })

    return filteredAssociates
  }

  return (
    <>
      <Modal
        open={openTagConfirmationModal}
        onClose={handleCloseTagConfirmationModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
          }}
        >
          <p style={{ fontFamily: 'Roboto' }}>
            Confirma a impressão de etiquetas para os Associados selecionados?
          </p>
          <Box
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '2rem',
              width: '100%',
            }}
          >
            <Button
              style={{ padding: '0.5rem', height: 'auto' }}
              onClick={gerarEtiqueta}
            >
              Ok
            </Button>
            <Button
              style={{ padding: '0.5rem', height: 'auto' }}
              onClick={handleCloseTagConfirmationModal}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>

      <HeaderBirthdays>
        <ContainerFilters>
          <div
            style={{
              display: 'flex',
              alignItems: 'end',
              gap: '0.5rem',
              width: 'fit-content',
            }}
          >
            <SelectNoComplete
              p="0px 0px 0px 0.5rem"
              value={`${filterSelect.data_filter}`}
              title="Período"
              data={filtroData}
              {...register('data_filter')}
            />
            <SelectNoComplete
              p="0px 0px 0px 0.5rem"
              value={`${filterSelect.categoria_filter}`}
              title="Categoria"
              {...register('categoria_filter')}
              data={categoriaAssociado}
            />
            <SelectNoComplete
              p="0px 0px 0px 0.5rem"
              value={`${filterSelect.situacao_filter}`}
              title="Situação"
              {...register('situacao_filter')}
              data={situacaoAssociado}
            />
          </div>

          <ButtonEtiqueta
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

          {selectedRowIds.length > 0 && (
            <ButtonEtiqueta
              style={{
                backgroundColor: `${'#0da9a4'}`,
                margin: '0px',
                fontSize: '12px',
                border: 'solid 1px',
                padding: '0.5rem',
              }}
              onClick={handleOpenTagConfirmationModal}
              title={'Gerar etiqueta'}
            />
          )}
          <div style={{ marginLeft: 240 }}>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div>
                <DownloadSimple
                  color="rgb(13, 169, 164)"
                  style={{ marginLeft: 70 }}
                  size={30}
                />
                <p style={{ fontSize: 11, marginTop: 2 }}>
                  Clique aqui e Selecione um arquivo
                </p>
              </div>
            </div>
          </div>
        </ContainerFilters>

        <BackPage backRoute="/" discartPageBack />
      </HeaderBirthdays>

      {quantidadeLinhas && filteredData.length > 0 && (
        <Box sx={{ height: '60%', width: w, marginTop: '1rem' }}>
          <DataGridDemo
            rows={showFilteredData ? filteredData : rows}
            columns={columns}
          />
        </Box>
      )}

      <div
        style={{
          display: 'flex',
          backgroundColor: '',
          marginTop: 10,
          alignItems: 'center',
          gap: 10,
        }}
      >
        <ButtonEtiqueta
          style={{
            margin: '0px',
            fontSize: '12px',
            width: '6rem',
            border: 'solid 1px',
            padding: '0.5rem',
            marginLeft: '100px',
          }}
          title="Testar Email"
          onClick={() => {
            const filteredAssociates = getSuitableAssociates()
            if (filteredAssociates.length === 0) {
              toast.warn('A consulta não possui dados para serem exibidos.')
            } else {
              setOpenSendTestEmailConfirmationModal(true)
              const associates = filteredAssociates.map((row: any) => ({
                id: row.id,
                email: row.email,
              }))
              setSuitableAssociates(associates)
              const ids = filteredAssociates.map((row: any) => row.id)
              setSelection(ids)
              setShowFilteredData(true)
              setFilteredData(filteredAssociates)
            }
          }}
        />

        {emailError?.length > 0 && (
          <Modal
            open={openErrorModal}
            onClose={handleCloseErrorModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <p
                  id="modal-modal-title"
                  style={{ fontSize: 18, fontWeight: 'bold' }}
                >
                  Lista de emails que não foram enviado:
                </p>
                {emailError.map((email: any, index: number) => (
                  <p
                    id="modal-modal-description"
                    key={index}
                    style={{ fontSize: 12 }}
                  >
                    {' '}
                    {email}
                  </p>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 30,
                }}
              >
                <ButtonEtiqueta
                  style={{
                    margin: '0px',
                    fontSize: '12px',
                    width: '6rem',
                    border: 'solid 1px',
                    padding: '0.5rem',
                  }}
                  title="Fechar"
                  onClick={() => {
                    handleCloseErrorModal()
                    setShowFilteredData(false)
                  }}
                />
              </div>
            </Box>
          </Modal>
        )}

        <ConfirmationModal
          open={openSendEmailConfirmationModal}
          onOpen={() => {
            const filteredAssociates = getSuitableAssociates()
            if (filteredAssociates.length === 0) {
              toast.warn('A consulta não possui dados para serem exibidos.')
            } else {
              setOpenSendEmailConfirmationModal(true)
              const associates = filteredAssociates.map((row: any) => ({
                id: row.id,
                email: row.email,
              }))
              setSuitableAssociates(associates)
              const ids = filteredAssociates.map((row: any) => row.id)
              setSelection(ids)
              setShowFilteredData(true)
              setFilteredData(filteredAssociates)
            }
          }}
          onConfirm={async () => {
            await handleSendEmails()
            await onRefetch()
            setOpenSendEmailConfirmationModal(false)
            BuscarFiltro()
          }}
          onCancelOrClose={async () => {
            setOpenSendEmailConfirmationModal(false)
          }}
          confirmationMessage={confirmationMessage}
        />

        <TestConfirmationModal
          open={openSendTestEmailConfirmationModal}
          onConfirm={async (sendMultiple: boolean) => {
            await handleSendTestEmails(sendMultiple)
            await onRefetch()
            setOpenSendTestEmailConfirmationModal(false)
            BuscarFiltro()
          }}
          onCancelOrClose={async () => {
            setOpenSendTestEmailConfirmationModal(false)
          }}
          confirmationMessage="Deseja enviar um e-mail único ou múltiplos e-mails?"
        />

        {!file && <div style={{ width: 250 }}></div>}

        <div
          style={{
            display: 'flex',
            marginLeft: 450,
            gap: 3,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {file && <File size={35} color="#0DA9A4" weight="fill" />}
          {file && (
            <p style={{ fontSize: 12, color: '#787878' }}>{file.name}</p>
          )}
          {htmlNotContent && !file && (
            <File size={35} color="#0DA9A4" weight="fill" />
          )}
          {htmlNotContent && !file && (
            <p style={{ fontSize: 12, color: '#787878' }}>{nameFile}</p>
          )}
        </div>
      </div>

      {loader !== false && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            marginTop: '1rem',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
    </>
  )
}

export default TableBirthdays
