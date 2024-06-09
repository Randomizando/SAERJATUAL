import { Container, Box, Text } from './styled'
import React, { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next/types'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { SelectOptions } from '@/components/SelectOptions'
import { Typography } from '@mui/material'
import { isDateInvalid } from '@/utils/isDateValid'

// array dias
const days = Array.from({ length: 31 }, (_, index) => ({
  label: (index + 1).toString(),
}))

const dataDays = days.map((item) => item)

// array mes
const months = Array.from({ length: 12 }, (_, index) => ({
  label: (index + 1).toString(),
}))

const dataMonths = months.map((item) => item)

// array anos
const yearCurrent = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, index) =>
  (yearCurrent + index).toString(),
)

const dataYears = years.map((year) => {
  return {
    label: year,
  }
})

const integranteSchema = z.object({
  nome_chapa: z.string(),
})

// const schemaChapaForm = z.object({
//   matricula_saerj: z
//     .string()
//     .min(1, { message: 'O campo nome da chapa é obrigatório' }),
//   chapas: z.array(integranteSchema).nonempty(),
//   start_day: z.string().min(1, { message: 'O campo dia é obrigatório' }),
//   start_month: z.string().min(1, { message: 'O campo mês é obrigatório' }),
//   start_year: z.string().min(1, { message: 'O campo ano é obrigatório' }),
//   end_day: z.string().min(1, { message: 'O campo dia é obrigatório' }),
//   end_month: z.string().min(1, { message: 'O campo mês é obrigatório' }),
//   end_year: z.string().min(1, { message: 'O campo ano é obrigatório' }),
//   status: z.string().min(1, { message: 'O campo status é obrigatório' }),
// })

const schemaEleicaoForm = z.object({
  numero_eleicao: z
    .string()
    .min(1, { message: 'O número da eleição deve ser obrigatório' }),

  titulo_eleicao: z
    .string()
    .min(1, { message: 'O titulo da eleição deve ser obrigatório.' }),

  start_day: z.string().min(1, { message: 'O campo dia é obrigatório' }),
  start_month: z.string().min(1, { message: 'O campo mês é obrigatório' }),
  start_year: z.string().min(1, { message: 'O campo ano é obrigatório' }),
  end_day: z.string().min(1, { message: 'O campo dia é obrigatório' }),
  end_month: z.string().min(1, { message: 'O campo mês é obrigatório' }),
  end_year: z.string().min(1, { message: 'O campo ano é obrigatório' }),

  chapas: z.array(integranteSchema),

  mandato_start_day: z
    .string()
    .min(1, { message: 'O campo dia inicio mandato é obrigatório' }),
  mandato_start_month: z
    .string()
    .min(1, { message: 'O campo mês inicio mandato é obrigatório' }),
  mandato_start_year: z
    .string()
    .min(1, { message: 'O campo ano inicio mandato é obrigatório' }),
  mandato_end_day: z
    .string()
    .min(1, { message: 'O campo dia fim mandato é obrigatório' }),
  mandato_end_month: z
    .string()
    .min(1, { message: 'O campo mês fim mandato é obrigatório' }),
  mandato_end_year: z
    .string()
    .min(1, { message: 'O campo ano fim mandato é obrigatório' }),
  status: z.string().min(1, { message: '' }),
})

type SchemaChapaForm = z.infer<typeof schemaEleicaoForm>

