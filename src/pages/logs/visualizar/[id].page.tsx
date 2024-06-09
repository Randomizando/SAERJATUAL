import { GetServerSideProps } from 'next'
import { Box, Container, TextAreaInput } from './styled'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'

interface schemaLogs {
  data: {
    id: number
    cod_log: string
    data_hora_log: string
    ocorrencia_log: string
  }
}

export default function VisualizarLogs({ data }: schemaLogs) {
  return (
    <Container>
      <Box style={{ justifyContent: 'end' }}>
        <Link
          href="/logs"
          style={{
            textDecoration: 'none',
            fontFamily: 'Roboto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#000',
          }}
        >
          <ArrowBendDownLeft size={32} />
          Retornar
        </Link>
      </Box>
      <p>
        <span>
          <Link href={'/logs'}>Logs</Link>
        </span>
        <CaretRight size={14} />
        <span>Visualizar</span>
      </p>
      <Box>
        <TextInput title="Código Log" defaultValue={data.cod_log} />
        <TextInput title="Data Hora Log" defaultValue={data.data_hora_log} />
      </Box>
      <Box>
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Roboto',
            fontSize: '14px',
            color: 'rgba(0, 0, 0, 0.6)',
            width: '100%',
          }}
        >
          Observações
          <TextAreaInput title="Ocorrencia Log" value={data.ocorrencia_log} />
        </label>
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.logs.findFirst({
      where: {
        id: Number(id),
      },
    })

    if (!data) {
      throw new Error('Registro não encontrado')
    }

    // Certifique-se de que data_hora_log não é undefined antes de chamar format
    const formattedDateTime = format(
      data.data_hora_log,
      "yyyy-MM-dd'T'HH:mm:ssXXX",
      { locale: ptBR },
    )

    // Cria um novo objeto data com data_hora_log formatado
    const dataWithFormat = {
      ...data,
      data_hora_log: formattedDateTime,
    }

    return {
      props: {
        data: dataWithFormat,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de logs:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
