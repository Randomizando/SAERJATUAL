/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BackPage } from '@/components/BackPage'
import { Button } from '@/components/Button'
import SelectStandard from '@/components/SelectStandard'
import { SwitchInput } from '@/components/SwitchInput'
import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { useArrayDate } from '@/utils/useArrayDate'
import { zodResolver } from '@hookform/resolvers/zod'
import Checkbox from '@mui/material/Checkbox'
import { Empresa, Tabelas } from '@prisma/client'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CaretRight } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { ContainerDividedEqually } from '../atualizar/styled'
import { schemaCadastro } from './schemaCadastro'
import {
  Box,
  Container,
  ContainerInputFile,
  ContentInputFile,
  Fieldset,
  FormError,
  Text,
} from './styled'
import { SelectOptions } from '@/components/SelectOptions'

type SchemaCadastro = z.infer<typeof schemaCadastro>

interface schemaParametrosProps {
  dataCategoria: any
  dataSituacao: any
  dataPais: any
  dataNivelResidencia: any
  dataUfs: any
  dataSiglasRegionais: any
  dataHospitaisFiltrados: any
  checkBiggerId: { matricula_SAERJ: number }
}

export default function AssociadosCadastro({
  dataCategoria,
  dataSituacao,
  dataPais,
  dataNivelResidencia,
  dataUfs,
  dataSiglasRegionais,
  dataHospitaisFiltrados,
  checkBiggerId,
}: schemaParametrosProps) {
  const [cepInvalido, setCepInvalido] = useState()
  const [disableCamposEndereco, setDisableCamposEndereco] = useState(true)
  const [observerPais, setObserverPais] = useState(null)
  const [disableCep, setDisableCep] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SchemaCadastro>({
    resolver: zodResolver(schemaCadastro),
  })

  const dataDays = useArrayDate.Dia()
  const dataMonths = useArrayDate.Mes()
  const dataYears = useArrayDate.AnoAtualMenor()
  const cepValue = watch('cep')
  const checkEmailValidade = watch('confirmarEmail')
  const checkEmail = watch('email')
  const pais = watch('pais')
 
  const checkCategoria = watch('categoria')
  const cep = watch('cep')
  const nomeArquivoComprovanteCpf = watch('comprovante_cpf')
  const nomeArquivoComprovanteEndereco = watch('comprovante_endereco')
  const nomeArquivoCartaIndicacao2Membros = watch('carta_indicacao_2_membros')
  const nomeArquivoCertidaoQuitacaoCrm = watch('certidao_quitacao_crm')
  const nomeArquivoCertificadoConclusaoEspecializacao = watch(
    'certificado_conclusao_especializacao',
  )
  const nomeArquivoDeclaracaoHospital = watch('declaracao_hospital')
  const nomeArquivoDiplomaMedicina = watch('diploma_medicina')
  const ufBrasilList = dataUfs?.map(
    (uf: Tabelas) => uf.complemento_ocorrencia_selecao,
  )
  const siglasRegionaisList = dataSiglasRegionais?.map(
    (item: Empresa) => item.nome_fantasia,
  )
  const hospitalsToList = dataHospitaisFiltrados?.map(
    (hospital: any) => hospital.razao_social,
  )
  const categoriasToList = dataCategoria?.map(
    (categoria: Tabelas) => categoria.ocorrencia_tabela,
  )

  async function handleCheckCep(cep: string) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
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

      const insertValuesForm = (dataViaCep: {
        bairro: string
        localidade: string
        uf: string
        logradouro: string
      }) => {
        setValue('bairro', dataViaCep.bairro)
        setValue('cidade', dataViaCep.localidade)
        setValue('uf', dataViaCep.uf)
        setValue('logradouro', dataViaCep.logradouro)
      }

      const clearErrorsForm = () => {
        clearErrors('bairro')
        clearErrors('cidade')
        clearErrors('uf')
        clearErrors('logradouro')
      }
      insertValuesForm(dataViaCep)
      clearErrorsForm()
    }
  }

  async function handleOnSubmit(data: SchemaCadastro) {
    try {
      let dataNascimento
      let dataInicioEspecializacao
      let dataPrevisaoConclusao

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

      data.cpf = data.cpf.replace(/[^\d]/g, '')
      data.cep = data.cep.replace(/[^\d]/g, '')

      data.telefone_residencial = data.telefone_residencial.replace(
        /[^\d]/g,
        '',
      )
      data.telefone_celular = data.telefone_celular.replace(/[^\d]/g, '')

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

      const formData = new FormData()
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

      await api.post('/associados/cadastro', {
        ...newData,
        residencia_mec_cnrm: String(data.residencia_mec_cnrm),
        declaro_quite_SAERJ: String(data.declaro_quite_SAERJ),
        declaro_verdadeiras: String(data.declaro_verdadeiras),
        comprovante_cpf: await response.data.names_arquivos[0],
        comprovante_endereco: await response.data.names_arquivos[1],
        carta_indicacao_2_membros: await response.data.names_arquivos[2],
        certidao_quitacao_crm: await response.data.names_arquivos[3],
        certificado_conclusao_especializacao:
          await response.data.names_arquivos[4],
        declaracao_hospital: await response.data.names_arquivos[5],
        diploma_medicina: await response.data.names_arquivos[6],
        data_nascimento: dataNascimento,
        data_inicio_especializacao: dataInicioEspecializacao,
        data_previsao_conclusao: dataPrevisaoConclusao,
      })
      toast.success('Operação concluída com sucesso')
      router.push('/associados')
    } catch (error) {
      console.log(error)
      toast.error('Oops algo deu errado...')
    }
  }
  // BUTTON + 3ANOS
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

  function valuesInitial() {
    setValue('numero', '')
    setValue('numero_proposta_SBA', 0)
    setValue('matricula_SAERJ', checkBiggerId.matricula_SAERJ + 1)
    setValue('matricula_SBA', 0)
    setValue('cpf', '')
  }

  const arraySexo = [
    {
      label: 'Masculino',
    },
    {
      label: 'Feminino',
    },
  ]

  useEffect(() => {
    handleGetAllParams()
    valuesInitial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChangePais({ target }) {
    const paisValue = target?.value
    if (paisValue) {
      const shouldDisableCep = !!paisValue && paisValue !== 'Brasil'
      clearErrors('pais')
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
  }

  useEffect(() => {
    if (observerPais === 'Brasil' && !cep) {
      setError('cep', { message: 'Campo Obrigatório', type: 'too_small' })
    } else {
      clearErrors('cep')
    }
  }, [observerPais])

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
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <BackPage backRoute="associados" />
        <fieldset>
          <legend>
            <Link href="/associados">Associados</Link>
            <CaretRight size={14} />
            <span>Incluir</span>
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
                  value={checkBiggerId.matricula_SAERJ + 1}
                  {...register('matricula_SAERJ', {
                    valueAsNumber: true,
                  })}
                  disabled
                  // value={}
                  // helperText={errors.matricula_SAERJ?.message}
                  // error={!!errors.matricula_SAERJ?.message}
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
                  title="UF CRM *"
                  data={ufBrasilList}
                  {...register('uf_crm')}
                  defaultValue=""
                />
                <FormError>
                  {errors.uf_crm?.message && 'Campo Obrigatório'}
                </FormError>
              </div>
              <div>
                <TextInput
                  w={180}
                  title="CRM"
                  {...register('crm')}
                  helperText={errors?.crm?.message}
                  error={!!errors?.crm?.message}
                />
              </div>

              <TextInput
                title="Nome Completo"
                {...register('nome_completo')}
                helperText={errors.nome_completo?.message}
                error={!!errors.nome_completo?.message}
              />
              <div>
                <TextInput
                  w={140}
                  title="CPF"
                  mask={'999.999.999-99'}
                  {...register('cpf')}
                  helperText={errors.cpf?.message}
                  error={!!errors.cpf?.message}
                />
              </div>
            </Box>

            <Box>
              <div style={{ width: '230px' }}>
                <SelectStandard
                  data={arraySexo}
                  title="Sexo"
                  {...register('sexo')}
                />
                <FormError>
                  {errors?.sexo?.message && 'Campo Obrigatório'}
                </FormError>
              </div>
              <div>
                <TextInput
                  w={330}
                  title="Nome Profissional"
                  {...register('nome_profissional')}
                />
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'end',
                    width: '24rem',
                  }}
                >
                  <Text>Data Nascimento</Text>
                  <SelectStandard
                    w="4rem"
                    title="Dia"
                    data={dataDays}
                    {...register('dayNasc')}
                    // zzz defaultValue={{ label: '' }}
                  />
                  <SelectStandard
                    data={dataMonths}
                    title="Mês"
                    w="4rem"
                    {...register('monthNasc')}
                    // zzz defaultValue={{ label: '' }}
                  />
                  <SelectStandard
                    w="8rem"
                    title="Ano"
                    data={dataYears}
                    {...register('yearNasc')}
                    // zzz defaultValue={{ label: '' }}
                  />
                </div>
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <FormError>
                    {errors.dayNasc?.message ||
                    errors.dayNasc?.message ||
                    errors.yearNasc?.message
                      ? 'Campo Obrigatório'
                      : null}
                  </FormError>
                </span>
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
                    mask="99999-999"
                    helperText={errors?.cep?.message}
                    error={!disableCep && !!errors?.cep?.message}
                    disabled={disableCep}
                    value={disableCep ? '' : cep}
                    defaultValue={disableCep ? '' : cep}
                  />

                  <Button
                    type="button"
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
                  w={'260px'}
                  title="País onde reside *"
                  {...register('pais')}
                  onChange={handleChangePais}
                  // zzz defaultValue={{ label: '' }}
                />
                <FormError>
                  {errors?.pais?.message && 'Campo Obrigatório'}
                </FormError>
              </div>
              {!disableCep && (
                <div>
                  <TextInput
                    disabled={disableCamposEndereco}
                    w={100}
                    title="UF *"
                    {...register('uf')}
                    error={!!errors?.uf?.message && 'Campo Obrigatório'}
                    helperText={errors?.uf?.message && 'Campo Obrigatório'}
                  />
                </div>
              )}
              <div>
                <TextInput
                  disabled={disableCamposEndereco}
                  w={350}
                  title="Cidade *"
                  {...register('cidade')}
                  error={!!errors?.cidade?.message && 'Campo Obrigatório'}
                  helperText={errors?.cidade?.message && 'Campo Obrigatório'}
                />
              </div>
              <Box>
                <div>
                  <TextInput
                    w={275}
                    disabled={disableCamposEndereco}
                    title="Bairro *"
                    {...register('bairro')}
                    error={!!errors?.bairro?.message && 'Campo Obrigatório'}
                    helperText={errors?.bairro?.message && 'Campo Obrigatório'}
                  />
                </div>
                <div>
                  <TextInput
                    w={400}
                    disabled={disableCamposEndereco}
                    title="Logradouro *"
                    {...register('logradouro')}
                    error={!!errors?.logradouro?.message && 'Campo Obrigatório'}
                    helperText={
                      errors?.logradouro?.message && 'Campo Obrigatório'
                    }
                  />
                </div>

                <div>
                  <TextInput
                    w={90}
                    title="Número *"
                    {...register('numero')}
                    error={!!errors?.numero?.message}
                    helperText={errors?.numero?.message}
                  />
                </div>

                <div>
                  <TextInput
                    title="Complemento *"
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
                  mask={'(99) 9.9999-9999'}
                  {...register('telefone_celular')}
                  error={!!errors?.telefone_celular?.message}
                  helperText={errors?.telefone_celular?.message}
                />
              </div>
              <div>
                <TextInput
                  w={300}
                  title="Telefone Residencial"
                  mask={'(99) 9999-9999'}
                  {...register('telefone_residencial')}
                />
              </div>
              <TextInput
                type="email"
                title="Email"
                {...register('email')}
                error={!!errors?.email?.message}
                helperText={errors?.email?.message}
              />
              {checkEmail === checkEmailValidade ? (
                <>
                  <TextInput
                    title="Confirmação email"
                    {...register('confirmarEmail')}
                  />
                </>
              ) : (
                <TextInput
                  title="Confirmação email"
                  {...register('confirmarEmail')}
                  error
                  helperText={'Email não confere'}
                />
              )}
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Dados referente a formação acadêmica</h2>
            </legend>
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
                    error={!!errors?.nome_instituicao_ensino_graduacao?.message}
                    helperText={
                      errors?.nome_instituicao_ensino_graduacao?.message
                    }
                  />
                </div>

                <div>
                  <SwitchInput
                    title="Residencia MEC-CNRM"
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
                    // zzz defaultValue={{ label: '' }}
                  />
                  <FormError>
                    {errors?.ano_conclusao_graduacao?.message &&
                      'Campo Obrigatório'}
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
                {checkCategoria === 'Adjuntos' ? (
                  <div>
                    <SelectStandard
                      w={'230px'}
                      title="UF PRM"
                      data={ufBrasilList}
                      {...register('uf_prm')}
                    />
                    <FormError>
                      {errors?.uf_prm?.message && 'Campo Obrigatório'}
                    </FormError>
                  </div>
                ) : (
                  <>
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
                        // zzz defaultValue={{ label: '' }}
                      />
                      <SelectStandard
                        data={dataMonths}
                        title="Mês"
                        w={'90px'}
                        {...register('monthInicioEspec')}
                        // zzz defaultValue={{ label: '' }}
                      />

                      <SelectStandard
                        w={'120px'}
                        title="Ano"
                        data={dataYears}
                        {...register('yearInicioEspec')}
                        // zzz defaultValue={{ label: '' }}
                      />
                    </div>
                  </>
                )}

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
                      w={'90px'}
                      {...register('dayPrevConcl')}
                    />
                    <SelectOptions
                      data={dataMonths}
                      description="Mês"
                      w={'90px'}
                      {...register('monthPrevConcl')}
                    />
                    <SelectOptions
                      w={'120px'}
                      description="Ano"
                      data={useArrayDate.AnoAtualMaior()}
                      {...register('yearPrevConcl')}
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
          </Fieldset>

          {checkCategoria === 'Adjuntos' ? null : (
            <Fieldset>
              <legend>
                <h2>Histórico do Proponente</h2>
              </legend>

              <Box>
                <div>
                  <SelectStandard
                    w={'210px'}
                    title="Nível Residencia"
                    {...register('nivel_residencia')}
                    data={dataNivelResidencia}
                    // zzz defaultValue={{ label: '' }}
                  />
                  <FormError>
                    {errors?.nivel_residencia?.message && 'Campo Obrigatório'}
                  </FormError>
                </div>
                <div>
                  <SelectStandard
                    w={'230px'}
                    title="UF PRM *"
                    data={ufBrasilList}
                    {...register('uf_prm')}
                  />
                  <FormError>
                    {errors?.uf_prm?.message && 'Campo Obrigatório'}
                  </FormError>
                </div>
                <SelectStandard
                  w={'400px'}
                  title="Nome Hospital MEC"
                  data={hospitalsToList}
                  {...register('nome_hospital_mec')}
                />
              </Box>
            </Fieldset>
          )}

          <Fieldset>
            <legend>
              <h2>Documentos Comprobatórios</h2>
            </legend>
            <h3
              style={{ display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <div style={{ flex: 1 }}>Documentos</div>
              <div style={{ flex: 1 }}>Arquivo(.pdf)</div>
            </h3>

            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
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
                <p>Comprovante CPF</p>
              </ContainerInputFile>
            </Box>

            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
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
                <p>Comprovante Endereço</p>
              </ContainerInputFile>
            </Box>
            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
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
                <p>Certidão Quitação do CRM</p>
              </ContainerInputFile>
            </Box>

            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
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
                <p>Certificado Conclusão Especialização</p>
              </ContainerInputFile>
            </Box>

            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
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
                <p>Carta Indicação 2 membros</p>
              </ContainerInputFile>
            </Box>
            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".pdf"
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
                <p>Diploma Medicina</p>
              </ContainerInputFile>
            </Box>
            {checkCategoria === 'Adjuntos' ? null : (
              <Box>
                <ContainerInputFile>
                  <Button title="Selecionar" />
                  <ContentInputFile>
                    <input
                      type="file"
                      accept=".pdf"
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
                  <p>Declaração Hospital</p>
                </ContainerInputFile>
              </Box>
            )}
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
                  {...register('situacao')}
                  // zzz defaultValue={{ label: '' }}
                />
                <FormError>
                  {errors.situacao?.message && 'Campo Obrigatório'}
                </FormError>
              </div>
              <div>
                <TextInput
                  w={180}
                  title="Pendências SAERJ"
                  {...register('pendencias_SAERJ')}
                />
              </div>
            </Box>
            <Box>
              <ContainerDividedEqually>
                <div style={{ marginRight: '15px' }}>
                  <TextInput
                    w={450}
                    title="Nome Presidente Regional"
                    {...register('nome_presidente_regional')}
                  />
                </div>
                <div>
                  <SelectStandard
                    w={'200px'}
                    title="Sigla Regional"
                    {...register('sigla_regional')}
                    data={siglasRegionaisList}
                  />
                </div>
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
            title={isSubmitting ? 'Cadastrando...' : 'Cadastrar Proposta'}
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const dataCategoria = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Categoria_Associado',
        ocorrencia_ativa: true,
      },
    })

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

    const checkBiggerId = await prisma.associados.findFirst({
      select: {
        matricula_SAERJ: true,
      },
      orderBy: {
        matricula_SAERJ: 'desc',
      },
    })
    // console.log(checkBiggerId?.matricula_SAERJ)

    return {
      props: {
        dataCategoria,
        dataSituacao,
        dataPais,
        dataNivelResidencia,
        dataUfs,
        dataSiglasRegionais,
        dataHospitaisFiltrados,
        checkBiggerId,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        dataCategoria: [],
        dataSituacao: [],
        dataPais: [],
        dataNivelResidencia: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}