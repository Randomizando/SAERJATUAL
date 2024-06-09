import { ButtonProps } from '@ignite-ui/react'
import { Container } from './styled'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'] })
interface schemaButton extends ButtonProps {
  title: string
}

export function Button({ title, children, ...rest }: schemaButton) {
  return (
    <Container className={montserrat.style}>
      <button {...rest}>
        {title}
        <>{children}</>
      </button>
    </Container>
  )
}
