import { BackPage } from '@/components/BackPage'
import { Button } from '@/components/Button'
import SelectNoComplete from '@/components/SelectNoComplete'
import { SelectOptions } from '@/components/SelectOptions'
import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { useArrayDate } from '@/utils/useArrayDate'
import { isValid, parse } from 'date-fns'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CaretRight } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { FormError } from '../cadastro/styled'
import { schema } from './schema'
import {
  AssociadoNome,
  Box,
  Container,
  ContainerAssociado,
  ContentDate,
  Text,
} from './styled'
import { Associados, Tabelas } from '@prisma/client'
import { isValidNumber } from '@/utils/validators'
import { maskMoney } from '@/utils/mask'
import { moneyToFloat } from '@/utils/format'
import NewTextInput from '@/components/NewTextInput'
import NewSelectOptions from '@/components/NewSelectOptions'

type Schema = z.infer<typeof schema>

type date = {
  dia: string
  mes: string
  ano: string
} | null
interface Props {
  data: {
    id: number
    matricula_saerj: string
    tipo_pagamento: string
    forma_pagamento: string | null
    ano_anuidade: string | null
    data_processamento: date
    data_pagto_unico: date
    valor_pagto_unico: string
    data_pagto_parcela_1: date
    valor_pagto_parcela_1: string
    data_pagto_parcela_2: date
    valor_pagto_parcela_2: string
    data_pagto_parcela_3: date
    valor_pagto_parcela_3: string
  }
  associado: Associados
  tiposPagamentos: Tabelas[]
  formasPagamentos: Tabelas[]
}

