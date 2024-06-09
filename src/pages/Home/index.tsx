import {
  Bola,
  BolinhasFlutuantes,
  Container,
  ContentColorRadius,
} from './styled'
import { ArrowRight } from 'phosphor-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'] })
export default function Home() {
  return (
    <>
      <Container className={montserrat.className}>
        <BolinhasFlutuantes>
          <Bola style={{ top: '300px', left: '400px' }} />
          <Bola style={{ top: '400px', left: '800px' }} />
          <Bola style={{ top: '200px', left: '500px' }} />
          <Bola style={{ top: '200px', left: '1000px' }} />
          <Bola style={{ top: '500px', left: '500px' }} />
          <Bola style={{ top: '500px', left: '900px' }} />

          <Bola style={{ top: '300px', right: '400px' }} />
          <Bola style={{ top: '400px', right: '800px' }} />
          <Bola style={{ top: '200px', right: '500px' }} />
          <Bola style={{ top: '200px', right: '1000px' }} />
          <Bola style={{ top: '500px', right: '500px' }} />
          <Bola style={{ top: '500px', right: '900px' }} />
        </BolinhasFlutuantes>
        <section>
          <h1>Pela segurança do paciente e a integridade do anestesista</h1>
          <p>
            O anestesista é o guardião da vida, leal ao paciente e à equipe
            médica. A função da SAERJ é representar o anestesista do Rio de
            Janeiro, promovendo ações de valorização, defendendo e lutando pelo
            crescimento da especialidade.
          </p>
          <button>
            Sobre-nós <ArrowRight />{' '}
          </button>
        </section>

        <ContentColorRadius />
      </Container>
    </>
  )
}
