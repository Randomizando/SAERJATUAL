import Link from 'next/link'
import { Container } from './styled'
import { TemporaryDrawer } from '../DrawerMenu'
import Image from 'next/image'
import logo from '@/assets/logo.png'

export function Header() {
  return (
    <Container>
      <nav>
        <Link href={'/'}>
          <Image src={logo} alt="logo" height={50} />
        </Link>
        <TemporaryDrawer />
      </nav>
    </Container>
  )
}
