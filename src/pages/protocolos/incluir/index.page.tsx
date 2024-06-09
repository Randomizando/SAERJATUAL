/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/Button'
import { SelectOptions } from '@/components/SelectOptions'
import { SwitchInput } from '@/components/SwitchInput'
import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import {
  ContainerInputFile,
  ContentInputFile,
} from '@/pages/associados/atualizar/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CaretRight } from 'phosphor-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { BackPage } from '../../../components/BackPage'
import { useArrayDate } from '../../../utils/useArrayDate'
import { Box, Container, FormError, Text } from './styled'
import { format, formatISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';

const schemaProtocoloForm = z.object({
  num_protocolo: z
    .string({ required_error: 'Campo Obrigatório' })
    .min(1, 'Campo Obrigatório'),
  assunto_protocolo: z
    .string({ required_error: 'Campo Obrigatório' })
    .min(1, 'Campo Obrigatório'),
  tipo_protocolo: z
    .string({ required_error: 'Campo Obrigatório' })
    .min(1, 'Campo Obrigatório'),
  data_recebimento_dia: z.coerce.string(),
  data_recebimento_mes: z.coerce.string(),
  data_recebimento_ano: z.coerce.string(),
  data_envio_dia: z.coerce.string(),
  data_envio_mes: z.coerce.string(),
  data_envio_ano: z.coerce.string(),
  meio_recebimento: z.string(),
  meio_envio: z.string(),
  entregue_em_maos: z.boolean(),
  obrigatoria_resp_receb: z.boolean(),
  anexos: z.any(), // ALTERAR PARA ANEXO DE ARQUIVO
  anexos2: z.any(), // ALTERAR PARA ANEXO DE ARQUIVO
  data_encerramento_protocolo_dia: z.coerce.string(),
  data_encerramento_protocolo_mes: z.coerce.string(),
  data_encerramento_protocolo_ano: z.coerce.string(),
  usuario_encerramento: z
    .string({ required_error: 'Campo Obrigatório' })
    .min(1, 'Campo Obrigatório'), // ALTERAR PARA USUÁRIO
})

type SchemaProtocoloForm = z.infer<typeof schemaProtocoloForm>

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - TIPO PROTOCOLO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Tipo_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const tipoProtocoloOptions = []
      for(let i = 1; i <= finalResponse.length; i++){
        tipoProtocoloOptions.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const tipoProtocoloOptionsData = [
  { id: 1, label: 'Entrada' },
  { id: 2, label: 'Saída' },
]

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - MEIO PROTOCOLO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Meio_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const meioProtocoloOptions = []
      for(let i = 1; i <= finalResponse.length; i++){
        meioProtocoloOptions.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const meioProtocoloOptionsData = [
  { id: 1, label: 'Corrêio' },
  { id: 2, label: 'Email' },
  { id: 3, label: 'Whatsapp' },
  { id: 4, label: 'Web Site' },
]

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - ASSUNTO PROTOCOLO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Assunto_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const assuntoProtocoloOptions = []
      for(let i = 1; i <= finalResponse.length; i++){
        assuntoProtocoloOptions.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const assuntoProtocoloOptionsData = [
  { id: 1, label: 'Protocolo de Entrada' },
  { id: 2, label: 'Protocolo de Saída' },
  { id: 3, label: 'Confidencial' },
]

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - QUEM REDIGIU O DOCUMENTO A SER ENVIADO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Quem_Redigiu_Documento_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const quemRedigiuDocumentoOptionsData = []
      for(let i = 1; i <= finalResponse.length; i++){
        quemRedigiuDocumentoOptionsData.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const quemRedigiuDocumentoOptionsData = [{ id: 1, label: '' }]

interface schemaTabelas {
  id: number
  label: string
}

interface schemaProtocolos {
  dataCategory: schemaTabelas
  dataMeioProtocol: schemaTabelas
  ignoreErrors: boolean
}

// PUXAR DE TABELAS, QUANDO NECESSÁRIO!
const usuarioEncerramento = [
  {
    id: 1,
    label: 'ALM - Andrea Laino Marinho',
  },
  {
    id: 2,
    label: 'MAA - Marcelo Artur Almeida Santos',
  },
  {
    id: 2,
    label: 'TSA - Tania Santos de Andrade Barbosa',
  },
]

export default function Protocolos({
  dataCategory,
  dataMeioProtocol,
  ignoreErrors,
}: schemaProtocolos) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedFiles2, setSelectedFiles2] = useState<File[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const filesArray = Array.from(fileList)
      setSelectedFiles(filesArray)
    }
  }
  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const filesArray = Array.from(fileList)
      setSelectedFiles2(filesArray)
    }
  }

  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SchemaProtocoloForm>({
    resolver: zodResolver(schemaProtocoloForm),
    mode: 'onBlur',
  })

  const dataDays = useArrayDate.Dia()
  const dataMonths = useArrayDate.Mes()
  const dataYears = useArrayDate.AnoAtualMenor()

  async function handleOnSubmit(data: SchemaProtocoloForm) {
    const datasRecebimento = verificaData(data, 'recebimento')
    const datasEncerramento = verificaData(data, 'encerramento')

    let dataEnvio
    let dataRecebimento: any
    let dataEncerramento

    if (data.data_envio_dia && data.data_envio_mes && data.data_envio_ano) {
      dataEnvio = useArrayDate.MontarDate(
        data.data_envio_ano,
        data.data_envio_mes,
        data.data_envio_dia,
      )
    }

    if (
      data.data_recebimento_dia &&
      data.data_recebimento_mes &&
      data.data_recebimento_ano
    ) {
      dataRecebimento = useArrayDate.MontarDate(
        data.data_recebimento_ano,
        data.data_recebimento_mes,
        data.data_recebimento_dia,
      )

      const isoDateRegex =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/
      // Verifica se a data está no formato ISO 8601
      if (dataRecebimento && !isoDateRegex.test(dataRecebimento)) {
        // A data não está no formato ISO 8601, então paramos o código
        return
      }
      if (dataRecebimento && isValid(new Date(dataRecebimento)) === false) {
        return
      }
    }

    if (
      data.data_encerramento_protocolo_dia &&
      data.data_encerramento_protocolo_mes &&
      data.data_encerramento_protocolo_ano
    ) {
      dataEncerramento = useArrayDate.MontarDate(
        data.data_encerramento_protocolo_ano,
        data.data_encerramento_protocolo_mes,
        data.data_encerramento_protocolo_dia,
      )
    }

    if (String(data.tipo_protocolo.toLowerCase()) === String('saída')) {
      if (
        dataEnvio != null &&
        dataRecebimento != null &&
        new Date(dataEnvio) < new Date(dataRecebimento)
      ) {
        return toast.warn(
          'A data de envio deve ser maior que a data de recebimento.',
        )
      }
      if (data.meio_envio === '') {
        return toast.warn('Meio Envio Obrigatório')
      } else if (dataEnvio === undefined) {
        return toast.warn('Data Envio Incompleta')
      }
    }

    if (
      dataEncerramento &&
      dataEnvio &&
      new Date(dataEncerramento) < new Date(dataEnvio)
    ) {
      return toast.warn(
        'A data de encerramento deve ser maior que as demais datas',
      )
    }
    if (
      dataEncerramento &&
      dataRecebimento &&
      new Date(dataEncerramento) < new Date(dataRecebimento)
    ) {
      return toast.warn(
        'A data de encerramento deve ser maior que as demais datas',
      )
    }

    if (
      dataEnvio != null &&
      dataRecebimento != null &&
      dataEncerramento != null &&
      new Date(dataEncerramento) < new Date(dataEnvio) &&
      new Date(dataEncerramento) < new Date(dataRecebimento)
    ) {
    return toast.warn(
        'A data de encerramento deve ser maior que as demais datas',
      )
    }

    if (String(data.tipo_protocolo.toLowerCase()) === String('entrada')) {
      if (
        dataEnvio != null &&
        dataRecebimento != null &&
        new Date(dataRecebimento) < new Date(dataEnvio)
      ) {
        return toast.warn(
          'A data de recebimento deve ser maior ou igual a data de envio.',
        )
      }
      if (data.meio_recebimento === '') {
        return toast.warn('Meio Recebimento Obrigatório')
      } else if (dataRecebimento === undefined) {
        return toast.warn('Data Recebimento Incompleta')
      }
    }

    if (
      data.num_protocolo == '' ||
      data.tipo_protocolo == '' ||
      data.assunto_protocolo == ''
    ) {
      return toast.error('Preencha os campos obrigatórios (*).')
    } else if (datasRecebimento == false) {
      return toast.warn('Data de Recebimento Incompleta')
    } else if (datasEncerramento == false) {
      return toast.warn('Data encerramento Incompleta')
    }
    const {
      data_envio_dia,
      data_envio_mes,
      data_envio_ano,
      data_recebimento_dia,
      data_recebimento_mes,
      data_recebimento_ano,
      data_encerramento_protocolo_dia,
      data_encerramento_protocolo_mes,
      data_encerramento_protocolo_ano,
      anexos,
      anexos2,
      ...newData
    } = data

    try {
      const formData = new FormData()
      formData.append('entrada_0', data.anexos[0])
      formData.append('saida_1', data.anexos2[0])

      const response = await api.post('/upload/protocolos', formData)
      // console.log(response)
      let anexos = ''
      let anexos2 = ''

      response.data.files.forEach((fileName: string) => {
        if (fileName.includes('ENTRADA_0')) {
          anexos += fileName + ','
        } else if (fileName.includes('SAIDA_1')) {
          anexos2 += fileName + ','

          //   formData.append('anexos', data.anexos[0]);
          //     formData.append('anexos2', data.anexos2[0]);

          //   const handlePostUpload = async () => {
          //     try {
          //          const response = await axios.post('/api/upload', formData, {
          //         headers: {
          //         'Content-Type': 'multipart/form-data',
          //     },
          //       });
          //     const nameFile = response.data.names_arquivos?.map((item: any) => {
          //     return {
          //     anexo: item.anexoProtocolo,
          //   anexo2: item.anexoProtocolo2,
          //         };
          //     });
          //   return nameFile;
          //      } catch (error: any) {
          //      toast.error(error?.response?.data.error);
          //    console.log(error?.response?.data.error);
          //     }
          //     };

          //   const NameUpload: any[] = await handlePostUpload();
          //  let filesNames = {
          //    anexo: '',
          //    anexo2: '',
          //  };
          //     NameUpload.forEach(item => {
          //     if (item.anexo) {
          //     filesNames.anexo = item.anexo;
          // }

          //      if (item.anexo2) {
          //        filesNames.anexo2 = item.anexo2;
        }
      })
      // console.log(anexos)
      // Remova a última vírgula das strings, se houver
      anexos = anexos.replace(/,$/, '')
      anexos2 = anexos2.replace(/,$/, '')

      await api.post('/protocolos/incluir', {
        ...newData,
        data_envio: dataEnvio,
        data_recebimento: dataRecebimento,
        data_encerramento: dataEncerramento,
        anexos,
        anexos2,
      })

      router.push('/protocolos')
      return toast.success('Operação concluída com sucesso')
    } catch (error) {
      console.log(error)
      return toast.error('Erro ao cadastrar o protocolo...')
    }
  }

  const verificaData = (data: SchemaProtocoloForm, tipoData: string) => {
    if (tipoData == 'encerramento') {
      if (
        !Number.isNaN(data.data_encerramento_protocolo_dia) ||
        !Number.isNaN(data.data_encerramento_protocolo_mes) ||
        !Number.isNaN(data.data_encerramento_protocolo_ano)
      ) {
        if (
          Number.isNaN(data.data_encerramento_protocolo_dia) ||
          Number.isNaN(data.data_encerramento_protocolo_mes) ||
          Number.isNaN(data.data_encerramento_protocolo_ano)
        ) {
          return false
        } else {
          return true
        }
      }
    }

    if (tipoData == 'recebimento') {
      if (
        !Number.isNaN(data.data_recebimento_dia) ||
        !Number.isNaN(data.data_recebimento_mes) ||
        !Number.isNaN(data.data_recebimento_ano)
      ) {
        if (
          Number.isNaN(data.data_recebimento_dia) ||
          Number.isNaN(data.data_recebimento_mes) ||
          Number.isNaN(data.data_recebimento_ano)
        ) {
          return false
        } else {
          return true
        }
      }
    }
  }

  function handleGetDayNow(type: string) {
    const dateNow: Date = new Date()

    const formatDate = format(dateNow, 'yyyy-MM-dd', {
      locale: ptBR,
    })

    const date = useArrayDate.DesestruturarDate(formatDate.toString())

    if (type === 'recebimento') {
      setValue('data_recebimento_dia', date.dia)
      setValue('data_recebimento_mes', date.mes)
      setValue('data_recebimento_ano', date.ano)
    } else if (type === 'envio') {
      setValue('data_envio_dia', date.dia)
      setValue('data_envio_mes', date.mes)
      setValue('data_envio_ano', date.ano)
    }
  }
  //   const x = watch('data_envio_dia')
  //   const y = watch('data_recebimento_dia')
  // console.log(x, y)
  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <fieldset>
          <legend
            style={{
              width: '100%',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>
                <Link href={'/protocolos'}>Protocolos</Link>
              </span>
              <CaretRight size={14} />
              <span>Incluir</span>
            </div>
            <div>
              {/* <Box style={{ alignItems: "center", display: 'flex' }}> */}
              <BackPage backRoute="/protocolos" />
              {/* </Box> */}
            </div>
          </legend>
          <Box>
            <div style={{ width: '15%' }}>
              <TextInput
                title="Número do Protocolo *"
                {...register('num_protocolo')}
                helperText={errors.num_protocolo?.message}
                error={!!errors.num_protocolo?.message}
                // helperText={errors.num_protocolo?.message}
              />
            </div>

            <div>
              <SelectOptions
                data={dataCategory}
                description="Tipo Protocolo *"
                w={200}
                {...register('tipo_protocolo')}
                helperText={errors.tipo_protocolo?.message}
                error={!!errors.tipo_protocolo?.message}
              />
            </div>

            <div>
              <SwitchInput
                title="Documento de entrada requer resposta?"
                {...register('obrigatoria_resp_receb')}
              />
            </div>

            <div>
              <SwitchInput
                title="Entregue em mãos?"
                {...register('entregue_em_maos')}
              />
            </div>
          </Box>

          <Box>
            <div>
              <TextInput
                title="Assunto Protocolo *"
                w={1040}
                {...register('assunto_protocolo')}
                helperText={errors.assunto_protocolo?.message}
                error={!!errors.assunto_protocolo?.message}
              />
            </div>
          </Box>

          <Box>
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '27rem',
                }}
              >
                <Text>Data de Recebimento:</Text>
                <SelectOptions
                  description="Dia"
                  data={dataDays}
                  w={90}
                  {...register('data_recebimento_dia')}
                />
                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={90}
                  {...register('data_recebimento_mes')}
                />
                <SelectOptions
                  w={120}
                  label="Ano"
                  data={dataYears}
                  {...register('data_recebimento_ano')}
                />
              </div>
            </div>

            <Button
              type="button"
              style={{ flex: 1 }}
              title="Hoje"
              onClick={() => {
                handleGetDayNow('recebimento')
              }}
            />
            <div>
              <SelectOptions
                data={dataMeioProtocol}
                description="Meio de Recebimento"
                w={225}
                {...register('meio_recebimento')}
              />
            </div>

            <div style={{ width: '36rem' }}>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    {...register('anexos')}
                    onChange={(e: any) => {
                      register('anexos').onChange(e)
                      handleFileChange(e)
                    }}
                  />
                  <p>
                    {selectedFiles &&
                    selectedFiles[0] &&
                    selectedFiles[0].name !== undefined
                      ? `Arquivo Selecionado: ${selectedFiles[0].name}`
                      : 'Selecione o Arquivo:'}
                  </p>
                </ContentInputFile>
                <p style={{ fontSize: '0.9rem' }}>Anexos:</p>
              </ContainerInputFile>
            </div>
          </Box>

          <Box>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '27rem',
                }}
              >
                <Text> Data de Envio:</Text>
                <SelectOptions
                  description="Dia"
                  data={dataDays}
                  w={90}
                  {...register('data_envio_dia')}
                  // defaultValue={{ label: newDateAnuidade.dia }}
                />
                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={93}
                  {...register('data_envio_mes')}
                  // defaultValue={{ label: newDateAnuidade.mes }}
                />
                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('data_envio_ano')}
                  // defaultValue={{ label: newDateAnuidade.ano }}
                />
              </div>
            </div>
            <Button
              type="button"
              style={{ flex: 1 }}
              title="Hoje"
              onClick={() => {
                handleGetDayNow('envio')
              }}
            />
            <div>
              <SelectOptions
                data={dataMeioProtocol}
                description="Meio de Envio"
                w={225}
                {...register('meio_envio')}
              />
            </div>
            <div style={{ width: '36rem' }}>
              <ContainerInputFile>
                <Button id="buttonSelect" title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    {...register('anexos2')}
                    onChange={(e: any) => {
                      register('anexos2').onChange(e)
                      handleFileChange2(e)
                    }}
                  />
                  <p>
                    {selectedFiles2 &&
                    selectedFiles2[0] &&
                    selectedFiles2[0].name !== undefined
                      ? `Arquivo Selecionado: ${selectedFiles2[0].name}`
                      : 'Selecione o Arquivo:'}
                  </p>
                </ContentInputFile>
                <p style={{ fontSize: '0.9rem' }}>Anexos:</p>
              </ContainerInputFile>
            </div>
          </Box>

          <Box>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '27rem',
                }}
              >
                <Text> Data de Encerramento do Protocolo:</Text>
                <SelectOptions
                  description="Dia"
                  data={dataDays}
                  w={90}
                  {...register('data_encerramento_protocolo_dia')}
                  // defaultValue={{ label: newDateAnuidade.dia }}
                />
                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={90}
                  {...register('data_encerramento_protocolo_mes')}
                  // defaultValue={{ label: newDateAnuidade.mes }}
                />
                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('data_encerramento_protocolo_ano')}
                  // defaultValue={{ label: newDateAnuidade.ano }}
                />
              </div>
            </div>

            <div>
              <SelectOptions
                w={300}
                description="Usuário Protocolo *"
                data={usuarioEncerramento}
                {...register('usuario_encerramento')}
                // defaultValue={{ label: newDateAnuidade.ano }}
              />
              <FormError>{errors.usuario_encerramento?.message}</FormError>
            </div>
          </Box>

          <Button
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const ignoreErrors = await prisma.parametros
      .findFirst({
        select: {
          permitir_dado_invalido: true,
        },
      })
      .then((res) => {
        return !!res?.permitir_dado_invalido
      })

    const category = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tipo_Protocol',
        ocorrencia_ativa: true,
      },
    })

    const dataCategory = category?.map((item) => {
      return {
        id: item.id,
        label: item.ocorrencia_tabela,
      }
    })
    const meioProtocol = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Meio_Protocol',
        ocorrencia_ativa: true,
      },
    })

    const dataMeioProtocol = meioProtocol?.map((item) => {
      return {
        id: item.id,
        label: item.ocorrencia_tabela,
      }
    })

    return {
      props: {
        dataCategory,
        dataMeioProtocol,
        ignoreErrors,
      },
    }
  } catch (error) {
    return {
      props: {
        dataCategory: [],
        dataMeioProtocol: [],
        ignoreErrors: false,
      },
    }
  }
}
