import { styled } from '@ignite-ui/react'

export const Container = styled('main', {
  '>form': {
    padding: '2rem 4rem',
    fieldset: {
      paddingTop: '1rem',
      legend: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.3rem',
        fontFamily: 'Roboto',
      },
      border: 'none',
      display: 'flex',
      flexDirection: `column`,
      justifyContent: 'center',
      gap: '5rem',
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
  flexWrap: 'wrap',
})

export const FormErrorMessage = styled('p', {
  color: 'red',
})

export const Text = styled('p', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  border: 'solid 1px',
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderTopColor: 'transparent',
  borderBottomColor: '#A9A9B2',
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  fontWeight: '400',
  lineHeight: '1.4375em',
  letterSpacing: '0.00938em',
  color: 'rgba(0, 0, 0, 0.6)',
  flex: 1,

  padding: '4px 0px 5px',
})
