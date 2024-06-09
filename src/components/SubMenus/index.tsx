import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import Link from 'next/link'
import { CaretDown } from 'phosphor-react'

export default function SubMenus({ title }: any) {
  const teste = [
    { id: 0, name: 'empresa', link: 'empresas' },
    { id: 1, name: 'associados', link: 'associados' },

    { id: 2, name: 'parametros', link: 'parametros' },
    { id: 3, name: 'nome 1', link: 'empresa' },
    { id: 4, name: 'nome 1', link: 'empresa' },
    { id: 5, name: 'nome 1', link: 'empresa' },
  ]

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState: any) => (
        <React.Fragment>
          <Button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              textTransform: 'none',
              gap: '0.4rem',
              padding: '0px',
            }}
            variant="contained"
            {...bindTrigger(popupState)}
          >
            <span>{title}</span>
            <CaretDown size={15} />
          </Button>

          <Menu {...bindMenu(popupState)}>
            {teste?.map((item) => {
              return (
                <MenuItem key={item.id} onClick={popupState.close}>
                  <Link
                    style={{ textDecoration: 'none', color: '#000' }}
                    href={`/${item.link}`}
                  >
                    {item.name}
                  </Link>
                </MenuItem>
              )
            })}
            {/* <MenuItem onClick={popupState.close}>Profile</MenuItem>
            <MenuItem onClick={popupState.close}>My account</MenuItem>
            <MenuItem onClick={popupState.close}>Logout</MenuItem> */}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  )
}
