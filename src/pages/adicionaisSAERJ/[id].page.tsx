/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BackPage } from '@/components/BackPage'
import { Button } from '@/components/Button'
import { SelectOptions } from '@/components/SelectOptions'
import SelectStandard from '@/components/SelectStandard'

import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { dateDestructuring } from '@/utils/dateFormatter'
import { useArrayDate } from '@/utils/useArrayDate'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox, FormLabel } from '@mui/material'
import { Empresa, Tabelas } from '@prisma/client'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CaretRight } from 'phosphor-react'
import { ParsedUrlQuery } from 'querystring'
import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Id, toast } from 'react-toastify'
import { z } from 'zod'
import { schemaCadastro } from './schemaCadastro'
import {
  Box,
  Container,
  ContainerDividedEqually,
  ContainerInputFile,
  ContentInputFile,
  Fieldset,
  FormError,
  Text,
  TextAreaInput,
} from './styled'

type SchemaCadastro = z.infer<typeof schemaCadastro>

interface schemaParametrosProps {
  dataAssociado: any
  dataHospitaisFiltrados: any
  dataCetFiltrados: any
  dataAdicionaisSaerj: any
  dataTratamentos: any
  dataNacionalidades: any
}

export default function AdicionaisSAERJ({
  dataAssociado,
  dataHospitaisFiltrados,
  dataCetFiltrados,
  dataAdicionaisSaerj,
  dataTratamentos,
  dataNacionalidades,
}: schemaParametrosProps) {
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [declaracaoVeracidade, setDeclaracaoVeracidade] = useState(false)
  const router = useRouter()
  console.log(dataAssociado)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<SchemaCadastro>({
    resolver: zodResolver(schemaCadastro),
    // mode: 'onBlur',
  })

  const dataDays = useArrayDate.Dia()
  const dataMonths = useArrayDate.Mes()
  const dataYears = useArrayDate.AnoAtualMenor()

  const hospitalsToList = dataHospitaisFiltrados?.map(
    (hospital: Empresa) => hospital.razao_social,
  )
  const cetList = dataCetFiltrados?.map((cet: Empresa) => cet.razao_social)
  const tratamentos = dataTratamentos?.map(
    (tratamento: any) => tratamento.ocorrencia_tabela,
  )
  const nacionalidades = dataNacionalidades?.map(
    (nacionalidade: any) => nacionalidade.ocorrencia_tabela,
  )

  const admissaoSAERJ = watch('admissao_saerj')
  const cooperativa = watch('cooperativa')
  const nomePai = watch('nome_pai')
  const nomeMae = watch('nome_mae')
  const tsa = watch('tsa')
  const observacao1 = watch('observacao_1')
  const observacao2 = watch('observacao_2')
  const observacao3 = watch('observacao_3')
  const hospital1 = watch('hospital_1')
  const nome_responsavel = watch('nome_responsavel')
  const tratamento = watch('tratamento')
  const nacionalidade = watch('nacionalidade')
  const fotoAssociado = watch('foto_associado')
  console.log(nomePai)
  const catSaerj = watch('cat_saerj')

  const admissaoSaerjFormatted = dateDestructuring(
    dataAdicionaisSaerj?.admissao_saerj,
  )
  const cetDataInicioFormatted = dateDestructuring(
    dataAdicionaisSaerj?.cet_data_inicio,
  )
  const cetDataFimFormatted = dateDestructuring(
    dataAdicionaisSaerj?.cet_data_fim,
  )

  const fotoAssociadoExistente = typeof fotoAssociado === 'string'

  async function handleOnSubmit(data: SchemaCadastro) {
    const validateDates = (CetDatainicio: any, CetDataFim: any) => {
      if (!CetDatainicio || !CetDataFim) {
        return toast.warn('Data CET início e fim precisam ser informadas')
      }

      const dateInicio = new Date(CetDatainicio)
      const dateFim = new Date(CetDataFim)

      if (dateInicio >= dateFim) {
        setError('cet_data_inicio_dia', {
          type: 'manual',
          message: 'Data Cet Inicio precisa ser menor que data Cet Fim',
        })
        setFocus('cet_data_fim_ano')
        throw new Error('Dados invalidos')
      }
      return true
    }

    const {
      admissao_saerj,
      cet_data_fim_ano,
      cet_data_fim_dia,
      cet_data_fim_mes,
      cet_data_inicio_ano,
      cet_data_inicio_dia,
      cet_data_inicio_mes,
      // cooperativa,
      // nome_pai,
      // nome_mae,
      // tsa,
      // ano_ult_pgto_sba,
      // observacao_1,
      // observacao_2,
      // observacao_3,
      // hospital_1,
      // nome_responsavel,
      // tratamento,
      // nacionalidade,
      // cet,
      foto_associado,
      // cat_saerj,
      // ano_ult_pgto_regional,
      // declaro_verdadeiras,
      ...rest
    } = data

    try {
      let admissionDate
      let CetDataFim
      let CetDatainicio

      if (
        data.cet_data_fim_dia &&
        data.cet_data_fim_mes &&
        data.cet_data_fim_ano
      ) {
        CetDataFim = useArrayDate.MontarDate(
          data.cet_data_fim_ano,
          data.cet_data_fim_mes,
          data.cet_data_fim_dia,
        )
      }

      if (
        data.cet_data_inicio_dia &&
        data.cet_data_inicio_mes &&
        data.cet_data_inicio_ano
      ) {
        CetDatainicio = useArrayDate.MontarDate(
          data.cet_data_inicio_ano,
          data.cet_data_inicio_mes,
          data.cet_data_inicio_dia,
        )
      }

      validateDates(CetDatainicio, CetDataFim)

      if (admissao_saerj.dia && admissao_saerj.mes && admissao_saerj.ano) {
        admissionDate = useArrayDate.MontarDate(
          admissao_saerj.ano,
          admissao_saerj.mes,
          admissao_saerj.dia,
        )
      }
      let fotoAssociadoUploadName = fotoAssociado
      if (!fotoAssociadoExistente) {
        const formData = new FormData()
        formData.append('foto_associado', foto_associado?.[0] || '')

        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        fotoAssociadoUploadName = await response.data.names_arquivos[0]
      }

      if (!dataAdicionaisSaerj) {
        await api.post('/adicionais_saerj/cadastro', {
          ...rest,
          matricula_saerj: dataAssociado.matricula_SAERJ,
          categoria_saerj: dataAssociado.categoria,
          admissao_saerj: admissionDate,
          cet_data_inicio: CetDatainicio,
          cet_data_fim: CetDataFim,
          foto_associado: fotoAssociadoUploadName,
        })
        toast.success('Operação concluída com sucesso')
      } else {
        await api.put('/adicionais_saerj/update', {
          ...rest,
          id: dataAdicionaisSaerj.id,
          matricula_saerj: dataAssociado.matricula_SAERJ,
          categoria_saerj: dataAssociado.categoria,
          admissao_saerj: admissionDate,
          cet_data_inicio: CetDatainicio,
          cet_data_fim: CetDataFim,
          foto_associado: fotoAssociadoUploadName,
        })
        toast.success('Operação concluída com sucesso')
      }
      router.push('/associados')
    } catch (error) {
      console.log(error)
      toast.error('Houve um erro durante a atualização')
    }
  }

  function valuesDefault() {
    setValue('admissao_saerj', {
      dia: admissaoSaerjFormatted.day,
      mes: admissaoSaerjFormatted.month,
      ano: admissaoSaerjFormatted.year,
    })
    setValue('nome_pai', dataAdicionaisSaerj?.nome_pai)
    setValue('nome_mae', dataAdicionaisSaerj?.nome_mae)
    setValue('cooperativa', dataAdicionaisSaerj?.cooperativa)
    setValue('tsa', dataAdicionaisSaerj?.tsa)
    setValue('ano_ult_pgto_sba', dataAdicionaisSaerj?.ano_ult_pgto_sba)
    setValue('observacao_1', dataAdicionaisSaerj?.observacao_1)
    setValue('observacao_2', dataAdicionaisSaerj?.observacao_2)
    setValue('observacao_3', dataAdicionaisSaerj?.observacao_3)
    setValue('hospital_1', dataAdicionaisSaerj?.hospital_1)
    setValue('nome_responsavel', dataAdicionaisSaerj?.nome_responsavel)
    setValue('tratamento', dataAdicionaisSaerj?.tratamento)
    setValue('nacionalidade', dataAdicionaisSaerj?.nacionalidade)
    setValue('cet_data_inicio_dia', cetDataInicioFormatted.day)
    setValue('cet_data_inicio_mes', cetDataInicioFormatted.month)
    setValue('cet_data_inicio_ano', cetDataInicioFormatted.year)

    setValue('cet_data_fim_dia', cetDataFimFormatted.day)
    setValue('cet_data_fim_mes', cetDataFimFormatted.month)
    setValue('cet_data_fim_ano', cetDataFimFormatted.year)

    setValue('cet', dataAdicionaisSaerj?.cet)
    setValue('foto_associado', dataAdicionaisSaerj?.foto_associado)
    setValue(
      'ano_ult_pgto_regional',
      dataAdicionaisSaerj?.ano_ult_pgto_regional,
    )
    setValue('cat_saerj', dataAdicionaisSaerj?.cat_saerj)
    setValue('declaro_verdadeiras', dataAdicionaisSaerj?.declaro_verdadeiras)
    setDeclaracaoVeracidade(dataAdicionaisSaerj?.declaro_verdadeiras)
  }

  useEffect(() => {
    valuesDefault()
  }, [])

  const dataAdmissaoDefault = {
    dia: admissaoSAERJ?.dia || admissaoSaerjFormatted?.day,
    mes: admissaoSAERJ?.mes || admissaoSaerjFormatted?.month,
    ano: admissaoSAERJ?.ano || admissaoSaerjFormatted?.year,
  }

  function ButtonThreeYear() {
    const day = watch('cet_data_inicio_dia')
    const month = watch('cet_data_inicio_mes')
    const year = watch('cet_data_inicio_ano')

    if (!day || !month || !year) {
      return toast('CET data início não informada')
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
      // Se a data original é 29 de fevereiro e o ano resultante não é bissexto,
      // ajusta para 28 de fevereiro do ano resultante
      date.setFullYear(newYear, 1, 28) // Define para 28 de fevereiro diretamente
    } else {
      date.setFullYear(newYear)
    }

    const valuesDatePrevisaoConclusao = () => {
      const dayValue = String(date.getDate()).padStart(2, '0')
      const monthValue = String(date.getMonth() + 1).padStart(2, '0')
      const yearValue = String(date.getFullYear())
      setValue('cet_data_fim_dia', dayValue)
      setValue('cet_data_fim_mes', monthValue)
      setValue('cet_data_fim_ano', yearValue)
    }

    valuesDatePrevisaoConclusao()

    function isLeapYear(year: number) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <BackPage backRoute="associados" />
        <fieldset>
          <legend>
            <Link href="/associados">Associados</Link>
            <CaretRight size={14} />
            <span>Adicionais SAERJ</span>
          </legend>

          <Fieldset>
            <legend>
              <h2>Gerais</h2>
            </legend>

            <Box>
              <TextInput
                title="Nome Completo *"
                defaultValue={dataAssociado?.nome_completo}
                disabled
              />
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'end',
                    width: '28rem',
                  }}
                >
                  <Text>Admissão SAERJ</Text>
                  <SelectStandard
                    title="Dia"
                    data={dataDays}
                    //             w={90}
                    //               defaultValue={{ label: dataAdmissaoDefault?.dia }}

                    w="4rem"
                    defaultValue={dataAdmissaoDefault?.dia}
                    {...register('admissao_saerj.dia')}
                  />
                  <SelectStandard
                    data={dataMonths}
                    title="Mês"
                    defaultValue={dataAdmissaoDefault?.mes}
                    w="4rem"
                    {...register('admissao_saerj.mes')}
                  />
                  <SelectStandard
                    w="8rem"
                    title="Ano"
                    defaultValue={dataAdmissaoDefault?.ano}
                    data={dataYears}
                    {...register('admissao_saerj.ano')}
                  />
                </div>
                <FormError>{errors.admissao_saerj?.root?.message}</FormError>
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                ></span>
              </div>
            </Box>

            <Box>
              {/* <div>
                <TextInput
                  title="Situação"
                  {...register('situacao')}
                  helperText={errors.situacao?.message}
                  error={!!errors.situacao?.message}
                  value={situacao}
                />
              </div> */}
              <div>
                <TextInput
                  title="Cooperativa"
                  {...register('cooperativa')}
                  defaultValue={cooperativa}
                />
              </div>
              <div>
                <TextInput
                  w={450}
                  title="Nome do Pai"
                  {...register('nome_pai')}
                  defaultValue={nomePai}
                />
              </div>
              <div>
                <TextInput
                  w={450}
                  title="Nome da Mãe"
                  {...register('nome_mae')}
                  defaultValue={nomeMae}
                />
              </div>
              <div>
                <TextInput
                  title="TSA"
                  {...register('tsa')}
                  defaultValue={tsa}
                />
              </div>

              <SelectStandard
                w="300px"
                title="Ano último pagamento SBA"
                defaultValue={dataAdicionaisSaerj?.ano_ult_pgto_sba || ''}
                data={dataYears}
                {...register('ano_ult_pgto_sba')}
              />
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Outras informações</h2>
            </legend>

            <div>
              <FormLabel>Observação 1</FormLabel>
              <TextAreaInput
                w={'100%'}
                title="Observação 1"
                {...register('observacao_1')}
                helperText={errors.observacao_1?.message}
                error={!!errors.observacao_1?.message}
                defaultValue={observacao1}
              />
            </div>

            <div>
              <FormLabel>Observação 2</FormLabel>

              <TextAreaInput
                w={'100%'}
                title="Observação 2"
                {...register('observacao_2')}
                helperText={errors.observacao_2?.message}
                error={!!errors.observacao_2?.message}
                defaultValue={observacao2}
              />
            </div>
            <div>
              <FormLabel>Observação 3</FormLabel>

              <TextAreaInput
                w={'100%'}
                title="Observação 3"
                {...register('observacao_3')}
                helperText={errors.observacao_3?.message}
                error={!!errors.observacao_3?.message}
                defaultValue={observacao3}
              />
            </div>
            <div>
              <ContainerDividedEqually>
                <SelectStandard
                  title="Hospital 1"
                  data={hospitalsToList}
                  {...register('hospital_1')}
                  defaultValue={hospital1 || dataAdicionaisSaerj?.hospital_1}
                />

                <TextInput
                  title="Nome Responsável"
                  {...register('nome_responsavel')}
                  defaultValue={
                    nome_responsavel || dataAdicionaisSaerj?.nome_responsavel
                  }
                />
              </ContainerDividedEqually>
              <FormError>{errors?.hospital_1?.message}</FormError>
            </div>
            <Box>
              <Box>
                <SelectStandard
                  w="150px"
                  title="Tratamento"
                  data={tratamentos}
                  {...register('tratamento')}
                  defaultValue={tratamento || dataAdicionaisSaerj?.tratamento}
                />
              </Box>
              <div>
                <SelectStandard
                  w="400px"
                  title="Nacionalidade"
                  data={nacionalidades}
                  {...register('nacionalidade')}
                  defaultValue={
                    nacionalidade || dataAdicionaisSaerj?.nacionalidade
                  }
                />
              </div>
            </Box>
            <Box>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'end',
                    width: '28rem',
                  }}
                >
                  <Text>Cet Data Início</Text>
                  <SelectOptions
                    title="Dia"
                    data={dataDays}
                    defaultValue={cetDataInicioFormatted?.day}
                    w="90px"
                    {...register('cet_data_inicio_dia')}
                  />
                  <SelectOptions
                    data={dataMonths}
                    title="Mês"
                    w="90px"
                    defaultValue={cetDataInicioFormatted?.month}
                    {...register('cet_data_inicio_mes')}
                  />
                  <SelectOptions
                    w="120px"
                    title="Ano"
                    defaultValue={cetDataInicioFormatted?.year}
                    data={dataYears}
                    {...register('cet_data_inicio_ano')}
                  />
                </div>

                <FormError>
                  {errors.cet_data_inicio_dia &&
                    errors?.cet_data_inicio_dia?.message}
                </FormError>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '28rem',
                }}
              >
                <Text>Cet Data Fim</Text>
                <SelectOptions
                  title="Dia"
                  data={dataDays}
                  w="90px"
                  defaultValue={cetDataFimFormatted?.day}
                  {...register('cet_data_fim_dia')}
                />
                <SelectOptions
                  data={dataMonths}
                  title="Mês"
                  w="90px"
                  defaultValue={cetDataFimFormatted?.month}
                  {...register('cet_data_fim_mes')}
                />
                <SelectOptions
                  w="120px"
                  title="Ano"
                  data={useArrayDate.AnoAnteriorFuturos()}
                  defaultValue={cetDataFimFormatted?.year}
                  {...register('cet_data_fim_ano')}
                />
              </div>

              {/* BOTÃO PARA ADICIONAR MAIS 3 ANOS */}
              <Button
                type="button"
                onClick={() => {
                  ButtonThreeYear()
                }}
                style={{ width: '7rem', margin: '0px' }}
                title="Início +3 anos"
              />
              <SelectStandard
                w="300px"
                title="CET"
                defaultValue={dataAdicionaisSaerj?.cet || ''}
                data={cetList}
                {...register('cet')}
              />
            </Box>
            <Box>
              <SelectStandard
                w="300px"
                title="Ano último pagamento regional"
                defaultValue={dataAdicionaisSaerj?.ano_ult_pgto_regional || ''}
                data={dataYears}
                {...register('ano_ult_pgto_regional')}
              />
              <div>
                <TextInput
                  w={450}
                  title="CAT SAERJ"
                  {...register('cat_saerj')}
                  defaultValue={catSaerj}
                />
              </div>
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Foto do Associado </h2>
            </legend>
            <h3
              style={{ display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <div style={{ flex: 1 }}>Fotos</div>
              <div style={{ flex: 1 }}>Arquivo (.jpg ou png)</div>
            </h3>

            <Box>
              <ContainerInputFile>
                <Button title="Selecionar" />
                <ContentInputFile>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    {...register('foto_associado')}
                    onChange={(e) => {
                      register('foto_associado').onChange(e)
                      e.target.blur()
                    }}
                  />
                  <p
                    style={{
                      color: errors?.foto_associado?.message ? '#db2f2f' : '',
                    }}
                  >
                    {fotoAssociadoExistente
                      ? `${fotoAssociado}`
                      : fotoAssociado &&
                          fotoAssociado[0] &&
                          fotoAssociado[0].name !== undefined
                        ? `Arquivo Selecionado: ${fotoAssociado[0].name}`
                        : 'Selecione o Arquivo:'}
                  </p>
                </ContentInputFile>
                <p>Foto do Associado</p>
              </ContainerInputFile>
            </Box>
            <div style={{ marginTop: '-1.8rem', marginLeft: '72.5rem' }}>
              <FormError>{errors?.foto_associado?.message}</FormError>
            </div>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Declaração veracidade das informações</h2>
            </legend>

            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  title="Declaro para os devidos fins que as informações contidas neste formulário de cadastro são verdadeiras e autênticas"
                  checked={declaracaoVeracidade}
                  {...register('declaro_verdadeiras')}
                  onClick={(e: any) =>
                    setDeclaracaoVeracidade(e.target.checked)
                  }
                  required
                />
                <p style={{ color: ' rgba(0, 0, 0, 0.6)' }}>
                  Declaro para os devidos fins que as informações contidas neste
                  formulário de cadastro são verdadeiras e autênticas
                </p>
              </div>
            </div>
          </Fieldset>

          <Button
            type="submit"
            title={isSubmitting ? 'Atualizando  ...' : 'Atualizar'}
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context as { params: ParsedUrlQuery }

  if (!params || typeof params.id !== 'string') {
    return {
      notFound: true,
    }
  }

  const { id } = params

  function serializeBigIntData(data: any) {
    const dataStringified = JSON.stringify(
      data,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
    )

    return JSON.parse(dataStringified)
  }

  try {
    const dataAssociado = await prisma.associados.findFirst({
      where: {
        id: Number(id),
      },
    })

    const dataEmpresas = await prisma.empresa.findMany()

    const dataHospitaisFiltrados = dataEmpresas?.filter((item: any) => {
      return item.tipo_empresa.toUpperCase() === 'Hospital'.toUpperCase()
    })

    const dataCetFiltrados = dataEmpresas?.filter((item: any) => {
      return item.tipo_empresa.toUpperCase() === 'cet'.toUpperCase()
    })

    const dataTabelas = await prisma.tabelas.findMany()

    const dataTratamentos = dataTabelas?.filter((item: Tabelas) => {
      return item.codigo_tabela.toUpperCase() === 'Tratamento'.toUpperCase()
    })

    const dataAdicionaisSaerj = await prisma.adicionais_SAERJ.findFirst({
      where: {
        matricula_saerj: Number(dataAssociado?.matricula_SAERJ),
      },
    })

    const dataNacionalidades = dataTabelas?.filter((item: Tabelas) => {
      return item.codigo_tabela.toUpperCase() === 'Nacionalidade'.toUpperCase()
    })

    return {
      props: {
        dataAssociado: serializeBigIntData(dataAssociado),
        dataHospitaisFiltrados,
        dataCetFiltrados,
        dataTratamentos,
        dataAdicionaisSaerj: serializeBigIntData(dataAdicionaisSaerj),
        dataNacionalidades,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados do associado:', error)
    return {
      props: {},
    }
  } finally {
    prisma.$disconnect()
  }
}
