import { BackPage } from '@/components/BackPage'
import { Button } from '@/components/Button'
import SelectNoComplete from '@/components/SelectNoComplete'
import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { useArrayDate } from '@/utils/useArrayDate'
import { zodResolver } from '@hookform/resolvers/zod'
import { isValid, parse } from 'date-fns'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CaretRight } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { schema } from './schema'
import {
  AssociadoNome,
  Box,
  Container,
  ContainerAssociado,
  ContentDate,
  FormError,
  Text,
} from './styled'
import { isValidNumber } from '@/utils/validators'
import { Associados, Tabelas } from '@prisma/client'
import { maskMoney } from '@/utils/mask'
import { moneyToFloat } from '@/utils/format'
import NewSelectOptions from '@/components/NewSelectOptions'
import NewTextInput from '@/components/NewTextInput'

type Schema = z.infer<typeof schema>

interface Props {
  tiposPagamentos: Tabelas[]
  formasPagamentos: Tabelas[]
}

export default function Page({ tiposPagamentos, formasPagamentos }: Props) {
  const router = useRouter()
  const [associado, setAssociado] = useState<Associados>()
  const [allowsInstallment, setAllowsInstallment] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    setValue('year', new Date().getFullYear().toString())
    setValue('uniquePaymentDate', '')
    setValue('firstInstallmentDate', '')
    setValue('secondInstallmentDate', '')
    setValue('thirdInstallmentDate', '')
  }, [setValue])

  const matricula = watch('saerjEnrollment')
  useEffect(() => {
    if (matricula) {
      const typingDelay = setTimeout(async () => {
        const response: { associado: Associados; error: string } = await fetch(
          `/api/associados/get/matricula/${matricula}`,
        ).then((res) => res.json())

        if (response.error) {
          setAssociado(undefined)
          return toast.error('Matrícula inválida')
        }

        if (response.associado) {
          return setAssociado(response.associado)
        }
      }, 1200)

      return () => clearTimeout(typingDelay)
    }
  }, [matricula])

  useEffect(() => {
    if (errors.saerjEnrollment || errors.paymentMethod || errors.paymentType) {
      toast.error('Por favor, preencha os campos obrigatórios')
    }
  }, [errors])

  const uniquePaymentDate = watch('uniqueInstallmentDay')
  const uniquePaymentMonth = watch('uniqueInstallmentMonth')
  const firstInstallmentPaymentDate = watch('firstInstallmentDay')
  const firstInstallmentPaymentMonth = watch('firstInstallmentMonth')
  const secondInstallmentPaymentDate = watch('secondInstallmentDay')
  const secondInstallmentPaymentMonth = watch('secondInstallmentMonth')
  const thirdInstallmentPaymentDate = watch('thirdInstallmentDay')
  const thirdInstallmentPaymentMonth = watch('thirdInstallmentMonth')
  useEffect(() => {
    if (
      uniquePaymentDate &&
      uniquePaymentMonth &&
      (associado?.categoria?.includes('ME1') ||
        associado?.categoria?.includes('ME2') ||
        associado?.categoria?.includes('ME3'))
    ) {
      if (
        parseInt(uniquePaymentMonth) <= 4 &&
        parseInt(uniquePaymentDate) <= 30
      ) {
        setValue('uniqueInstallmentValue', '419,00')
      } else {
        setValue('uniqueInstallmentValue', '838,00')
      }
    } else if (
      associado?.categoria?.includes('ATV') ||
      associado?.categoria?.includes('ADJ')
    ) {
      if (allowsInstallment) {
        if (firstInstallmentPaymentMonth && firstInstallmentPaymentDate) {
          if (
            parseInt(firstInstallmentPaymentMonth) <= 2 &&
            parseInt(firstInstallmentPaymentDate) <= 29
          ) {
            setValue('firstInstallmentValue', '798,00')
          } else if (
            parseInt(firstInstallmentPaymentMonth) <= 3 &&
            parseInt(firstInstallmentPaymentDate) <= 31
          ) {
            setValue('firstInstallmentValue', '818,00')
          } else if (
            parseInt(firstInstallmentPaymentMonth) <= 4 &&
            parseInt(firstInstallmentPaymentDate) <= 30
          ) {
            setValue('firstInstallmentValue', '838,00')
          } else {
            setValue('firstInstallmentValue', '888,00')
          }
        }

        if (secondInstallmentPaymentMonth && secondInstallmentPaymentDate) {
          if (
            parseInt(secondInstallmentPaymentMonth) <= 2 &&
            parseInt(secondInstallmentPaymentDate) <= 29
          ) {
            setValue('secondInstallmentValue', '798,00')
          } else if (
            parseInt(secondInstallmentPaymentMonth) <= 3 &&
            parseInt(secondInstallmentPaymentDate) <= 31
          ) {
            setValue('secondInstallmentValue', '818,00')
          } else if (
            parseInt(secondInstallmentPaymentMonth) <= 4 &&
            parseInt(secondInstallmentPaymentDate) <= 30
          ) {
            setValue('secondInstallmentValue', '838,00')
          } else {
            setValue('secondInstallmentValue', '888,00')
          }
        }

        if (thirdInstallmentPaymentMonth && thirdInstallmentPaymentDate) {
          if (
            parseInt(thirdInstallmentPaymentMonth) <= 2 &&
            parseInt(thirdInstallmentPaymentDate) <= 29
          ) {
            setValue('thirdInstallmentValue', '798,00')
          } else if (
            parseInt(thirdInstallmentPaymentMonth) <= 3 &&
            parseInt(thirdInstallmentPaymentDate) <= 31
          ) {
            setValue('thirdInstallmentValue', '818,00')
          } else if (
            parseInt(thirdInstallmentPaymentMonth) <= 4 &&
            parseInt(thirdInstallmentPaymentDate) <= 30
          ) {
            setValue('thirdInstallmentValue', '838,00')
          } else {
            setValue('thirdInstallmentValue', '888,00')
          }
        }
      } else {
        if (uniquePaymentMonth && uniquePaymentDate) {
          if (
            parseInt(uniquePaymentMonth) <= 2 &&
            parseInt(uniquePaymentDate) <= 29
          ) {
            setValue('uniqueInstallmentValue', '798,00')
          } else if (
            parseInt(uniquePaymentMonth) <= 3 &&
            parseInt(uniquePaymentDate) <= 31
          ) {
            setValue('uniqueInstallmentValue', '818,00')
          } else if (
            parseInt(uniquePaymentMonth) <= 4 &&
            parseInt(uniquePaymentDate) <= 30
          ) {
            setValue('uniqueInstallmentValue', '838,00')
          } else {
            setValue('uniqueInstallmentValue', '888,00')
          }
        }
      }
    }
  }, [
    associado,
    allowsInstallment,
    uniquePaymentDate,
    uniquePaymentMonth,
    firstInstallmentPaymentDate,
    firstInstallmentPaymentMonth,
    secondInstallmentPaymentDate,
    secondInstallmentPaymentMonth,
    thirdInstallmentPaymentDate,
    thirdInstallmentPaymentMonth,
    setValue,
  ])

  useEffect(() => {
    if (allowsInstallment) {
      setValue('uniquePaymentDate', '')
      setValue('uniqueInstallmentDay', '')
      setValue('uniqueInstallmentMonth', '')
      setValue('uniqueInstallmentYear', '')
      setValue('uniqueInstallmentValue', '')
    } else {
      setValue('firstInstallmentDate', '')
      setValue('firstInstallmentDay', '')
      setValue('firstInstallmentMonth', '')
      setValue('firstInstallmentYear', '')
      setValue('firstInstallmentValue', '')

      setValue('secondInstallmentDate', '')
      setValue('secondInstallmentDay', '')
      setValue('secondInstallmentMonth', '')
      setValue('secondInstallmentYear', '')
      setValue('secondInstallmentValue', '')

      setValue('thirdInstallmentDate', '')
      setValue('thirdInstallmentDay', '')
      setValue('thirdInstallmentMonth', '')
      setValue('thirdInstallmentYear', '')
      setValue('thirdInstallmentValue', '')
    }
  }, [allowsInstallment, setValue])

  const FormatDate = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const date = parse(`${year}-${month}-${day}`, 'yyyy-MM-dd', new Date())

      if (isValid(date)) {
        return useArrayDate.MontarDate(year, month, day)
      } else {
        return 'Data inválida'
      }
    }
  }

  async function onSubmit(data: Schema) {
    if (!associado) {
      return toast.error('Matrícula inválida')
    }

    if (data.paymentMethod === 'Selecione') {
      return toast.error('Forma de pagamento inválida')
    }

    if (data.paymentType === 'Selecione') {
      return toast.error('Tipo de pagamento inválido')
    }

    const currentYear = new Date().getFullYear()

    if (!isValidNumber(data.year)) {
      return toast.error('O ano da anuidade deve ser válido')
    }

    if (parseInt(data.year) > currentYear) {
      return toast.error('O ano da anuidade não pode ser maior que o ano atual')
    }

    try {
      const valorPagtoUnico = moneyToFloat(data.uniqueInstallmentValue)
      const valorPagtoParcela1 = moneyToFloat(data.firstInstallmentValue)
      const valorPagtoParcela2 = moneyToFloat(data.secondInstallmentValue)
      const valorPagtoParcela3 = moneyToFloat(data.thirdInstallmentValue)

      if (
        (data.uniqueInstallmentValue && !isValidNumber(valorPagtoUnico)) ||
        (data.firstInstallmentValue && !isValidNumber(valorPagtoParcela1)) ||
        (data.secondInstallmentValue && !isValidNumber(valorPagtoParcela2)) ||
        (data.thirdInstallmentValue && !isValidNumber(valorPagtoParcela3))
      ) {
        return toast.error('Os valores de pagamento devem ser válidos')
      }

      const datePagtoUnico = FormatDate(
        data.uniqueInstallmentDay,
        data.uniqueInstallmentMonth,
        data.uniqueInstallmentYear,
      )

      const datePagtoParc1 = FormatDate(
        data.firstInstallmentDay,
        data.firstInstallmentMonth,
        data.firstInstallmentYear,
      )

      const datePagtoParc2 = FormatDate(
        data.secondInstallmentDay,
        data.secondInstallmentMonth,
        data.secondInstallmentYear,
      )

      const datePagtoParc3 = FormatDate(
        data.thirdInstallmentDay,
        data.thirdInstallmentMonth,
        data.thirdInstallmentYear,
      )

      if (
        !datePagtoUnico &&
        !datePagtoParc1 &&
        !datePagtoParc2 &&
        !datePagtoParc3
      ) {
        return toast.error(
          'Preencha pelo menos uma informação de pagamento por completo',
        )
      }

      if (datePagtoUnico === 'Data inválida') {
        return toast.error('A data do pagamento único é inválida')
      }

      if (datePagtoParc1 === 'Data inválida') {
        return toast.error('A data da primeira parcela é inválida')
      }

      if (datePagtoParc2 === 'Data inválida') {
        return toast.error('A data da segunda parcela é inválida')
      }

      if (datePagtoParc3 === 'Data inválida') {
        return toast.error('A data da terceira parcela é inválida')
      }

      if (
        (datePagtoParc1 || datePagtoParc2 || datePagtoParc3) &&
        formasPagamentos.some(
          (formaPagamento) =>
            formaPagamento.ocorrencia_tabela === data.paymentMethod &&
            formaPagamento.complemento_ocorrencia_selecao ===
              'Aceita parcelamento: Não',
        )
      ) {
        return toast.error(
          'Não é possível cadastrar parcelas para essa forma de pagamento',
        )
      }

      if (
        (datePagtoUnico || data.uniqueInstallmentValue) &&
        (datePagtoParc1 ||
          datePagtoParc2 ||
          datePagtoParc3 ||
          data.firstInstallmentValue ||
          data.secondInstallmentValue ||
          data.thirdInstallmentValue)
      ) {
        return toast.error(
          'Não é possível cadastrar parcelas para um pagamento único',
        )
      }

      const now = new Date().toISOString()
      if (
        datePagtoUnico! > now ||
        datePagtoParc1! > now ||
        datePagtoParc2! > now ||
        datePagtoParc3! > now
      ) {
        return toast.error('As datas inseridas não podem ser datas futuras')
      }

      if (datePagtoParc1! > datePagtoParc2!) {
        return toast.error(
          'A data da segunda parcela deve ser posterior a primeira',
        )
      }

      if (datePagtoParc2! > datePagtoParc3!) {
        return toast.error(
          'A data da terceira parcela deve ser posterior a segunda',
        )
      }

      if (datePagtoParc2 && !datePagtoParc1) {
        return toast.error('Adicione a primeira parcela')
      }

      if (datePagtoParc3 && !datePagtoParc1 && !datePagtoParc2) {
        return toast.error('Adicione a primeira e segunda parcela')
      }

      if (datePagtoUnico && data.uniqueInstallmentValue === '') {
        return toast.error('Preencha o valor da parcela única')
      }

      if (datePagtoParc1 && data.firstInstallmentValue === '') {
        return toast.error('Preencha o valor da primeira parcela')
      }

      if (datePagtoParc2 && data.secondInstallmentValue === '') {
        return toast.error('Preencha o valor da segunda parcela')
      }

      if (datePagtoParc3 && data.thirdInstallmentValue === '') {
        return toast.error('Preencha o valor da terceira parcela')
      }

      if (datePagtoUnico && valorPagtoUnico < 0) {
        return toast.error('O valor da parcela única não pode ser negativo')
      }

      if (datePagtoParc1 && valorPagtoParcela1 < 0) {
        return toast.error('O valor da primeira parcela não pode ser negativo')
      }

      if (datePagtoParc2 && valorPagtoParcela2 < 0) {
        return toast.error('O valor da segunda parcela não pode ser negativo')
      }

      if (datePagtoParc3 && valorPagtoParcela3 < 0) {
        return toast.error('O valor da terceira parcela não pode ser negativo')
      }

      const pagamentos = await api.get('/pagamentos/getAll')

      for (const pagamento of pagamentos.data) {
        if (
          pagamento.ano_anuidade === data.year &&
          pagamento.matricula_saerj === data.saerjEnrollment
        ) {
          return toast.error('Pagamento duplicado')
        }
      }

      await api.post('/pagamentos/cadastro', {
        matricula_saerj: data.saerjEnrollment,
        tipo_pagamento: data.paymentType,
        forma_pagamento: data.paymentMethod,
        ano_anuidade: data.year,
        data_pagto_unico: datePagtoUnico || null,
        data_pagto_parcela_1: datePagtoParc1 || null,
        data_pagto_parcela_2: datePagtoParc2 || null,
        data_pagto_parcela_3: datePagtoParc3 || null,
        valor_pagto_unico: valorPagtoUnico || null,
        valor_pagto_parcela_1: valorPagtoParcela1 || null,
        valor_pagto_parcela_2: valorPagtoParcela2 || null,
        valor_pagto_parcela_3: valorPagtoParcela3 || null,
      })

      toast.success('Operação concluída com sucesso')

      return router.push('/pagamentos')
    } catch (error) {
      return toast.error('Ops algo deu errado...')
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BackPage backRoute="pagamentos" />

        <fieldset>
          <legend>
            <span>
              <Link href={'/pagamentos'}>Pagamentos</Link>
            </span>

            <CaretRight size={14} />

            <span>Incluir</span>
          </legend>

          <Box>
            <ContainerAssociado>
              <TextInput
                w={180}
                title="Matricula Associado na SAERJ *"
                error={!!errors?.saerjEnrollment?.message}
                helperText={errors?.saerjEnrollment?.message}
                {...register('saerjEnrollment')}
              />

              {associado && (
                <AssociadoNome>
                  {associado.nome_completo} | {associado.categoria}
                </AssociadoNome>
              )}
            </ContainerAssociado>
          </Box>

          <Box>
            <div>
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                title="Aceita Parcelamento"
                value="Não"
                data={[{ id: 1, ocorrencia_tabela: 'Sim' }]}
                onChange={(e) => setAllowsInstallment(e.target.value === 'Sim')}
              />
            </div>

            <div>
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                title="Forma de Pagamento *"
                value="Selecione"
                data={formasPagamentos}
                {...register('paymentMethod')}
              />

              <FormError>
                {errors.paymentMethod?.message === 'Required'
                  ? 'Campo Obrigatório'
                  : null}
              </FormError>
            </div>

            <div>
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                title="Tipo de Pagamento *"
                value="Selecione"
                data={tiposPagamentos}
                {...register('paymentType')}
              />

              <FormError>
                {errors.paymentType?.message === 'Required'
                  ? 'Campo Obrigatório'
                  : null}
              </FormError>
            </div>

            <NewTextInput
              required
              type="number"
              label="Ano Pagamento"
              defaultValue="2024"
              {...register('year')}
            />
          </Box>

          {allowsInstallment ? (
            <>
              <Box>
                <ContentDate>
                  <Text>
                    Data de Pagamento
                    <br />
                    1ª parcela
                  </Text>

                  <NewSelectOptions
                    containerSx={{ width: 120 }}
                    label="Dia"
                    options={useArrayDate.Dia().map((month) => ({
                      label: month.label,
                      value: month.label,
                    }))}
                    hasNullValue
                    defaultValue={''}
                    {...register('firstInstallmentDay')}
                    error={!!errors.firstInstallmentDay}
                    helperText={
                      errors.firstInstallmentDay ? 'Campo Obrigatório' : ''
                    }
                  />

                  <NewSelectOptions
                    containerSx={{ width: 120 }}
                    label="Mês"
                    options={useArrayDate.Mes().map((month) => ({
                      label: month.label,
                      value: month.label,
                    }))}
                    hasNullValue
                    defaultValue={''}
                    {...register('firstInstallmentMonth')}
                    error={!!errors.firstInstallmentMonth}
                    helperText={
                      errors.firstInstallmentMonth ? 'Campo Obrigatório' : ''
                    }
                  />

                  <NewSelectOptions
                    containerSx={{ width: 120 }}
                    label="Ano"
                    options={useArrayDate.AnoAtualAnteriores().map((month) => ({
                      label: month.label,
                      value: month.label,
                    }))}
                    hasNullValue
                    defaultValue={''}
                    {...register('firstInstallmentYear')}
                    error={!!errors.firstInstallmentYear}
                    helperText={
                      errors.firstInstallmentYear ? 'Campo Obrigatório' : ''
                    }
                  />
                </ContentDate>

                <NewTextInput
                  id="firstInstallment"
                  isMoney
                  disabled
                  maskFunction={maskMoney}
                  label="Valor de Pagamento 1ª Parcela"
                  value={watch('firstInstallmentValue')}
                />
              </Box>

              <Box>
                <ContentDate>
                  <Text>
                    Data de Pagamento
                    <br /> 2ª parcela
                  </Text>

                  <NewSelectOptions
                    containerSx={{ width: 120 }}
                    label="Dia"
                    options={useArrayDate.Dia().map((month) => ({
                      label: month.label,
                      value: month.label,
                    }))}
                    hasNullValue
                    defaultValue={''}
                    {...register('secondInstallmentDay')}
                  />

                  <NewSelectOptions
                    containerSx={{ width: 120 }}
                    label="Mês"
                    options={useArrayDate.Mes().map((month) => ({
                      label: month.label,
                      value: month.label,
                    }))}
                    hasNullValue
                    defaultValue={''}
                    {...register('secondInstallmentMonth')}
                  />

                  <NewSelectOptions
                    containerSx={{ width: 120 }}
                    label="Ano"
                    options={useArrayDate.AnoAtualAnteriores().map((month) => ({
                      label: month.label,
                      value: month.label,
                    }))}
                    hasNullValue
                    defaultValue={''}
                    {...register('secondInstallmentYear')}
                  />
                </ContentDate>

                <NewTextInput
                  id="secondInstallment"
                  isMoney
                  disabled
                  maskFunction={maskMoney}
                  label="Valor de Pagamento 2ª Parcela"
                  value={watch('secondInstallmentValue')}
                />
              </Box>

              <Box>
                <ContentDate>
                  <Text>
                    Data de Pagamento
                    <br />
                    3ª parcela
                  </Text>

                  <NewSelectOptions
                    containerSx={{ width: 120 }}
                    label="Dia"
                    options={useArrayDate.Dia().map((month) => ({
                      label: month.label,
                      value: month.label,
                    }))}
                    hasNullValue
                    defaultValue={''}
                    {...register('thirdInstallmentDay')}
                  />

                  <NewSelectOptions
                    containerSx={{ width: 120 }}
                    label="Mês"
                    options={useArrayDate.Mes().map((month) => ({
                      label: month.label,
                      value: month.label,
                    }))}
                    hasNullValue
                    defaultValue={''}
                    {...register('thirdInstallmentMonth')}
                  />

                  <NewSelectOptions
                    containerSx={{ width: 120 }}
                    label="Ano"
                    options={useArrayDate.AnoAtualAnteriores().map((month) => ({
                      label: month.label,
                      value: month.label,
                    }))}
                    hasNullValue
                    defaultValue={''}
                    {...register('thirdInstallmentYear')}
                  />
                </ContentDate>

                <NewTextInput
                  id="thirdInstallment"
                  isMoney
                  disabled
                  maskFunction={maskMoney}
                  label="Valor de Pagamento 3ª Parcela"
                  value={watch('thirdInstallmentValue')}
                />
              </Box>
            </>
          ) : (
            <Box>
              <ContentDate>
                <Text>Data de Pagamento Parcela Única</Text>

                <NewSelectOptions
                  containerSx={{ width: 120 }}
                  label="Dia"
                  options={useArrayDate.Dia().map((month) => ({
                    label: month.label,
                    value: month.label,
                  }))}
                  hasNullValue
                  defaultValue={''}
                  {...register('uniqueInstallmentDay')}
                  error={!!errors.uniqueInstallmentDay}
                  helperText={
                    errors.uniqueInstallmentDay ? 'Campo Obrigatório' : ''
                  }
                />

                <NewSelectOptions
                  containerSx={{ width: 120 }}
                  label="Mês"
                  options={useArrayDate.Mes().map((month) => ({
                    label: month.label,
                    value: month.label,
                  }))}
                  hasNullValue
                  defaultValue={''}
                  {...register('uniqueInstallmentMonth')}
                  error={!!errors.uniqueInstallmentMonth}
                  helperText={
                    errors.uniqueInstallmentMonth ? 'Campo Obrigatório' : ''
                  }
                />

                <NewSelectOptions
                  containerSx={{ width: 120 }}
                  label="Ano"
                  options={useArrayDate.AnoAtualAnteriores().map((month) => ({
                    label: month.label,
                    value: month.label,
                  }))}
                  hasNullValue
                  defaultValue={''}
                  {...register('uniqueInstallmentYear')}
                  error={!!errors.uniqueInstallmentYear}
                  helperText={
                    errors.uniqueInstallmentYear ? 'Campo Obrigatório' : ''
                  }
                />
              </ContentDate>

              <NewTextInput
                id="uniqueInstallment"
                isMoney
                disabled
                maskFunction={maskMoney}
                label="Valor de Pagamento Parcela Única"
                value={watch('uniqueInstallmentValue')}
              />
            </Box>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
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
        ],
      },
    })

    const tiposPagamentos: Tabelas[] = []
    const formasPagamentos: Tabelas[] = []
    tabelas.forEach((item) =>
      item.codigo_tabela === 'Tipo_Pagamento'
        ? tiposPagamentos.push(item)
        : formasPagamentos.push(item),
    )

    return {
      props: {
        tiposPagamentos,
        formasPagamentos,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)

    return {
      props: {
        tiposPagamentos: [],
        formasPagamentos: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
