import Link from 'next/link'
import { Box, Container, Text } from './styled'
import { CaretRight } from 'phosphor-react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { SelectOptions } from '@/components/SelectOptions'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'

const schemaChapaForm = z.object({
  numero_eleicao: z.number().min(1, 'Informe o número da eleição'),
  titulo_eleicao: z.string().min(1, 'Informe o nome da eleição'),
  day: z.date(),
  month: z.date(),
  year: z.date(),
  dayInicioVotacao: z.date(),
  monthInicioVotacao: z.date(),
  yearInicioVotacao: z.date(),
  dayFimVotacao: z.date(),
  monthFimVotacao: z.date(),
  yearFimVotacao: z.date(),
  dayInicioMandato: z.date(),
  monthInicioMandato: z.date(),
  yearInicioMandato: z.date(),
  dayFimMandato: z.date(),
  monthFimMandato: z.date(),
  yearFimMandato: z.date(),
})

type SchemaChapaForm = z.infer<typeof schemaChapaForm>

export default function Atualizar({ data }: any) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaChapaForm),
    defaultValues: {
      numero_eleicao: data.numero_eleicao ? data.numero_eleicao : 0,
      titulo_eleicao: data.titulo_eleicao ? data.titulo_eleicao : '',
    },
  })

  async function handleOnSubmit(data: SchemaChapaForm) {
    console.log(data)
  }

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

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <fieldset>
          <legend>
            <span>
              <Link href={'/tabelas'}>Tabelas</Link>
            </span>
            <CaretRight size={14} />
            <Link href={'/tabelas/eleicoes'}>Eleicoes</Link>
            <CaretRight size={14} />
            <span>Ver/Atualizar</span>
          </legend>

          <Box>
            <TextInput
              title="Numero da Eleição"
              type="number"
              messageError={errors.numero_eleicao?.message}
              {...register('numero_eleicao', {
                valueAsNumber: true,
              })}
            />
            <TextInput
              title="Titulo da Eleição"
              w="20rem"
              {...register('titulo_eleicao')}
              messageError={errors.titulo_eleicao?.message}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '32rem',
                flex: 1,
              }}
            >
              <Text>Data/Hora Inicio da votação:</Text>
              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('day')}
              />
              <SelectOptions
                description="Mes"
                data={dataMonths}
                w={90}
                {...register('month')}
              />
              <SelectOptions
                description="Ano"
                data={dataYears}
                w={90}
                {...register('year')}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '32rem',
                flex: 1,
              }}
            >
              <Text>Data/Hora Fim da Votação:</Text>
              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('dayFimVotacao')}
              />
              <SelectOptions
                description="Mes"
                data={dataMonths}
                w={90}
                {...register('monthFimVotacao')}
              />
              <SelectOptions
                description="Ano"
                data={dataYears}
                w={90}
                {...register('yearFimVotacao')}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '32rem',
                flex: 1,
              }}
            >
              <Text>Data/Hora Inicio do Mandato:</Text>
              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('dayInicioMandato')}
              />
              <SelectOptions
                description="Mes"
                data={dataMonths}
                w={90}
                {...register('monthInicioMandato')}
              />
              <SelectOptions
                description="Ano"
                data={dataYears}
                w={90}
                {...register('yearInicioMandato')}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '32rem',
                flex: 1,
              }}
            >
              <Text>Data do fim do Mandato:</Text>
              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('dayFimMandato')}
              />
              <SelectOptions
                description="Mes"
                data={dataMonths}
                w={90}
                {...register('monthFimMandato')}
              />
              <SelectOptions
                description="Ano"
                data={dataYears}
                w={90}
                {...register('yearFimMandato')}
              />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const response = await prisma.eleicoes.findFirst({
      where: {
        numero_eleicao: Number(id),
      },
    })

    if (response) {
      const data = {
        ...response,
        votacao_inicio: response.votacao_inicio.toString(),
        votacao_fim: response.votacao_fim.toString(),
        mandato_inicio: response.mandato_inicio.toString(),
        mandato_fim: response.mandato_fim.toString(),
      }
      return {
        props: {
          data,
        },
      }
    } else {
      return {
        props: {
          data: [],
        },
      }
    }
  } catch (error) {
    return {
      props: {
        data: [],
      },
    }
  }
}
