import { useContextCustom } from '@/context'
import Link from 'next/link'
import { ArrowBendDownLeft } from 'phosphor-react'
import { Box, Container } from './styled'

interface schemaBackPageComponent {
  backRoute: string
  discartPageBack?: any
}

export function BackPage({
  backRoute,
  discartPageBack,
}: schemaBackPageComponent) {
  const { setVoltarPagina } = useContextCustom()
  async function limparCache() {
    try {
      const cache = await caches.open('cache') // Abre o cache específico
      const chaves = await cache.keys() // Obtém todas as chaves (requests) no cache
      await Promise.all(chaves.map((chave) => cache.delete(chave))) // Deleta cada item no cache
    } catch (error) {
      console.error('Erro ao limpar o cache:', error)
    }
  }

  return (
    <Container>
      <Box>
        <Link
          href={`/${backRoute}`}
          onClick={() => {
            // eslint-disable-next-line no-unused-expressions
            discartPageBack
              ? (setVoltarPagina(0),
                localStorage.removeItem('@paginationOld'),
                localStorage.removeItem('@filtro'),
                localStorage.removeItem('@valuesSelected'),
                localStorage.removeItem('@pageCache'),
                window.localStorage.clear(),
                limparCache())
              : null
          }}
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
          <ArrowBendDownLeft size={24} />
          Retornar
        </Link>
      </Box>
    </Container>
  )
}
