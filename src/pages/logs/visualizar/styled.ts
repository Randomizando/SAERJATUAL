import { TextArea, styled } from '@ignite-ui/react'

export const Container = styled('main', {
  padding: '2rem 4rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  h1: {
    fontFamily: 'Roboto',
  },
  p: {
    fontFamily: 'Roboto',
  },
})

export const Box = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2rem',
  width: '100%',
  button: {
    padding: '1rem 2rem',
  },
})

export const TextAreaInput = styled(TextArea, {
  backgroundColor: 'white',
  border: 'solid 1px #d9d9d9',
  color: '#000',
  width: '100%',
  padding: '0.5rem 0px 0px 0.5rem',
  '&:focus': {
    border: 'solid 1px blue',
  },
})
