import { Container, Table, Box } from './styled'
import React from 'react'
import { Link, Typography } from '@mui/material'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'

type Votation = {
  id: number
  name: string
  votosCount: number
  votosBranco: number
  votosNulo: number
  votosChapas: {
    chapaNome: string
    count: number
  }[]
}

export default function Resultado() {
  const router = useRouter()

  const { id }: any = router.query

  const [votation, setVotation] = React.useState<Votation>({} as Votation)

  const getResults = async () => {
    if (!id) return

    const { data } = await api.get(`/votos/votos?id=${id}`)

    setVotation(data)
  }

  const calculatePercentage = (count: number) => {
    if (!votation?.votosCount) return 0

    const percentage = (count / votation?.votosCount) * 100

    return percentage.toFixed(2)
  }

  const calculatePercentageOfValidVotes = (count: number) => {
    if (!votation?.votosCount) return 0
    const total =
      votation?.votosChapas[0].count + votation?.votosChapas[1].count

    const percentage = (count / total) * 100

    return percentage.toFixed(2)
  }

  React.useEffect(() => {
    getResults()
  }, [id])

  return (
    <Container>
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
      <legend>
        <span>
          <Link href={'/eleicao/lista'}>Eleicão</Link>
        </span>
        <CaretRight size={14} />
        <span>Resultados</span>
      </legend>

      <Typography
        style={{
          textAlign: 'center',
        }}
        variant="h4"
        component="h1"
        gutterBottom
      >
        Resultados
      </Typography>

      <Typography
        style={{
          textAlign: 'center',
        }}
        variant="h6"
        component="h2"
        gutterBottom
      >
        Resultado da votação {votation?.name}
      </Typography>

      <Table>
        <thead>
          <tr>
            <th>Chapas</th>
            <th>Votos</th>
            <th>% Total</th>
            <th>% Válidos</th>
          </tr>
        </thead>
        <tbody>
          {votation?.votosChapas?.map((item, index) => (
            <tr key={index}>
              <td>{item.chapaNome}</td>
              <td>{item.count}</td>
              <td>{calculatePercentage(item.count)}%</td>
              <td>{calculatePercentageOfValidVotes(item.count)}%</td>
            </tr>
          ))}

          <tr>
            <td>Brancos</td>
            <td>{votation?.votosBranco}</td>
            <td>{calculatePercentage(votation?.votosBranco)}%</td>
          </tr>
          <tr>
            <td>Nulos</td>
            <td>{votation?.votosNulo}</td>
            <td>{calculatePercentage(votation?.votosNulo)}%</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>{votation?.votosCount}</td>
            <td>{votation?.votosCount ? '100%' : '0%'}</td>
            <td>{votation?.votosCount ? '100%' : '0%'}</td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  )
}
