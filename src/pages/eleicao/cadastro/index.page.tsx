import { Container, Box, Text } from './styled'
import React, { useState } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Typography } from '@mui/material'
import { SelectOptions } from '@/components/SelectOptions'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
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
  nome_chapa: z.string().min(1, { message: 'O campo nome é obrigatório' }),
})

function createDynamicChapaIdSchema(count: number) {
  const schema: Record<string, z.ZodNumber> = {}
  for (let i = 1; i <= count; i++) {
    schema[`chapa_id_${i}`] = z
      .number()
      .min(1, { message: `ID da chapa ${i} é obrigatório` })
  }
  return schema as z.ZodRawShape
}

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
    .min(1, { message: 'O campo dia é obrigatório' }),
  mandato_start_month: z
    .string()
    .min(1, { message: 'O campo mês é obrigatório' }),
  mandato_start_year: z
    .string()
    .min(1, { message: 'O campo ano é obrigatório' }),
  mandato_end_day: z.string().min(1, { message: 'O campo dia é obrigatório' }),
  mandato_end_month: z
    .string()
    .min(1, { message: 'O campo mês é obrigatório' }),
  mandato_end_year: z.string().min(1, { message: 'O campo ano é obrigatório' }),

  ...createDynamicChapaIdSchema(20),
})

type SchemaChapaForm = z.infer<typeof schemaEleicaoForm>

