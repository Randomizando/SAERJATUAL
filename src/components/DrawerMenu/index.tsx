import logo from '@/assets/logo.png'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Twirl as Hamburger } from 'hamburger-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArchiveTray,
  Article,
  Balloon,
  Buildings,
  CloudArrowUp,
  Function,
  Money,
  Receipt,
  Table,
  User,
  UserFocus,
  UserPlus,
  UsersFour,
} from 'phosphor-react'
import * as React from 'react'
type Anchor = 'left'

export function TemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  })
  const [openSubMenu, setOpenSubMenu] = React.useState(false)

  const [isOpen, setOpen] = React.useState(false)

  const router = useRouter()

  // const { Logs } = useContextCustom()

  function handleNextPage(text: string): void {
    if (text === 'Parametros') {
      router.push('/parametros')
    } else if (text === 'Empresas') {
      router.push('/empresas')
    } else if (text === 'Tabelas') {
      router.push('/tabelas')
    } else if (text === 'Associados') {
      router.push('/associados')
    } else if (text === 'Logs') {
      router.push('/logs')
    } else if (text === 'Aniversariantes') {
      router.push('/associados/aniversariantes')
    } else if (text === 'Protocolos') {
      router.push('/protocolos')
    } else if (text === 'Chapas') {
      router.push('/chapas')
    } else if (text === 'Diretorias') {
      router.push('/diretorias')
    } else if (text === 'Eleições') {
      router.push('/eleicao/lista')
    } else if (text === 'Votação') {
      router.push('/eleicao')
    } else if (text === 'Importar Pagtos') {
      router.push('/importacaoPagamentos')
    } else if (text === 'Pagamentos') {
      router.push('/pagamentos')
    } else if (text === 'Importar SBA') {
      router.push('/importacaoAssociados')
    }
  }

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setState({ ...state, [anchor]: open })
      setOpen(open)
    }

  const arrayIcons = [
    <>
      <UsersFour size={24} color="#fff" />
    </>,
    <></>,
    <></>,
    <>
      <Money size={24} color="#fff" />
      {/* <ArchiveTray size={24} color="#fff" /> */}
    </>,
    <>
      <Balloon size={24} color="#fff" />
    </>,
    <>
      <Buildings size={24} color="#fff" />
    </>,
    <>
      <Article size={24} color="#fff" />
      {/* <UsersFour size={24} color="#fff" /> */}
    </>,
    <>
      <UserFocus size={24} color="#fff" />
    </>,
    <>{/* <Receipt size={24} color="#fff" /> */}</>,
    <>{/* <Receipt size={24} color="#fff" /> */}</>,
    <>
      <User size={24} color="#fff" />
    </>,
  ]

  const arrayIconsTwoList = [
    <>
      <Table size={24} color="#fff" />
    </>,
    <>
      <CloudArrowUp size={24} color="#fff" />
    </>,
    <>
      <Function size={24} color="#fff" />
    </>,
  ]

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      //   bgcolor={'linear-gradient(180deg, #0DA9A4 45%, #00F2FF 89%)'}
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #0DA9A4 45%, #00F2FF 89%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '2rem 0rem',
        }}
      >
        <Image src={logo} alt="logo" width={210} quality={100} />
      </div>

      <List>
        {[
          'Associados',
          'Importar SBA',
          'Importar Pagtos',
          'Pagamentos',
          'Aniversariantes',
          'Protocolos',
          'Empresas',
          'Eleições',
          'Chapas',
          'Diretorias',
          'Votação',
        ].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              style={{ padding: '0px 0px 0px 1rem' }}
              onClick={() => {
                handleNextPage(text)
              }}
            >
              {arrayIcons[index] ? (
                <ListItemIcon>{arrayIcons[index]}</ListItemIcon>
              ) : null}
              <ListItemText primary={text} style={{ color: '#fff' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* two list */}
      <List>
        {['Tabelas', 'Parametros', 'Logs'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              style={{ padding: '0px 0px 0px 1rem' }}
              onClick={() => {
                handleNextPage(text)
              }}
            >
              <ListItemIcon>{arrayIconsTwoList[index]}</ListItemIcon>
              <ListItemText primary={text} style={{ color: '#fff' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  // const subList = (textOpen: any) => (
  //   <Box
  //     sx={{ width: 250 }}
  //     role="presentation"
  //     onClick={toggleDrawer(textOpen, false)}
  //     onKeyDown={toggleDrawer(textOpen, false)}
  //     //   bgcolor={'linear-gradient(180deg, #0DA9A4 45%, #00F2FF 89%)'}
  //     style={{
  //       background: "linear-gradient(180deg, #0DA9A4 45%, #00F2FF 89%)",
  //     }}
  //   >
  //     <div
  //       style={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         width: "100%",
  //         padding: "2rem 0rem",
  //       }}
  //     >
  //       <Image src={logo} alt="logo" width={210} quality={100} />
  //     </div>

  //     <List>
  //       {[
  //         "Eleições",
  //         "Chapas",
  //         "Diretorias",
  //       ].map((text, index) => (<ListItem key={text} disablePadding>
  //         <ListItemButton
  //           onClick={() => {
  //             handleNextPage(text);
  //           }}
  //         >
  //           <ListItemIcon>{arrayIcons[index]}</ListItemIcon>
  //           <ListItemText primary={text} style={{ color: "#fff" }} />
  //         </ListItemButton>
  //       </ListItem>
  //       )
  //       )}
  //     </List>

  //   </Box>
  // );

  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            style={{ color: '#fff' }}
            onClick={toggleDrawer(anchor, true)}
          >
            <Hamburger toggled={isOpen} />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div style={{ display: 'flex', height: '100%' }}>
              {list(anchor)}
              {/* {
                openSubMenu === true ? 
                  <>
                  {subList(anchor)}
                  </>
                  : 
                  null
              } */}
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  )
}
