/* eslint-disable @typescript-eslint/no-unused-vars */
import { BackPage } from '@/components/BackPage'
import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import SelectStandard from '@/components/SelectStandard'
import { SwitchInput } from '@/components/SwitchInput'
import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { useArrayDate } from '@/utils/useArrayDate'
import { Checkbox } from '@mui/material'
import axios from 'axios'
import { format } from 'date-fns'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CaretRight } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { schemaUpdate } from './schemaUpdate'
import {
  Box,
  Container,
  ContainerDividedEqually,
  ContainerInputFile,
  ContentFileToEditOrDelete,
  ContentInputFile,
  EmptyContainer,
  Fieldset,
  FormError,
  Text,
} from './styled'
import { Tabelas } from '@prisma/client'
import { SelectOptions } from '@/components/SelectOptions'
import SelectNoComplete from '@/components/SelectNoComplete'

type SchemaUpdateAssociado = z.infer<typeof schemaUpdate>
type ZodError = z.ZodError

interface schemaAssociados {
  data: {
    id: number
    data_nascimento: string
    data_inicio_especializacao: string
    data_previsao_conclusao: string
    comprovante_cpf: any
    numero_proposta_SBA: any
    matricula_SAERJ: number
    matricula_SBA: number
    situacao: string
    uf_crm: string
    crm: string
    nome_completo: string
    cpf: string
    sexo: string
    nome_profissional: string
    categoria: string
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    pais: string
    telefone_celular: string
    telefone_residencial: string
    email: string
    nome_instituicao_ensino_graduacao: string
    ano_conclusao_graduacao: string
    residencia_mec_cnrm: string
    nivel_residencia: string
    nome_hospital_mec: string
    uf_prm: string
    comprovante_endereco: any
    carta_indicacao_2_membros: any
    declaracao_hospital: any
    diploma_medicina: any
    certidao_quitacao_crm: any
    certificado_conclusao_especializacao: any
    declaro_verdadeiras: any
    declaro_quite_SAERJ: any
    pendencias_SAERJ: string
    nome_presidente_regional: string
    sigla_regional: string
  }
  dataCategoria: any
  dataSituacao: any
  dataPais: any
  dataNivelResidencia: any
  dataUfs: any
  dataSiglasRegionais: any
  dataHospitaisFiltrados: any
}