export default function VotacaoCreate({ chapas }: any) {
  const router = useRouter()
  const [selects, setSelects] = useState([{ id: 0 }])
  const addSelect = () => {
    setSelects([...selects, { id: selects.length }])
  }

  const removeSelect = (id: number) => {
    setSelects(selects.filter((select) => select.id !== id))
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaEleicaoForm),
  })

  async function handleOnSubmit(data: SchemaChapaForm) {
    console.log(data)
    const dateNow = new Date().toISOString()

    const votacaoDateStart = `${data.start_month}-${data.start_day}-${data.start_year}`
    const newDate = new Date(votacaoDateStart).toISOString()

    const votacaoDateEnd = `${data.end_month}-${data.end_day}-${data.end_year}`
    const newDateEnd = new Date(votacaoDateEnd).toISOString()

    const mandatoDateStart = `${data.mandato_start_month}-${data.mandato_start_day}-${data.mandato_start_year}`
    const newDateStartMandato = new Date(mandatoDateStart).toISOString()

    const mandatoDateEnd = `${data.mandato_end_month}-${data.mandato_end_day}-${data.mandato_end_year}`
    const newDateEndMandato = new Date(mandatoDateEnd).toISOString()

    const today = new Date().toISOString().slice(0, 10)

    if (newDate < today) {
      return toast.error(
        'A data de início da votação não pode ser menor que a data atual!',
      )
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

    const selectedChapas = data.chapas.map((chapa: any) => {
      const chapaSelected = chapas.find(
        (item: any) => item.nome_chapa === chapa.nome_chapa,
      )
      return chapaSelected
    })

    if (new Set(selectedChapas).size !== selectedChapas.length) {
      return toast.error('Chapas duplicadas!')
    }

    const body = {
      numero_eleicao: data.numero_eleicao,
      titulo_eleicao: data.titulo_eleicao,
      votacao_inicio: newDate,
      votacao_fim: newDateEnd,
      mandato_inicio: newDateStartMandato,
      mandato_fim: newDateEndMandato,
      chapas: data.chapas,
      status: newDate < dateNow && dateNow < newDateEnd ? 'ATIVA' : 'INATIVA',
    }

    await api.post('/eleicao/cadastro', body)

    router.push('/eleicao/lista')
    return toast.success('Operação concluída com sucesso!')
  }

  const { fields, append, remove } = useFieldArray({
    name: 'chapas',
    control,
  })

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
            <span>Incluir</span>
          </legend>
          <Box>
            <div style={{ width: '28rem' }}>
              <TextInput
                title="Título eleição *"
                {...register('titulo_eleicao')}
                error={errors.titulo_eleicao?.message}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '28rem' }}>
              <Text>Início da votação *</Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('start_day')}
                error={errors.start_day?.message}
                helperText={errors.start_day?.message}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={90}
                {...register('start_month')}
                error={errors.start_month?.message}
                helperText={errors.start_month?.message}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                {...register('start_year')}
                error={errors.start_year?.message}
                helperText={errors.start_year?.message}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '28rem' }}>
              <Text>Fim da votação *</Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('end_day')}
                error={errors.end_day?.message}
                helperText={errors.end_day?.message}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={90}
                {...register('end_month')}
                error={errors.end_month?.message}
                helperText={errors.end_month?.message}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                {...register('end_year')}
                error={errors.end_year?.message}
                helperText={errors.end_year?.message}
              />
            </div>
          </Box>

          <Box>
            <div style={{ display: 'flex', alignItems: 'end', width: '28rem' }}>
              <Text>Início mandato Diretoria *</Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('mandato_start_day')}
                error={errors.mandato_start_day?.message}
                helperText={errors.mandato_start_day?.message}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={90}
                {...register('mandato_start_month')}
                error={errors.mandato_start_month?.message}
                helperText={errors.mandato_start_month?.message}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                {...register('mandato_start_year')}
                error={errors.mandato_start_year?.message}
                helperText={errors.mandato_start_year?.message}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '28rem' }}>
              <Text>Fim mandato Diretoria *</Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('mandato_end_day')}
                error={errors.mandato_end_day?.message}
                helperText={errors.mandato_end_day?.message}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={90}
                {...register('mandato_end_month')}
                error={errors.mandato_end_month?.message}
                helperText={errors.mandato_end_month?.message}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                {...register('mandato_end_year')}
                error={errors.mandato_end_year?.message}
                helperText={errors.mandato_end_year?.message}
              />
            </div>
            <div style={{ width: '28rem' }}>
              <TextInput
                title="Número eleição *"
                {...register('numero_eleicao')}
                error={errors.numero_eleicao?.message}
              />
            </div>
          </Box>

          <Box>
            <Typography variant="h6" component="div">
              Adicionar chapas na eleição
            </Typography>

            <Button
              onClick={() => append({ nome_chapa: '' })}
              type="button"
              title="+ Adicionar"
              style={{ margin: '0px', width: '100%', fontSize: '12px' }}
            />
          </Box>

          {fields.map((membro, index) => (
            <Box key={index}>
              <SelectOptions
                description="Selecione a chapa"
                data={chapas.map((chapa: any) => chapa.nome_chapa)}
                w={280}
                {...register(`chapas.${index}.nome_chapa` as const)}
                error={errors.chapas?.[index]?.nome_chapa?.message}
                helperText={errors.chapas?.[index]?.nome_chapa?.message}
              />
              <Button
                onClick={() => remove(index)}
                type="button"
                title="Remover chapa"
                style={{ margin: '0px', width: '100%', fontSize: '12px' }}
              />
            </Box>
          ))}

          <Box style={{ justifyContent: 'space-between' }}>
            <Button
              type="button"
              title="Adicionar Chapa"
              onClick={addSelect}
              disabled={isSubmitting}
            />
          </Box>

          <Box style={{ flexWrap: 'wrap' }}>
            {selects.map((select, index) => (
              <div
                key={select.id}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <SelectOptions
                  w={200}
                  style={{ flex: 1 }}
                  description={`Incluir Chapa ${index + 1}`}
                  data={chapas.map((chapa: any) => chapa.nome_chapa)}
                  {...register(`chapas.${index}.nome_chapa` as const)}
                />
                <Button
                  type="button"
                  title="Remover"
                  onClick={() => removeSelect(select.id)}
                  disabled={isSubmitting}
                  style={{ marginLeft: '8px' }}
                />
              </div>
            ))}
          </Box>
          <Button
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            type="submit"
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await prisma.chapas.findMany({
      select: {
        id: true,
        nome_chapa: true,
      },
    })

    const chapas = response.map((item: { nome_chapa: string; id: number }) => {
      return {
        label: item.nome_chapa,
        id: item.id,
      }
    })

    return {
      props: {
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