export default function Page({
  data,
  associado,
  tiposPagamentos,
  formasPagamentos,
}: Props) {
  const router = useRouter()
  const [allowsInstallment, setAllowsInstallment] = useState(
    !!data.data_pagto_parcela_1,
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<Schema>()

  useEffect(() => {
    setValue('id', data.id)
    setValue('saerjEnrollment', data.matricula_saerj)
    setValue('year', data.ano_anuidade || '')
    setValue('paymentMethod', data.forma_pagamento || '')
    setValue('paymentType', data.tipo_pagamento)

    setValue('uniqueInstallmentValue', data.valor_pagto_unico)

    setValue('firstInstallmentValue', data.valor_pagto_parcela_1)
    setValue('secondInstallmentValue', data.valor_pagto_parcela_2)
    setValue('thirdInstallmentValue', data.valor_pagto_parcela_3)

    if (data.data_pagto_unico) {
      setValue('uniqueInstallmentDay', data.data_pagto_unico.dia)
      setValue('uniqueInstallmentMonth', data.data_pagto_unico.mes)
      setValue('uniqueInstallmentYear', data.data_pagto_unico.ano)
    }

    if (data.data_pagto_parcela_1) {
      setValue('firstInstallmentDate', data.data_pagto_parcela_1.dia)
      setValue('firstInstallmentMonth', data.data_pagto_parcela_1.mes)
      setValue('firstInstallmentYear', data.data_pagto_parcela_1.ano)
    }

    if (data.data_pagto_parcela_2) {
      setValue('secondInstallmentDate', data.data_pagto_parcela_2.dia)
      setValue('secondInstallmentMonth', data.data_pagto_parcela_2.mes)
      setValue('secondInstallmentYear', data.data_pagto_parcela_2.ano)
    }

    if (data.data_pagto_parcela_3) {
      setValue('thirdInstallmentDate', data.data_pagto_parcela_3.dia)
      setValue('thirdInstallmentMonth', data.data_pagto_parcela_3.mes)
      setValue('thirdInstallmentYear', data.data_pagto_parcela_3.ano)
    }
  }, [
    associado,
    data.id,
    data.matricula_saerj,
    data.forma_pagamento,
    data.tipo_pagamento,
    data.ano_anuidade,
    data.data_pagto_unico,
    data.data_pagto_parcela_1,
    data.data_pagto_parcela_2,
    data.data_pagto_parcela_3,
    data.valor_pagto_parcela_1,
    data.valor_pagto_parcela_2,
    data.valor_pagto_parcela_3,
    data.valor_pagto_unico,
    setValue,
  ])

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
    if (data.saerjEnrollment === '') {
      return setError('saerjEnrollment', {
        type: 'manual',
        message: 'Campo Obrigatório',
      })
    } else if (data.paymentType === '') {
      return setError('paymentType', {
        type: 'manual',
        message: 'Campo Obrigatório',
      })
    }

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
        return toast.error('Preencha pelo menos uma informação de pagamento')
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

      await api.put('/pagamentos/update', {
        id: data.id,
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

            <span>Ver/Atualizar</span>
          </legend>

          <Box>
            <ContainerAssociado>
              <TextInput
                w={180}
                disabled
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
                value={data.data_pagto_parcela_1 ? 'Sim' : 'Não'}
                data={[
                  {
                    id: 1,
                    ocorrencia_tabela: data.data_pagto_parcela_1
                      ? 'Não'
                      : 'Sim',
                  },
                ]}
                onChange={(e) => setAllowsInstallment(e.target.value === 'Sim')}
              />
            </div>

            <div>
              <SelectNoComplete
                p="0px 0px 0px 0.5rem"
                title="Forma de Pagamento *"
                value={data.forma_pagamento}
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
                value={data.tipo_pagamento}
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
              defaultValue={data.ano_anuidade}
              onChange={(e) => setValue('year', e.target.value)}
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
                    defaultValue={
                      data.data_pagto_parcela_1?.dia
                        ? data.data_pagto_parcela_1.dia
                        : ''
                    }
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
                    defaultValue={
                      data.data_pagto_parcela_1?.mes
                        ? data.data_pagto_parcela_1.mes
                        : ''
                    }
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
                    defaultValue={
                      data.data_pagto_parcela_1?.ano
                        ? data.data_pagto_parcela_1.ano
                        : ''
                    }
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
                  defaultValue={maskMoney(data.valor_pagto_parcela_1)}
                  value={watch('firstInstallmentValue')}
                  error={!!errors.firstInstallmentValue}
                  helperText={
                    errors.firstInstallmentValue
                      ? errors.firstInstallmentValue.message
                      : ''
                  }
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
                    defaultValue={
                      data.data_pagto_parcela_2?.dia
                        ? data.data_pagto_parcela_2.dia
                        : ''
                    }
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
                    defaultValue={
                      data.data_pagto_parcela_2?.mes
                        ? data.data_pagto_parcela_2.mes
                        : ''
                    }
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
                    defaultValue={
                      data.data_pagto_parcela_3?.ano
                        ? data.data_pagto_parcela_3.ano
                        : ''
                    }
                    {...register('secondInstallmentYear')}
                  />
                </ContentDate>

                <NewTextInput
                  id="secondInstallment"
                  isMoney
                  disabled
                  maskFunction={maskMoney}
                  label="Valor de Pagamento 2ª Parcela"
                  defaultValue={maskMoney(data.valor_pagto_parcela_2)}
                  value={watch('secondInstallmentValue')}
                  error={!!errors.secondInstallmentValue}
                  helperText={
                    errors.secondInstallmentValue
                      ? errors.secondInstallmentValue.message
                      : ''
                  }
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
                    defaultValue={
                      data.data_pagto_parcela_3?.dia
                        ? data.data_pagto_parcela_3.dia
                        : ''
                    }
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
                    defaultValue={
                      data.data_pagto_parcela_3?.mes
                        ? data.data_pagto_parcela_3.mes
                        : ''
                    }
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
                    defaultValue={
                      data.data_pagto_parcela_3?.ano
                        ? data.data_pagto_parcela_3.ano
                        : ''
                    }
                    {...register('thirdInstallmentYear')}
                  />
                </ContentDate>

                <NewTextInput
                  id="thirdInstallment"
                  isMoney
                  disabled
                  maskFunction={maskMoney}
                  label="Valor de Pagamento 3ª Parcela"
                  defaultValue={maskMoney(data.valor_pagto_parcela_3)}
                  value={watch('thirdInstallmentValue')}
                />
              </Box>
            </>
          ) : (
            <Box>
              <ContentDate>
                <Text>Data Pagamento parcela única</Text>

                <NewSelectOptions
                  containerSx={{ width: 90 }}
                  label="Dia"
                  options={useArrayDate.Dia().map((month) => ({
                    label: month.label,
                    value: month.label,
                  }))}
                  hasNullValue
                  defaultValue={
                    data.data_pagto_unico?.dia ? data.data_pagto_unico.dia : ''
                  }
                  {...register('uniqueInstallmentDay')}
                  error={!!errors.uniqueInstallmentDay}
                  helperText={
                    errors.uniqueInstallmentDay ? 'Campo Obrigatório' : ''
                  }
                />

                <NewSelectOptions
                  containerSx={{ width: 90 }}
                  label="Mês"
                  options={useArrayDate.Mes().map((month) => ({
                    label: month.label,
                    value: month.label,
                  }))}
                  hasNullValue
                  defaultValue={
                    data.data_pagto_unico?.mes ? data.data_pagto_unico.mes : ''
                  }
                  {...register('uniqueInstallmentMonth')}
                  error={!!errors.uniqueInstallmentMonth}
                  helperText={
                    errors.uniqueInstallmentMonth ? 'Campo Obrigatório' : ''
                  }
                />

                <NewSelectOptions
                  containerSx={{ width: 90 }}
                  label="Ano"
                  options={useArrayDate.AnoAtualAnteriores().map((month) => ({
                    label: month.label,
                    value: month.label,
                  }))}
                  hasNullValue
                  defaultValue={
                    data.data_pagto_unico?.ano ? data.data_pagto_unico.ano : ''
                  }
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
                defaultValue={data.data_pagto_unico}
                value={watch('uniqueInstallmentValue')}
                error={!!errors.uniqueInstallmentValue}
                helperText={
                  errors.uniqueInstallmentValue
                    ? errors.uniqueInstallmentValue.message
                    : ''
                }
              />
            </Box>
          )}

          {/* <Box>
            <ContentDate>
              <Text>Data Pagamento 1ª parcela</Text>

              <SelectOptions
                w={90}
                description="dia"
                disableClearable={false}
                data={useArrayDate.Dia()}
                defaultValue={{
                  label: data.data_pagto_parcela_1?.dia
                    ? data.data_pagto_parcela_1.dia
                    : '',
                }}
                {...register('dayPagtoParc1')}
              />

              <SelectOptions
                w={90}
                description="mês"
                disableClearable={false}
                data={useArrayDate.Mes()}
                defaultValue={{
                  label: data.data_pagto_parcela_1?.mes
                    ? data.data_pagto_parcela_1.mes
                    : '',
                }}
                {...register('monthPagtoParc1')}
              />

              <SelectOptions
                w={120}
                description="ano"
                disableClearable={false}
                data={useArrayDate.AnoAtualAnteriores()}
                defaultValue={{
                  label: data.data_pagto_parcela_1?.ano
                    ? data.data_pagto_parcela_1.ano
                    : '',
                }}
                {...register('yearPagtoParc1')}
              />
            </ContentDate>

            <TextInput
              w={180}
              textAlign="right"
              formatFunction={maskMoney}
              title="Valor Pagamento 1ª parcela"
              {...register('valor_pagto_parcela_1')}
            />
          </Box>

          <Box>
            <ContentDate>
              <Text>Data Pagamento 2ª parcela</Text>

              <SelectOptions
                w={90}
                description="dia"
                disableClearable={false}
                data={useArrayDate.Dia()}
                defaultValue={{
                  label: data.data_pagto_parcela_2?.dia
                    ? data.data_pagto_parcela_2.dia
                    : '',
                }}
                {...register('dayPagtoParc2')}
              />

              <SelectOptions
                w={90}
                description="mês"
                disableClearable={false}
                data={useArrayDate.Mes()}
                defaultValue={{
                  label: data.data_pagto_parcela_2?.mes
                    ? data.data_pagto_parcela_2.mes
                    : '',
                }}
                {...register('monthPagtoParc2')}
              />

              <SelectOptions
                w={120}
                description="ano"
                disableClearable={false}
                data={useArrayDate.AnoAtualAnteriores()}
                defaultValue={{
                  label: data.data_pagto_parcela_2?.ano
                    ? data.data_pagto_parcela_2.ano
                    : '',
                }}
                {...register('yearPagtoParc2')}
              />
            </ContentDate>

            <TextInput
              w={180}
              textAlign="right"
              formatFunction={maskMoney}
              title="Valor Pagamento 2ª parcela"
              {...register('valor_pagto_parcela_2')}
            />
          </Box>

          <Box>
            <ContentDate>
              <Text>Data Pagamento 3ª parcela</Text>

              <SelectOptions
                w={90}
                description="dia"
                disableClearable={false}
                data={useArrayDate.Dia()}
                defaultValue={{
                  label: data.data_pagto_parcela_3?.dia
                    ? data.data_pagto_parcela_3.dia
                    : '',
                }}
                {...register('dayPagtoParc3')}
              />

              <SelectOptions
                w={90}
                description="mês"
                disableClearable={false}
                data={useArrayDate.Mes()}
                defaultValue={{
                  label: data.data_pagto_parcela_3?.mes
                    ? data.data_pagto_parcela_3.mes
                    : '',
                }}
                {...register('monthPagtoParc3')}
              />

              <SelectOptions
                w={120}
                description="ano"
                disableClearable={false}
                data={useArrayDate.AnoAtualAnteriores()}
                defaultValue={{
                  label: data.data_pagto_parcela_3?.ano
                    ? data.data_pagto_parcela_3.ano
                    : '',
                }}
                {...register('yearPagtoParc3')}
              />
            </ContentDate>

            <TextInput
              w={180}
              textAlign="right"
              formatFunction={maskMoney}
              title="Valor Pagamento 3ª parcela"
              {...register('valor_pagto_parcela_3')}
            />
          </Box> */}

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const pagamento = await prisma.pagamentos.findFirst({
      where: {
        id: Number(id),
      },
    })
    const associado = await prisma.associados.findFirst({
      select: {
        nome_completo: true,
        categoria: true,
      },
      where: {
        matricula_SAERJ: parseInt(pagamento?.matricula_saerj || '0'),
      },
    })
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

    if (pagamento) {
      const data: Props['data'] = {
        id: pagamento?.id,
        matricula_saerj: pagamento.matricula_saerj,
        tipo_pagamento: pagamento.tipo_pagamento,
        forma_pagamento: pagamento.forma_pagamento,
        ano_anuidade: pagamento.ano_anuidade,
        data_processamento: pagamento.data_processamento
          ? useArrayDate.DesestruturarDate(pagamento.data_processamento)
          : null,

        data_pagto_unico: pagamento.data_pagto_unico
          ? useArrayDate.DesestruturarDate(pagamento.data_pagto_unico)
          : null,
        valor_pagto_unico: pagamento.valor_pagto_unico
          ? pagamento.valor_pagto_unico.toString()
          : '',

        data_pagto_parcela_1: pagamento.data_pagto_parcela_1
          ? useArrayDate.DesestruturarDate(pagamento.data_pagto_parcela_1)
          : null,
        valor_pagto_parcela_1: pagamento.valor_pagto_parcela_1
          ? pagamento.valor_pagto_parcela_1.toString()
          : '',

        data_pagto_parcela_2: pagamento.data_pagto_parcela_2
          ? useArrayDate.DesestruturarDate(pagamento.data_pagto_parcela_2)
          : null,
        valor_pagto_parcela_2: pagamento.valor_pagto_parcela_2
          ? pagamento.valor_pagto_parcela_2.toString()
          : '',

        data_pagto_parcela_3: pagamento.data_pagto_parcela_3
          ? useArrayDate.DesestruturarDate(pagamento.data_pagto_parcela_3)
          : null,
        valor_pagto_parcela_3: pagamento.valor_pagto_parcela_3
          ? pagamento.valor_pagto_parcela_3.toString()
          : '',
      }

      const formasPagamentosIndex = formasPagamentos.findIndex(
        (item) => item.ocorrencia_tabela === data.forma_pagamento,
      )
      if (formasPagamentosIndex >= 0) {
        formasPagamentos.splice(formasPagamentosIndex, 1)
      }

      const tiposPagamentosIndex = tiposPagamentos.findIndex(
        (item) => item.ocorrencia_tabela === data.tipo_pagamento,
      )
      if (tiposPagamentosIndex >= 0) {
        tiposPagamentos.splice(tiposPagamentosIndex, 1)
      }

      return {
        props: {
          data,
          associado,
          tiposPagamentos,
          formasPagamentos,
        },
      }
    }

    return {
      props: {
        data: [],
        associado,
        tiposPagamentos: [],
        formasPagamentos: [],
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)

    return {
      props: {
        data: [],
        associado: undefined,
        tiposPagamentos: [],
        formasPagamentos: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