export default function AssociadosCadastro({
  data,
  dataCategoria,
  dataSituacao,
  dataPais,
  dataNivelResidencia,
  dataUfs,
  dataSiglasRegionais,
  dataHospitaisFiltrados,
}: schemaAssociados) {
  const [cepInvalido, setCepInvalido] = useState()
  const [disableCamposEndereco, setDisableCamposEndereco] = useState(true)
  const [disableCep, setDisableCep] = useState(false)
  const [modifiedFields, setModifiedFields] = useState<string[]>([])

  function handleFieldChange(fieldName: string) {
    if (!modifiedFields.includes(fieldName)) {
      setModifiedFields([...modifiedFields, fieldName])
    }
  }

  const router = useRouter()

  const dataDays = useArrayDate.Dia()
  const dataMonths = useArrayDate.Mes()
  const dataYears = useArrayDate.AnoAtualMenor()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<SchemaUpdateAssociado>()
  const cepValue = watch('cep')

  const nomeArquivoComprovanteCpf = watch('comprovante_cpf')
  const nomeArquivoComprovanteEndereco = watch('comprovante_endereco')
  const nomeArquivoCartaIndicacao2Membros = watch('carta_indicacao_2_membros')
  const nomeArquivoCertidaoQuitacaoCrm = watch('certidao_quitacao_crm')
  const nomeArquivoCertificadoConclusaoEspecializacao = watch(
    'certificado_conclusao_especializacao',
  )
  const nomeArquivoDeclaracaoHospital = watch('declaracao_hospital')
  const nomeArquivoDiplomaMedicina = watch('diploma_medicina')
  const dataNascimento = useArrayDate.DesestruturarDate(data?.data_nascimento)

  const dataInicio = useArrayDate.DesestruturarDate(
    data?.data_inicio_especializacao,
  )
  const dataPrevisao = useArrayDate.DesestruturarDate(
    data?.data_previsao_conclusao,
  )

  const ufBrasilList = dataUfs?.map(
    (uf: any) => uf.complemento_ocorrencia_selecao,
  )
  const siglasRegionaisList = dataSiglasRegionais?.map(
    (item: any) => item.nome_fantasia,
  )
  const hospitalsToList = dataHospitaisFiltrados?.map(
    (hospital: any) => hospital.razao_social,
  )

  const categoriasToList = dataCategoria?.map(
    (categoria: Tabelas) => categoria.ocorrencia_tabela,
  )

  async function handleCheckCep(cep: string) {
    try {
      const currentCep = watch('cep')

      const response = await axios.get(
        `https://viacep.com.br/ws/${currentCep}/json/`,
      )
      checkedViaCep(response.data)
    } catch (error) {
      toast.warn('Cep inválido')
      setDisableCamposEndereco(true)
      console.log(error)
    }
  }

  async function handleGetAllParams(): Promise<void> {
    try {
      const response = await api.get('/parametros')
      setCepInvalido(response.data[0].cep_invalido)
    } catch (error) {
      console.log(error)
    }
  }

  function checkedViaCep(dataViaCep: any) {
    if (dataViaCep.erro === true) {
      if (cepInvalido === true) {
        toast.warn('Cep inválido')
      } else {
        setDisableCamposEndereco(true)
        toast.warn('Cep inválido')
      }
    }

    if (!dataViaCep.erro) {
      if (!areAllAddressFieldsValid(dataViaCep)) {
        toast.warn(
          'Informações retornadas da API dos Correios incompletas, favor informar campos em branco',
        )

        setDisableCamposEndereco(false)
      } else {
        setDisableCamposEndereco(true)
      }
      clearErrors('cep')
      setValue('bairro', dataViaCep.bairro)
      setValue('cidade', dataViaCep.localidade)
      setValue('uf', dataViaCep.uf)
      setValue('logradouro', dataViaCep.logradouro)
    }
  }
  const arraySexo = [
    {
      label: 'Masculino',
    },
    {
      label: 'Feminino',
    },
  ]
  // async function handleOnSubmit(data: SchemaAssociados) {
  //   try {
  //     console.log(data)
  //     const dataNascimento = useArrayDate.MontarDate(
  //       data.yearNasc,
  //       data.monthNasc,
  //       data.dayNasc,
  //     )
  //     const dataInicioEspecializacao = useArrayDate.MontarDate(
  //       data.yearInicioEspec,
  //       data.monthInicioEspec,
  //       data.dayInicioEspec,
  //     )
  //     const dataPrevisaoConclusao = useArrayDate.MontarDate(
  //       data.yearPrevConcl,
  //       data.monthPrevConcl,
  //       data.dayPrevConcl,
  //     )

  //     data.cpf = data.cpf.replace(/[^\d]/g, '')
  //     data.cep = data.cep.replace(/[^\d]/g, '')

  //     data.telefone_residencial = data.telefone_residencial.replace(
  //       /[^\d]/g,
  //       '',
  //     )
  //     data.telefone_celular = data.telefone_celular.replace(/[^\d]/g, '')

  //     const {
  //       dayNasc,
  //       monthNasc,
  //       yearNasc,
  //       dayInicioEspec,
  //       monthInicioEspec,
  //       yearInicioEspec,
  //       dayPrevConcl,
  //       monthPrevConcl,
  //       yearPrevConcl,
  //       ...newData
  //     } = data

  //     await api.put('/associados/update', {
  //       ...newData,
  //       id: data.id,
  //       data_nascimento: dataNascimento,
  //       data_inicio_especializacao: dataInicioEspecializacao,
  //       data_previsao_conclusao: dataPrevisaoConclusao,
  //     })
  //     toast.success('Associado cadastrado')
  //     router.push('/associados')
  //   } catch (error) {
  //     console.log(error)
  //     toast.error('Oops algo deu errado...')
  //   }
  // }
  function ButtonThreeYear() {
    const day = watch('dayInicioEspec')
    const month = watch('monthInicioEspec')
    const year = watch('yearInicioEspec')

    if (!day || !month || !year) {
      return toast('Data início especialização não informada')
    }

    const dateInicioEspec = useArrayDate.MontarDate(year, month, day)
    const date = new Date(dateInicioEspec)
    const newYear = date.getFullYear() + 3

    // Verifica se a data original é 29 de fevereiro e se o ano resultante é bissexto
    if (
      date.getDate() === 29 &&
      date.getMonth() === 1 &&
      !isLeapYear(newYear)
    ) {
      date.setFullYear(newYear)
      date.setMonth(1) // Mês de fevereiro
      date.setDate(28) // Se não for bissexto, ajusta para 28 de fevereiro
    } else {
      date.setFullYear(newYear)
    }

    const valuesDatePrevisaoConclusao = () => {
      const dayPrevConcl = String(date.getDate()).padStart(2, '0')
      const monthPrevConcl = String(date.getMonth() + 1).padStart(2, '0')
      const yearPrevConcl = String(date.getFullYear())

      setValue('dayPrevConcl', dayPrevConcl)
      setValue('monthPrevConcl', monthPrevConcl)
      setValue('yearPrevConcl', yearPrevConcl)
    }

    valuesDatePrevisaoConclusao()

    // Função para verificar se um ano é bissexto
    function isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    }
  }
  function mapZodErrors(zodErrors: ZodError) {
    zodErrors.errors.forEach((validationError) => {
      const fieldName = validationError.path[0]
      const errorMessage = validationError.message

      setError(fieldName as keyof FieldValues, {
        type: 'zod',
        message: errorMessage,
      })
    })
  }

  async function OnSubmit(data: SchemaUpdateAssociado) {
    try {
      const modifiedSchema = z.object(
        Object.fromEntries(
          modifiedFields.map((field) => [field, schemaUpdate.shape[field]]),
        ),
      )

      const validatedData = modifiedSchema.parse(data)

      let dataNascimento
      let dataInicioEspecializacao
      let dataPrevisaoConclusao
      const FormatDates = (data: SchemaUpdateAssociado) => {
        if (data.yearNasc && data.monthNasc && data.dayNasc) {
          dataNascimento = useArrayDate.MontarDate(
            data.yearNasc,
            data.monthNasc,
            data.dayNasc,
          )
        }

        if (
          data.yearInicioEspec &&
          data.monthInicioEspec &&
          data.dayInicioEspec
        ) {
          dataInicioEspecializacao = useArrayDate.MontarDate(
            data.yearInicioEspec,
            data.monthInicioEspec,
            data.dayInicioEspec,
          )
        }

        if (data.yearPrevConcl && data.monthPrevConcl && data.dayPrevConcl) {
          dataPrevisaoConclusao = useArrayDate.MontarDate(
            data.yearPrevConcl,
            data.monthPrevConcl,
            data.dayPrevConcl,
          )
        }
      }
      const removeCaracteres = (data: SchemaAssociados) => {
        data.cpf = data.cpf.replace(/[^\d]/g, '')
        data.cep = data.cep.replace(/[^\d]/g, '')

        data.telefone_residencial = data.telefone_residencial.replace(
          /[^\d]/g,
          '',
        )
        data.telefone_celular = data.telefone_celular.replace(/[^\d]/g, '')
      }

      const formData = new FormData()
      const FormDataArquivosUpload = async (formData: any) => {
        formData.append('comprovante_cpf', data.comprovante_cpf[0])
        formData.append('comprovante_endereco', data.comprovante_endereco[0])
        formData.append(
          'carta_indicacao_2_membros',
          data.carta_indicacao_2_membros[0],
        )
        formData.append('certidao_quitacao_crm', data.certidao_quitacao_crm[0])
        formData.append(
          'certificado_conclusao_especializacao',
          data.certificado_conclusao_especializacao[0],
        )

        formData.append('declaracao_hospital', data.declaracao_hospital[0])
        formData.append('diploma_medicina', data.diploma_medicina[0])

        const response = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return response.data.names_arquivos
      }

      FormatDates(data)
      removeCaracteres(data)
      const namesArquivos = await FormDataArquivosUpload(formData)
      // console.log(namesArquivos)
      const responseUploadFormatted = (files: string[]) => {
        interface Arquivos {
          [key: string]: string
        }
        const result: Arquivos = {}
        // Iterar sobre o array original
        files.forEach((item: string) => {
          // Dividir a string pelo delimitador "_id-" para obter o prefixo
          const parts = item.split('_id-')
          // O prefixo será a chave e o item será o valor no objeto resultante
          result[parts[0]] = item
        })
        return result
      }

      const resultFiles = responseUploadFormatted(namesArquivos)
      // console.log(resultFiles)

      const {
        dayNasc,
        monthNasc,
        yearNasc,
        dayInicioEspec,
        monthInicioEspec,
        yearInicioEspec,
        dayPrevConcl,
        monthPrevConcl,
        yearPrevConcl,
        confirmarEmail,
        ...newData
      } = data

      await api.put('/associados/update', {
        ...newData,
        declaro_quite_SAERJ: String(data.declaro_quite_SAERJ),
        declaro_verdadeiras: String(data.declaro_verdadeiras),
        data_nascimento: dataNascimento,
        data_inicio_especializacao: dataInicioEspecializacao,
        data_previsao_conclusao: dataPrevisaoConclusao,
        residencia_mec_cnrm: String(data.residencia_mec_cnrm),
        // CODIGO A BAIXO REFERE-SE AO SALVAMENTO DOS NOMES DOS ARQUIVOS => PRECISA AJUSTAR A LOGICA
        comprovante_cpf: resultFiles.COMPROVANTE_CPF || data.comprovante_cpf,
        comprovante_endereco:
          resultFiles.COMPROVANTE_ENDERECO || data.comprovante_endereco,
        carta_indicacao_2_membros:
          resultFiles.CARTA_INDICACAO_MEMBROS || data.carta_indicacao_2_membros,
        certidao_quitacao_crm:
          resultFiles.CERTIDAO_QUITACAO_CRM || data.certidao_quitacao_crm,
        certificado_conclusao_especializacao:
          resultFiles.CERTIFICADO_CONCLUSAO_ESPECIALIZACAO ||
          data.certificado_conclusao_especializacao,
        declaracao_hospital:
          resultFiles.DECLARACAO_HOSPITAL || data.declaracao_hospital,
        diploma_medicina: resultFiles.DIPLOMA_MEDICINA || data.diploma_medicina,
      })
      toast.success('Operação concluída com sucesso')
      router.push('/associados')
    } catch (error) {
      if (error instanceof z.ZodError) {
        mapZodErrors(error)
        toast.warn('Campos inválidos')
      } else {
        console.log(error)
        toast.error('Oops algo deu errado...')
      }
    }
  }

  function valuesInitial() {
    setValue('id', data.id)
    setValue('cep', data.cep ? data.cep : '')
    setValue('cpf', data.cpf ? data.cpf : '')
    setValue(
      'telefone_celular',
      data.telefone_celular ? data.telefone_celular : '',
    )
    setValue(
      'telefone_residencial',
      data.telefone_residencial ? data.telefone_residencial : '',
    )
    setValue('categoria', data.categoria)
    setValue('situacao', data.situacao)
    setValue('pais', data.pais)

    setValue('dayNasc', dataNascimento.dia)
    setValue('monthNasc', dataNascimento.mes)
    setValue('yearNasc', dataNascimento.ano)

    setValue('dayInicioEspec', dataInicio.dia)
    setValue('monthInicioEspec', dataInicio.mes)
    setValue('yearInicioEspec', dataInicio.ano)

    setValue('dayPrevConcl', dataPrevisao.dia)
    setValue('monthPrevConcl', dataPrevisao.mes)
    setValue('yearPrevConcl', dataPrevisao.ano)

    setValue('uf_crm', data.uf_crm)
    setValue('crm', data.crm)
    setValue('nome_completo', data.nome_completo)

    setValue('sexo', data.sexo)
    setValue('nome_profissional', data.nome_profissional)
    setValue('pais', data.pais)

    setValue('logradouro', data.logradouro)
    setValue('numero', data.numero)
    setValue('complemento', data.complemento)
    setValue('bairro', data.bairro)
    setValue('cidade', data.cidade)
    setValue('uf', data.uf)
    setValue('email', data.email)
    setValue(
      'nome_instituicao_ensino_graduacao',
      data.nome_instituicao_ensino_graduacao,
    )
    setValue('ano_conclusao_graduacao', data.ano_conclusao_graduacao)
    setValue('residencia_mec_cnrm', data.residencia_mec_cnrm)
    setValue('nivel_residencia', data.nivel_residencia)
    setValue('uf_prm', data.uf_prm)
    setValue('nome_hospital_mec', data.nome_hospital_mec)

    setValue('comprovante_cpf', data.comprovante_cpf || '')
    setValue('carta_indicacao_2_membros', data.carta_indicacao_2_membros || '')
    setValue('certidao_quitacao_crm', data.certidao_quitacao_crm || '')
    setValue(
      'certificado_conclusao_especializacao',
      data.certificado_conclusao_especializacao || '',
    )
    setValue('declaracao_hospital', data.declaracao_hospital || '')
    setValue('diploma_medicina', data.diploma_medicina || '')
    setValue('comprovante_endereco', data.comprovante_endereco || '')

    setValue('numero_proposta_SBA', data.numero_proposta_SBA)
    setValue('matricula_SAERJ', data.matricula_SAERJ)
    setValue('matricula_SBA', data.matricula_SBA)
    setValue('pendencias_SAERJ', data.pendencias_SAERJ)
    setValue('nome_presidente_regional', data.nome_presidente_regional)
    setValue('sigla_regional', data.sigla_regional)
  }

  useEffect(() => {
    if (!!data?.pais && data?.pais !== 'Brasil') setDisableCep(true)
    handleGetAllParams()
    valuesInitial()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChangePais({ target }) {
    const paisValue = target?.value
    if (paisValue) {
      const shouldDisableCep = !!paisValue && paisValue !== 'Brasil'

      if (shouldDisableCep) {
        setDisableCep(true)
        setDisableCamposEndereco(false)
        setValue('cep', '')
        setValue('cidade', '')
        setValue('bairro', '')
        setValue('logradouro', '')
        setValue('numero', '')
        setValue('uf', '')
        setValue('complemento', '')
      } else {
        setDisableCep(false)
        setDisableCamposEndereco(true)
      }
    }

    handleFieldChange('pais')
  }

  function formatFileName(fileName: string) {
    const fileNameUpperCase = fileName.toUpperCase()
    return fileNameUpperCase.split('_ID')[0]
  }

  async function handleDeleteFile(fileName: string, key: string) {
    try {
      await api.post('/upload/delete/associados', {
        id: data.id,
        fileName,
        fieldName: key,
      })

      toast.info('Arquivo excluído com sucesso!')
      router.replace(router.asPath)
      setValue(key, '')
    } catch (error) {
      console.log(error)
      toast.error('Erro ao excluir o arquivo!')
    }
  }

  function areAllAddressFieldsValid(address: any) {
    if (
      !address.bairro ||
      !address.localidade ||
      !address.uf ||
      !address.logradouro
    )
      return false
    return true
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <BackPage backRoute="/associados" />

        <fieldset>
          <legend>
            <Link href="/associados">Associados</Link>
            <CaretRight size={14} />
            <span>Ver/Atualizar</span>
          </legend>

          <Fieldset>
            <legend>
              <h2>Gerais</h2>
            </legend>
            <Box>
              <div>
                <TextInput
                  w={100}
                  title="Matrícula SAERJ"
                  {...register('matricula_SAERJ', {
                    valueAsNumber: true,
                  })}
                  disabled
                  onChange={() => handleFieldChange('matricula_SAERJ')}
                  error={!!errors?.matricula_SAERJ?.message}
                  helperText={errors?.matricula_SAERJ?.message}
                />
              </div>
              <div>
                <TextInput
                  w={100}
                  title="Matrícula SBA"
                  {...register('matricula_SBA', {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </Box>
            <Box>
              <div style={{ width: '230px' }}>
                <SelectStandard
                  title="UF CRM"
                  defaultValue={data?.uf_crm || ''}
                  data={ufBrasilList}
                  {...register('uf_crm')}
                  onChange={() => handleFieldChange('uf_crm')}
                />
                <FormError>{errors.uf_crm?.message}</FormError>
              </div>
              <div>
                <TextInput
                  w={180}
                  title="CRM"
                  {...register('crm')}
                  onChange={() => handleFieldChange('crm')}
                  error={!!errors?.crm?.message}
                  helperText={errors?.crm?.message}
                />
              </div>

              <TextInput
                title="Nome Completo"
                {...register('nome_completo')}
                onChange={() => handleFieldChange('nome_completo')}
                error={!!errors?.nome_completo?.message}
                helperText={errors?.nome_completo?.message}
              />
              <div>
                <TextInput
                  w={140}
                  title="CPF"
                  mask={'999.999.999-99'}
                  {...register('cpf')}
                  onChange={() => handleFieldChange('cpf')}
                  error={!!errors?.cpf?.message}
                  helperText={errors?.cpf?.message}
                />
              </div>
            </Box>

            <Box>
              <div style={{ width: '230px' }}>
                <SelectStandard
                  data={arraySexo}
                  title="Sexo"
                  defaultValue={data?.sexo}
                  {...register('sexo')}
                  onChange={() => handleFieldChange('sexo')}
                />
                <FormError>{errors.sexo?.message}</FormError>
              </div>
              <div>
                <TextInput
                  w={330}
                  title="Nome Profissional"
                  {...register('nome_profissional')}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '24rem',
                }}
              >
                <Text>Data Nascimento</Text>
                <SelectStandard
                  title="Dia"
                  data={dataDays}
                  w="4rem"
                  defaultValue={dataNascimento?.dia}
                  {...register('dayNasc')}
                  onChange={() => handleFieldChange('dayNasc')}
                />
                <SelectStandard
                  data={dataMonths}
                  defaultValue={dataNascimento?.mes}
                  title="Mês"
                  w="4rem"
                  {...register('monthNasc')}
                  onChange={() => handleFieldChange('monthNasc')}
                />
                <SelectStandard
                  defaultValue={dataNascimento.ano}
                  w="8rem"
                  title="Ano"
                  data={dataYears}
                  {...register('yearNasc')}
                  onChange={() => handleFieldChange('yearNasc')}
                />

                <FormError>{errors.dayNasc?.message}</FormError>
                <FormError>{errors.monthNasc?.message}</FormError>
                <FormError>{errors.yearNasc?.message}</FormError>
              </div>
              <div style={{ width: '20%' }}>
                <div
                  style={{
                    fontSize: '14px',
                    border: 'solid 1px',
                    borderColor:
                      'transparent transparent rgb(169, 169, 178) transparent',
                  }}
                >
                  <SelectStandard
                    data={categoriasToList}
                    title="Categoria"
                    defaultValue={data?.categoria}
                    {...register('categoria')}
                  />
                </div>
                <FormError>
                  {errors?.categoria?.message && 'Campo Obrigatório'}
                </FormError>
              </div>
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Dados de endereço</h2>
            </legend>
            <Box>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <TextInput
                    w={150}
                    title="Cep *"
                    {...register('cep')}
                    helperText={errors.cep?.message}
                    error={!disableCep && !!errors?.cep?.message}
                    mask="99999-999"
                    disabled={disableCep}
                    defaultValue={disableCep ? '' : cepValue}
                    onChange={() => handleFieldChange('cep')}
                  />
                  <Button
                    type="button"
                    disable={disableCep}
                    onClick={() => {
                      handleCheckCep(cepValue)
                    }}
                    title="Buscar"
                    style={{ margin: '0px', width: '100%', fontSize: '12px' }}
                  />
                </div>
              </div>
              <div>
                <SelectStandard
                  data={dataPais}
                  defaultValue={data?.pais}
                  w={'260px'}
                  title="País onde reside *"
                  {...register('pais')}
                  onChange={handleChangePais}
                />
                <FormError>{errors?.pais?.message}</FormError>
              </div>
              {!disableCep && (
                <div>
                  <TextInput
                    disabled={disableCamposEndereco}
                    w={100}
                    title="UF *"
                    {...register('uf')}
                    error={!!errors?.uf?.message}
                    helperText={errors?.uf?.message}
                    onChange={() => handleFieldChange('uf')}
                  />
                </div>
              )}
              <div>
                <TextInput
                  disabled={disableCamposEndereco}
                  w={350}
                  title="Cidade *"
                  {...register('cidade')}
                  onChange={() => handleFieldChange('cidade')}
                  error={!!errors?.cidade?.message}
                  helperText={errors?.cidade?.message}
                />
              </div>
              <Box>
                <div>
                  <TextInput
                    w={275}
                    disabled={disableCamposEndereco}
                    title="Bairro *"
                    {...register('bairro')}
                    onChange={() => handleFieldChange('bairro')}
                    error={!!errors?.bairro?.message}
                    helperText={errors?.bairro?.message}
                  />
                </div>
                <div>
                  <TextInput
                    disabled={disableCamposEndereco}
                    title="Logradouro *"
                    w={400}
                    {...register('logradouro')}
                    onChange={() => handleFieldChange('logradouro')}
                    error={!!errors?.logradouro?.message}
                    helperText={errors?.logradouro?.message}
                  />
                </div>
                <div>
                  <TextInput
                    w={90}
                    title="Número *"
                    {...register('numero')}
                    onChange={() => handleFieldChange('numero')}
                    error={!!errors?.numero?.message}
                    helperText={errors?.numero?.message}
                  />
                </div>
                <div>
                  <TextInput
                    title="Complemento"
                    w={400}
                    {...register('complemento')}
                  />
                </div>
              </Box>
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Dados de contato</h2>
            </legend>

            <Box>
              <div>
                <TextInput
                  w={300}
                  title="Telefone Celular"
                  defaultValue={data?.telefone_celular}
                  mask={'(99) 9.9999-9999'}
                  {...register('telefone_celular')}
                  onChange={() => handleFieldChange('telefone_celular')}
                  error={!!errors?.telefone_celular?.message}
                  helperText={errors?.telefone_celular?.message}
                />
              </div>
              <div>
                <TextInput
                  w={300}
                  title="Telefone Residencial"
                  defaultValue={data?.telefone_residencial}
                  mask={'(99) 9999-9999'}
                  {...register('telefone_residencial')}
                />
              </div>
              <TextInput
                title="Email"
                {...register('email')}
                onChange={() => handleFieldChange('email')}
                error={!!errors?.email?.message}
                helperText={errors?.email?.message}
              />

              <TextInput
                title="Confirmação email"
                {...register('confirmarEmail')}
              />
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Dados referente a formação acadêmica</h2>
            </legend>
            {/* {checkCategoria === 'Adjuntos' ? (
              <Box>
                <TextInput
                  title="Nome Instituição de Ensino Graduação"
                  {...register('nome_instituicao_ensino_graduacao')}
                />
                <div>
                  <TextInput
                    w={180}
                    title="Ano de Conclusão Graduação"
                    {...register('ano_conclusao_graduacao')}
                  />
                </div>
                <div>
                  <SelectOptions
                    w={120}
                    description="UF PRM"
                    data={ufBrasilList}
                    {...register('uf_prm')}
                  />
                </div>
              </Box>
            ) : ( */}
            <>
              <Box>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '3rem',
                  }}
                >
                  <div>
                    <TextInput
                      w={400}
                      title="Nome Instituição de Ensino Graduação"
                      {...register('nome_instituicao_ensino_graduacao')}
                      onChange={() =>
                        handleFieldChange('nome_instituicao_ensino_graduacao')
                      }
                      error={
                        !!errors?.nome_instituicao_ensino_graduacao?.message
                      }
                      helperText={
                        errors?.nome_instituicao_ensino_graduacao?.message
                      }
                    />
                  </div>
                  <div>
                    <SwitchInput
                      title="Residencia MEC-CNRM"
                      defaultChecked={data?.residencia_mec_cnrm}
                      {...register('residencia_mec_cnrm')}
                    />
                  </div>
                </div>

                <div style={{ height: '9rem' }}>
                  <div>
                    <SelectStandard
                      w={'250px'}
                      title="Ano de Conclusão Graduação"
                      data={dataYears}
                      {...register('ano_conclusao_graduacao')}
                      defaultValue={data?.ano_conclusao_graduacao}
                    />
                    <FormError>
                      {errors?.ano_conclusao_graduacao?.message}
                    </FormError>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '3rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'end',
                      width: '30rem',
                    }}
                  >
                    <Text>Data Início Especialização</Text>

                    <SelectStandard
                      title="Dia"
                      data={dataDays}
                      w={'90px'}
                      {...register('dayInicioEspec')}
                      defaultValue={dataInicio?.dia}
                    />

                    <SelectStandard
                      data={dataMonths}
                      title="Mês"
                      w={'90px'}
                      {...register('monthInicioEspec')}
                      defaultValue={dataInicio?.mes}
                    />

                    <SelectStandard
                      w={'120px'}
                      title="Ano"
                      data={dataYears}
                      {...register('yearInicioEspec')}
                      defaultValue={dataInicio?.ano}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'end',
                        width: '30rem',
                      }}
                    >
                      <Text>Data Previsão Conclusão</Text>
                      <SelectOptions
                        description="Dia"
                        data={dataDays}
                        w={90}
                        {...register('dayPrevConcl')}
                        defaultValue={{ label: dataPrevisao?.dia, id: 0 }}
                      />

                      <SelectOptions
                        data={dataMonths}
                        description="Mês"
                        w={90}
                        {...register('monthPrevConcl')}
                        defaultValue={{ label: dataPrevisao?.mes, id: 1 }}
                      />

                      <SelectOptions
                        w={120}
                        description="Ano"
                        data={useArrayDate.AnoAtualMaior()}
                        {...register('yearPrevConcl')}
                        defaultValue={{ label: dataPrevisao?.ano, id: 3 }}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        ButtonThreeYear()
                      }}
                      style={{ width: '7rem', margin: '0px' }}
                      title="Início +3 anos"
                    />
                  </div>
                </div>
              </Box>
            </>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Histórico do Proponente</h2>
            </legend>

            <Box>
              <div>
                <SelectStandard
                  w={'210px'}
                  title="Nível Residencia"
                  data={dataNivelResidencia}
                  defaultValue={data?.nivel_residencia}
                  {...register('nivel_residencia')}
                />
                <FormError>
                  {errors?.nivel_residencia?.message && 'Campo Obrigatório'}
                </FormError>
              </div>
              <div>
                <SelectStandard
                  w={'230px'}
                  title="UF PRM *"
                  defaultValue={data?.uf_prm}
                  data={ufBrasilList}
                  {...register('uf_prm')}
                  onChange={() => handleFieldChange('uf_prm')}
                />
                <FormError>
                  {errors?.uf_prm?.message && 'Campo Obrigatório'}
                </FormError>
              </div>
              <div>
                <SelectStandard
                  w={'400px'}
                  title="Nome Hospital MEC"
                  data={hospitalsToList}
                  {...register('nome_hospital_mec')}
                  defaultValue={data?.nome_hospital_mec}
                />
                <FormError>
                  {errors?.uf_prm?.message && 'Campo Obrigatório'}
                </FormError>
              </div>
            </Box>
          </Fieldset>
          {/* )} */}

          <Fieldset>
            <legend>
              <h2>Documentos Comprobatórios</h2>
            </legend>
            <h3
              style={{ display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <div style={{ flex: 1 }}>Documentos</div>
              <div style={{ flex: 1, marginLeft: '-9rem' }}>Arquivo(.pdf)</div>
            </h3>

            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf, .jpeg, .jpg, .png"
                    {...register('comprovante_cpf')}
                  />
                  <p>
                    {nomeArquivoComprovanteCpf &&
                    nomeArquivoComprovanteCpf[0] &&
                    nomeArquivoComprovanteCpf[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoComprovanteCpf[0].name}`
                      : 'Selecione o Arquivo:'}
                  </p>
                </ContentInputFile>
                <p>
                  Comprovante CPF:{' '}
                  {data?.comprovante_cpf &&
                    formatFileName(data.comprovante_cpf)}
                </p>
              </ContainerInputFile>
              {data?.comprovante_cpf ? (
                <ContentFileToEditOrDelete>
                  <a
                    href={`/upload/${data?.comprovante_cpf}`}
                    download
                    id="fileButton"
                  >
                    baixar
                  </a>
                  <Modal
                    plural={false}
                    data={data?.comprovante_cpf}
                    title="excluir"
                    fnDelete={() =>
                      handleDeleteFile(data?.comprovante_cpf, 'comprovante_cpf')
                    }
                    bgColor="#be0000"
                  />
                </ContentFileToEditOrDelete>
              ) : (
                <EmptyContainer></EmptyContainer>
              )}
            </Box>

            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf, .jpeg, .jpg, .png"
                    {...register('comprovante_endereco')}
                  />
                  <p>
                    {nomeArquivoComprovanteEndereco &&
                    nomeArquivoComprovanteEndereco[0] &&
                    nomeArquivoComprovanteEndereco[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoComprovanteEndereco[0].name}`
                      : 'Selecione o Arquivo:'}
                  </p>
                </ContentInputFile>
                <p>
                  Comprovante Endereço:{' '}
                  {data?.comprovante_endereco &&
                    formatFileName(data.comprovante_endereco)}
                </p>
              </ContainerInputFile>
              {data?.comprovante_endereco ? (
                <ContentFileToEditOrDelete>
                  <a
                    href={`/upload/${data?.comprovante_endereco}`}
                    download
                    id="fileButton"
                  >
                    baixar
                  </a>
                  <Modal
                    plural={false}
                    data={data?.comprovante_endereco}
                    title="excluir"
                    fnDelete={() =>
                      handleDeleteFile(
                        data?.comprovante_endereco,
                        'comprovante_endereco',
                      )
                    }
                    bgColor="#be0000"
                  />
                </ContentFileToEditOrDelete>
              ) : (
                <EmptyContainer></EmptyContainer>
              )}
            </Box>
            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf, .jpeg, .jpg, .png"
                    {...register('certidao_quitacao_crm')}
                  />
                  <p>
                    {nomeArquivoCertidaoQuitacaoCrm &&
                    nomeArquivoCertidaoQuitacaoCrm[0] &&
                    nomeArquivoCertidaoQuitacaoCrm[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoCertidaoQuitacaoCrm[0].name}`
                      : 'Selecione o Arquivo:'}
                  </p>
                </ContentInputFile>
                <p>
                  Certidão Quitação do CRM:{' '}
                  {data?.certidao_quitacao_crm &&
                    formatFileName(data.certidao_quitacao_crm)}
                </p>
              </ContainerInputFile>
              {data?.certidao_quitacao_crm ? (
                <ContentFileToEditOrDelete>
                  <a
                    href={`/upload/${data?.certidao_quitacao_crm}`}
                    download
                    id="fileButton"
                  >
                    baixar
                  </a>
                  <Modal
                    plural={false}
                    data={data?.certidao_quitacao_crm}
                    title="excluir"
                    fnDelete={() =>
                      handleDeleteFile(
                        data?.certidao_quitacao_crm,
                        'certidao_quitacao_crm',
                      )
                    }
                    bgColor="#be0000"
                  />
                </ContentFileToEditOrDelete>
              ) : (
                <EmptyContainer></EmptyContainer>
              )}
            </Box>

            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf, .jpeg, .jpg, .png"
                    {...register('certificado_conclusao_especializacao')}
                  />
                  <p>
                    {nomeArquivoCertificadoConclusaoEspecializacao &&
                    nomeArquivoCertificadoConclusaoEspecializacao[0] &&
                    nomeArquivoCertificadoConclusaoEspecializacao[0].name !==
                      undefined
                      ? `Arquivo Selecionado: ${nomeArquivoCertificadoConclusaoEspecializacao[0].name}`
                      : 'Selecione o Arquivo:'}
                  </p>
                </ContentInputFile>
                <p>
                  Certificado Conclusão Especialização:{' '}
                  {data?.certificado_conclusao_especializacao &&
                    formatFileName(data.certificado_conclusao_especializacao)}
                </p>
              </ContainerInputFile>
              {data?.certificado_conclusao_especializacao ? (
                <ContentFileToEditOrDelete>
                  <a
                    href={`/upload/${data?.certificado_conclusao_especializacao}`}
                    download
                    id="fileButton"
                  >
                    baixar
                  </a>
                  <Modal
                    plural={false}
                    data={data?.certificado_conclusao_especializacao}
                    title="excluir"
                    fnDelete={() =>
                      handleDeleteFile(
                        data?.certificado_conclusao_especializacao,
                        'certificado_conclusao_especializacao',
                      )
                    }
                    bgColor="#be0000"
                  />
                </ContentFileToEditOrDelete>
              ) : (
                <EmptyContainer></EmptyContainer>
              )}
            </Box>

            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf, .jpeg, .jpg, .png"
                    {...register('carta_indicacao_2_membros')}
                  />
                  <p>
                    {nomeArquivoCartaIndicacao2Membros &&
                    nomeArquivoCartaIndicacao2Membros[0] &&
                    nomeArquivoCartaIndicacao2Membros[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoCartaIndicacao2Membros[0].name}`
                      : 'Selecione o Arquivo:'}
                  </p>
                </ContentInputFile>
                <p>
                  Carta Indicação 2 membros:{' '}
                  {data?.carta_indicacao_2_membros &&
                    formatFileName(data.carta_indicacao_2_membros)}
                </p>
              </ContainerInputFile>
              {data?.carta_indicacao_2_membros ? (
                <ContentFileToEditOrDelete>
                  <a
                    href={`/upload/${data?.carta_indicacao_2_membros}`}
                    download
                    id="fileButton"
                  >
                    baixar
                  </a>
                  <Modal
                    plural={false}
                    data={data?.carta_indicacao_2_membros}
                    title="excluir"
                    fnDelete={() =>
                      handleDeleteFile(
                        data?.carta_indicacao_2_membros,
                        'carta_indicacao_2_membros',
                      )
                    }
                    bgColor="#be0000"
                  />
                </ContentFileToEditOrDelete>
              ) : (
                <EmptyContainer></EmptyContainer>
              )}
            </Box>
            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf, .jpeg, .jpg, .png"
                    {...register('diploma_medicina')}
                  />
                  <p>
                    {nomeArquivoDiplomaMedicina &&
                    nomeArquivoDiplomaMedicina[0] &&
                    nomeArquivoDiplomaMedicina[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoDiplomaMedicina[0].name}`
                      : 'Selecione o Arquivo:'}
                  </p>
                </ContentInputFile>
                <p>
                  Diploma Medicina:{' '}
                  {data?.diploma_medicina &&
                    formatFileName(data.diploma_medicina)}
                </p>
              </ContainerInputFile>
              {data?.diploma_medicina ? (
                <ContentFileToEditOrDelete>
                  <a
                    href={`/upload/${data?.diploma_medicina}`}
                    download
                    id="fileButton"
                  >
                    baixar
                  </a>
                  <Modal
                    plural={false}
                    data={data?.diploma_medicina}
                    title="excluir"
                    fnDelete={() =>
                      handleDeleteFile(
                        data?.diploma_medicina,
                        'diploma_medicina',
                      )
                    }
                    bgColor="#be0000"
                  />
                </ContentFileToEditOrDelete>
              ) : (
                <EmptyContainer></EmptyContainer>
              )}
            </Box>
            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf, .jpeg, .jpg, .png"
                    {...register('declaracao_hospital')}
                  />
                  <p>
                    {nomeArquivoDeclaracaoHospital &&
                    nomeArquivoDeclaracaoHospital[0] &&
                    nomeArquivoDeclaracaoHospital[0].name !== undefined
                      ? `Arquivo Selecionado: ${nomeArquivoDeclaracaoHospital[0].name}`
                      : 'Selecione o Arquivo:'}
                  </p>
                </ContentInputFile>
                <p>
                  Declaração Hospital:{' '}
                  {data?.declaracao_hospital &&
                    formatFileName(data.declaracao_hospital)}
                </p>
              </ContainerInputFile>
              {data?.declaracao_hospital ? (
                <ContentFileToEditOrDelete>
                  <a
                    href={`/upload/${data?.declaracao_hospital}`}
                    download
                    id="fileButton"
                  >
                    baixar
                  </a>
                  <Modal
                    plural={false}
                    data={data?.declaracao_hospital}
                    title="excluir"
                    fnDelete={() =>
                      handleDeleteFile(
                        data?.declaracao_hospital,
                        'declaracao_hospital',
                      )
                    }
                    bgColor="#be0000"
                  />
                </ContentFileToEditOrDelete>
              ) : (
                <EmptyContainer></EmptyContainer>
              )}
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Declaração veracidade das informações</h2>
            </legend>
            <Box>
              <div>
                <TextInput
                  w={180}
                  title="Número proposta SBA"
                  {...register('numero_proposta_SBA', {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div>
                <SelectStandard
                  w={'200px'}
                  title="Situação"
                  data={dataSituacao}
                  defaultValue={data?.situacao}
                  {...register('situacao')}
                  onChange={() => handleFieldChange('situacao')}
                />
                <FormError>
                  {errors.situacao?.message && 'Campo Obrigatório'}
                </FormError>
              </div>
              <TextInput
                w={180}
                title="Pendências SAERJ"
                {...register('pendencias_SAERJ')}
              />
              <ContainerDividedEqually>
                <div style={{ marginRight: '15px' }}>
                  <TextInput
                    w={450}
                    title="Nome Presidente Regional"
                    {...register('nome_presidente_regional')}
                  />
                </div>
                <SelectStandard
                  w={'200px'}
                  title="Sigla Regional"
                  {...register('sigla_regional')}
                  data={siglasRegionaisList}
                  defaultValue={data?.sigla_regional || ''}
                />
              </ContainerDividedEqually>
            </Box>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: '15px',
                }}
              >
                <Checkbox
                  title="Declaro para os devidos fins que as informações contidas neste formulário de cadastro são verdadeiras e autênticas"
                  {...register('declaro_verdadeiras')}
                  defaultChecked={data?.declaro_verdadeiras}
                  required
                />
                <p style={{ color: ' rgba(0, 0, 0, 0.6)' }}>
                  Declaro para os devidos fins que as informações contidas neste
                  formulário de cadastro são verdadeiras e autênticas
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '10px',
                }}
              >
                <Checkbox
                  title="Declaro para os devidos fins que proponente à médico em especialização está quite com o pagamento da anuidade regional"
                  {...register('declaro_quite_SAERJ')}
                  defaultChecked={data?.declaro_quite_SAERJ}
                  required
                />
                <p style={{ color: ' rgba(0, 0, 0, 0.6)' }}>
                  Declaro para os devidos fins que proponente à médico em
                  especialização está quite com o pagamento da anuidade regional
                </p>
              </div>
            </div>
          </Fieldset>

          <Button
            type="submit"
            title={isSubmitting ? 'Atualizando...' : 'Atualizar'}
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params
  try {
    const data = await prisma.associados.findFirst({
      where: {
        id: Number(id),
      },
    })
    console.log(data, 'DATA')

    const convertBigIntToString = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'bigint') {
          obj[key] = obj[key].toString()
        }
        if (obj[key] instanceof Date) {
          obj[key] = format(obj[key], 'yyyy-MM-dd') // ou o formato desejado
        }
      }
      return obj
    }

    const dataCategoria = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Categoria_Associado',
        ocorrencia_ativa: true,
      },
    })
    // const dataCategoria = categoriaAssociado.map((item) => {
    //   return {
    //     label: item.ocorrencia_tabela,
    //   }
    // })

    const situacao = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Situação_Associado',
      },
    })
    const dataSituacao = situacao.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      }
    })

    const pais = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Pais',
      },
    })

    const dataPais = pais.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      }
    })

    const nivelResidencia = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Nivel_Residencia',
      },
    })
    const dataNivelResidencia = nivelResidencia.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      }
    })
    const dataUfs = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'UF',
      },
    })

    const dataEmpresas = await prisma.empresa.findMany()
    const dataSiglasRegionais = dataEmpresas?.filter((item: any) => {
      return item.tipo_empresa.toUpperCase() === 'Regionais'.toUpperCase()
    })
    const dataHospitaisFiltrados = dataEmpresas?.filter((item: any) => {
      return item.tipo_empresa.toUpperCase() === 'Hospital'.toUpperCase()
    })

    return {
      props: {
        data: convertBigIntToString(data),
        dataCategoria,
        dataSituacao,
        dataPais,
        dataNivelResidencia,
        dataUfs,
        dataSiglasRegionais,
        dataHospitaisFiltrados,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        data: [],
        dataCategoria: [],
        dataSituacao: [],
        dataPais: [],
        dataNivelResidencia: [],
      },
    }
  }
}