export default function VotacaoAtualizar({ data, chapas }: any) {
  // console.log(data)
  // console.log(chapas)

  // Config Datas inicio e Fim Eleicao
  const newDate = new Date(data.votacao_inicio)
  const diaEleicaoInicio = String(newDate.getDate())
  const diaEleicaoIncio = String(newDate.getMonth() + 1)
  const anoEleicaoInicio = String(newDate.getFullYear())

  const endDataEleicao = new Date(data.votacao_fim)
  const diaEleicaoFim = String(endDataEleicao.getDate())
  const mesEleicaoFim = String(endDataEleicao.getMonth() + 1)
  const anoEleicaoFim = String(endDataEleicao.getFullYear())

  // Config Datas Inicio e Fim Mandato
  const getDateMandatoStart = new Date(data.mandato_inicio)
  const diaMandatoInicio = String(getDateMandatoStart.getDate())
  const mesMandatoInicio = String(getDateMandatoStart.getMonth() + 1)
  const anoMandatoInicio = String(getDateMandatoStart.getFullYear())

  const getDateMandatoEnd = new Date(data.mandato_fim)
  const diaMandatoFim = String(getDateMandatoEnd.getDate())
  const mesMandatoFim = String(getDateMandatoEnd.getMonth() + 1)
  const anoMandatoFim = String(getDateMandatoEnd.getFullYear())

  const router = useRouter()
  const { id }: any = router.query

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    setValue,
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaEleicaoForm),
  })

  async function handleOnSubmit(data: SchemaChapaForm) {
    const votacaoDateStart = `${data.start_month}-${data.start_day}-${data.start_year}`
    const newDate = new Date(votacaoDateStart).toISOString()

    const votacaoDateEnd = `${data.end_month}-${data.end_day}-${data.end_year}`
    const newDateEnd = new Date(votacaoDateEnd).toISOString()

    const mandatoDateStart = `${data.mandato_start_month}-${data.mandato_start_day}-${data.mandato_start_year}`
    const newDateStartMandato = new Date(mandatoDateStart).toISOString()

    const mandatoDateEnd = `${data.mandato_end_month}-${data.mandato_end_day}-${data.mandato_end_year}`
    const newDateEndMandato = new Date(mandatoDateEnd).toISOString()

    const today = new Date().toISOString().slice(0, 10)
    const inputDate = newDate.slice(0, 10)

    const selectedChapas = data.chapas
      .map((chapa) => {
        const chapaSelected = chapas.find(
          (item: any) => item.nome_chapa === chapa.nome_chapa,
        )
        return chapaSelected
      })
      .filter((e) => e) // Remove todos os undefined e null

    if (new Set(selectedChapas).size !== selectedChapas.length) {
      return toast.error('Chapas duplicadas!')
    }

    if (newDate > newDateEnd) {
      return toast.error(
        'A data de início da votação não pode ser maior que a data de fim da votação!',
      )
    }

    if (newDate === newDateEnd) {
      return toast.error(
        'A data de início da votação não pode ser igual a data de fim da votação!',
      )
    }

    if (inputDate < today) {
      return toast.error(
        'A data de início da votação não pode ser menor que a data atual!',
      )
    }

    if (newDateStartMandato > newDateEndMandato) {
      return toast.error(
        'A data de início do mandato não pode ser maior que a data de fim do mandato!',
      )
    }

    if (newDateStartMandato === newDateEndMandato) {
      return toast.error(
        'A data de início do mandato não pode ser igual a data de fim do mandato!',
      )
    }

    if (isDateInvalid(+data.start_month, +data.start_day, +data.start_year)) {
      return toast.error('A data início da votação está inválida!')
    }

    if (isDateInvalid(+data.end_month, +data.end_day, +data.end_year)) {
      return toast.error('A data fim da votação está inválida!')
    }

    if (
      isDateInvalid(
        +data.mandato_start_month,
        +data.mandato_start_day,
        +data.mandato_start_year,
      )
    ) {
      return toast.error('A data início do mandato está inválida!')
    }

    if (
      isDateInvalid(
        +data.mandato_end_month,
        +data.mandato_end_day,
        +data.mandato_end_year,
      )
    ) {
      return toast.error('A data fim do mandato está inválida!')
    }

    const body = {
      id: Number(id),
      numero_eleicao: data.numero_eleicao,
      titulo_eleicao: data.titulo_eleicao,
      votacao_inicio: newDate,
      votacao_fim: newDateEnd,
      mandato_inicio: newDateStartMandato,
      mandato_fim: newDateEndMandato,
      chapas: selectedChapas,
      status: data.status,
    }

    await api.put('/eleicao/update', body)

    router.push('/eleicao/lista')
    return toast.success('Operação concluída com sucesso!')
  }

  const { fields, append, remove } = useFieldArray({
    name: 'chapas',
    control,
  })

  /*
    Não entendi porque a variavel fields não está trazendo as chapas quando o componente é renderizado.
    Tive que criar o useEffect abaixo para usar o append() para adicionar as chapas na renderização do componente. Como o componente esta renderizando 4 vezes (nao sei porq e nao fui atras do porque), tive que evitar esse problema removendo as chapas quando o componente é desmontado.
  */
  useEffect(() => {
    append(data.chapas)
    return () => {
      remove(data.chapas)
    }
  }, [data.chapas, append])

  useEffect(() => {
    if (data) {
      setValue('numero_eleicao', data.numero_eleicao)
      setValue('titulo_eleicao', data.titulo_eleicao)
      setValue('status', data.status)

      setValue('start_day', diaEleicaoInicio)
      setValue('start_month', diaEleicaoIncio)
      setValue('start_year', anoEleicaoInicio)
      setValue('end_day', diaEleicaoFim)
      setValue('end_month', mesEleicaoFim)
      setValue('end_year', anoEleicaoFim)

      setValue('mandato_start_day', diaMandatoInicio)
      setValue('mandato_start_month', mesMandatoInicio)
      setValue('mandato_start_year', anoMandatoInicio)
      setValue('mandato_end_day', diaMandatoFim)
      setValue('mandato_end_month', mesMandatoFim)
      setValue('mandato_end_year', anoMandatoFim)
    }
  }, [data, setValue])

  // useEffect(() => {
  //   if (errors.chapas) {
  //     toast.error("A votação precisa ter no mínimo 2 chapas!");
  //   }
  // }, [errors]);

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box style={{ justifyContent: 'end' }}>
          <Link
            href="/eleicao/lista"
            style={{
              textDecoration: 'none',
              fontFamily: 'Roboto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: '#000',
            }}
          >
            <ArrowBendDownLeft size={32} />
            Retornar
          </Link>
        </Box>
        <fieldset>
          <legend>
            <span>
              <Link href={'/eleicao/lista'}>Eleição</Link>
            </span>
            <CaretRight size={14} />
            <span>Ver/Atualizar</span>
          </legend>

          <Box>
            <div style={{ width: '24rem' }}>
              <TextInput
                title="Título eleição *"
                {...register('titulo_eleicao')}
                error={errors.titulo_eleicao?.message}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '24rem' }}>
              <Text>Data Início Eleição *</Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                defaultValue={diaEleicaoInicio}
                w={90}
                {...register('start_day')}
                error={errors.start_day?.message}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                defaultValue={diaEleicaoIncio}
                w={90}
                {...register('start_month')}
                error={errors.start_month?.message}
              />

              <SelectOptions
                w={120}
                description="Ano"
                defaultValue={anoEleicaoInicio}
                data={dataYears}
                {...register('start_year')}
                error={errors.start_year?.message}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '24rem' }}>
              <Text>Data Término Eleição *</Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                defaultValue={diaEleicaoFim}
                w={90}
                {...register('end_day')}
                error={errors.end_day?.message}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                defaultValue={mesEleicaoFim}
                w={90}
                {...register('end_month')}
                error={errors.end_month?.message}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                defaultValue={anoEleicaoFim}
                {...register('end_year')}
                error={errors.end_year?.message}
              />
            </div>

            <SelectOptions
              description="Está ativa?"
              data={['ATIVA', 'INATIVA']}
              w={160}
              defaultValue={data.status}
              {...register('status')}
              error={errors.status?.message}
            />
          </Box>

          <Box>
            <div style={{ display: 'flex', alignItems: 'end', width: '24rem' }}>
              <Text>Início mandato Diretoria *</Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                defaultValue={diaMandatoInicio}
                w={90}
                {...register('mandato_start_day')}
                error={errors.mandato_start_day?.message}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                defaultValue={mesMandatoInicio}
                w={90}
                {...register('mandato_start_month')}
                error={errors.mandato_start_month?.message}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                defaultValue={anoMandatoInicio}
                {...register('mandato_start_year')}
                error={errors.mandato_start_year?.message}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '24rem' }}>
              <Text>Fim mandato Diretoria *</Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                defaultValue={diaMandatoFim}
                w={90}
                {...register('mandato_end_day')}
                error={errors.mandato_end_day?.message}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                defaultValue={mesMandatoFim}
                w={90}
                {...register('mandato_end_month')}
                error={errors.mandato_end_month?.message}
              />

              <SelectOptions
                w={120}
                description="Ano"
                defaultValue={anoMandatoFim}
                data={dataYears}
                {...register('mandato_end_year')}
                error={errors.mandato_end_year?.message}
              />
            </div>
            <div style={{ width: '24rem' }}>
              <TextInput
                title="Número eleição *"
                {...register('numero_eleicao')}
                error={errors.numero_eleicao?.message}
              />
            </div>
          </Box>

          {/* <Box>
            <Typography variant="h6" component="div">
              Chapas
            </Typography>

            <Button
              onClick={() => append({ nome_chapa: '' })}
              type="button"
              title="+ Adicionar"
              style={{ margin: '0px', width: '100%', fontSize: '12px' }}
            />
          </Box>

          {fields.map((membro: any, index: any) => (
            <Box key={index}>
              <SelectOptions
                description="Selecione a chapa"
                data={chapas.map((chapa: any) => chapa.nome_chapa)}
                w={280}
                defaultValue={membro.nome_chapa}
                {...register(`chapas.${index}.nome_chapa` as const)}
                error={errors.chapas?.[index]?.nome_chapa?.message}
              />
              <Button
                onClick={() => remove(index)}
                type="button"
                title="Remover chapa"
                style={{ margin: '0px', width: '100%', fontSize: '12px' }}
              />
            </Box>
          ))} */}

          <Button
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            disabled={isSubmitting}
            type="submit"
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const response = await prisma.eleicoes.findFirst({
      where: {
        id: Number(id),
      },
    })

    const data = {
      id: response?.id,
      numero_eleicao: response?.numero_eleicao,
      titulo_eleicao: response?.titulo_eleicao,
      votacao_inicio: response?.votacao_inicio.toString(),
      votacao_fim: response?.votacao_fim.toString(),
      mandato_inicio: response?.mandato_inicio.toString(),
      mandato_fim: response?.mandato_fim.toString(),
      chapas: response?.chapas,
      status: response?.status.toString(),
    }

    const chapas = await prisma.chapas.findMany()

    return {
      props: {
        data,
        chapas,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        data: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
