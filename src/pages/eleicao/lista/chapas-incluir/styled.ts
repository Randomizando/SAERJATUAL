import { styled } from '@ignite-ui/react'


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
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2rem',
  width: '100%',
  // button: {
  //   padding: '1rem 1rem',
  // },
})
