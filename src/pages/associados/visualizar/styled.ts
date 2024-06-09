import { styled } from '@ignite-ui/react'

export const Container = styled('main', {
  '>form': {
    padding: '2rem 4rem',
    fieldset: {
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
  fontSize: '13px',
})

export const Box = styled('div', {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  alignItems: 'end',
})
export const Fieldset = styled('fieldset', {
  border: 'solid 1px',
  marginTop: '1rem',
  borderRadius: '8px',
  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
  paddingBottom: '2rem',
  fontFamily: 'Roboto',
  h3: {
    padding: '0.5rem 1.5rem',
  },
  legend: {
    padding: '0.5rem 1.5rem',
    color: '#fff',
    backgroundColor: 'rgb(13, 169, 164)',
    marginBottom: '2rem',
    width: '100%',
    borderRadius: '4px 4px 0px 0px',
    h2: {
      width: '100%',
    },
  },
  '>div': {
    padding: '0.5rem 1.5rem',
  },
})
