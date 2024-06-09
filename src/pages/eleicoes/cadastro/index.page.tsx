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
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'

const schemaChapaForm = z.object({
  numero_eleicao: z.number().min(1, 'Informe o número da eleição'),
  titulo_eleicao: z.string().min(1, 'Informe o nome da eleição'),

  dayInicioVotacao: z.string(),
  monthInicioVotacao: z.string(),
  yearInicioVotacao: z.string(),
  dayFimVotacao: z.string(),
  monthFimVotacao: z.string(),
  yearFimVotacao: z.string(),
  dayInicioMandato: z.string(),
  monthInicioMandato: z.string(),
  yearInicioMandato: z.string(),
  dayFimMandato: z.string(),
  monthFimMandato: z.string(),
  yearFimMandato: z.string(),
})

type SchemaChapaForm = z.infer<typeof schemaChapaForm>

export default function Cadastro() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaChapaForm),
    defaultValues: {
      numero_eleicao: 0,
      titulo_eleicao: '',
    },
  })

  async function handleOnSubmit(data: SchemaChapaForm) {
    const votacaoInicioConcat = `${data.yearInicioVotacao}-${data.monthInicioVotacao}-${data.dayInicioVotacao} `
    const votacaoInicio: Date = new Date(votacaoInicioConcat)

    const votacaoFimConcat = `${data.yearFimVotacao}-${data.monthFimVotacao}-${data.dayFimVotacao}`
    const votacaoFim: Date = new Date(votacaoFimConcat)

    const mandatoInicioConcat = `${data.yearInicioMandato}-${data.monthInicioMandato}-${data.dayInicioMandato} `
    const mandatoInicio: Date = new Date(mandatoInicioConcat)

    const mandatoFimConcat = `${data.yearFimMandato}-${data.monthFimMandato}-${data.dayFimMandato}`
    const mandatoFim: Date = new Date(mandatoFimConcat)

    if (votacaoInicio > votacaoFim) {
      return toast.error(
        'A data de inicio da votação deve ser anterior a data fim ',
      )
    } else if (votacaoInicio > mandatoInicio || votacaoFim > mandatoInicio) {
      return toast.error('O inicio do mandato deve ser após o fim das votações')
    } else if (mandatoInicio > mandatoFim) {
      return toast.error('O inicio do mandato deve ser anterior a data fim')
    }

    try {
      await api.post('/eleicoes/cadastro', {
        numero_eleicao: data.numero_eleicao,
        titulo_eleicao: data.titulo_eleicao,
        votacao_inicio: votacaoInicio,
        votacao_fim: votacaoFim,
        mandato_inicio: mandatoInicio,
        mandato_fim: mandatoFim,
      })
      router.push('/eleicoes')
      return toast.success('Eleição cadastrada!')
    } catch (error) {
      return toast.error('Ops algo deu errado...')
    }
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
            <Link href={'/eleicoes'}>Eleicoes</Link>
            <CaretRight size={14} />
            <span>Incluir</span>
          </legend>

          <Box>
            <TextInput
              title="Numero da Eleição"
              type="number"
              minW="15rem"
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
                w={100}
                {...register('dayInicioVotacao')}
              />
              <SelectOptions
                description="Mes"
                data={dataMonths}
                w={100}
                {...register('monthInicioVotacao')}
              />
              <SelectOptions
                description="Ano"
                data={dataYears}
                w={120}
                {...register('yearInicioVotacao')}
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
                w={120}
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
                w={120}
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
                w={120}
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
