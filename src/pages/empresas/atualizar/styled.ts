import { TextArea, styled } from '@ignite-ui/react'

export const Container = styled('main', {
  '>form': {
    padding: '2rem 4rem',
    fieldset: {
      paddingTop: '1rem',
      legend: {
        fontFamily: 'Roboto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.3rem',
      },
      border: 'none',
      display: 'flex',
      flexDirection: `column`,
      justifyContent: 'center',
      gap: '2rem',
      button: {
        width: '40%',
      },
    },
  },
})

export const Box = styled('div', {
  display: 'flex',
  alignItems: 'end',
  gap: '2rem',
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
