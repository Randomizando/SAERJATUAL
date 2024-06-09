import { Button, styled } from '@ignite-ui/react'

export const HeaderBirthdays = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '1rem',
  justifyContent: 'flex-start',
  marginTop: '1rem',
  marginBottom: '4.5rem',
})

export const ContainerFilters = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  width: '100%',
  gap: '1rem',
})

export const TextNoFilter = styled('p', {
  marginTop: '1rem',
  textAlign: 'center',
})

export const ButtonEtiqueta = styled(Button, {
  heigth: 'auto',
  padding: '.5rem',
})
