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

export const FormErrorMessage = styled('p', {
  color: 'red',
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

export const FormError = styled('p', {
  color: '#d32f2f',
  fontFamily: 'Roboto, Helvetica , Arial, sans-serif',
  fontWeight: '400',
  fontSize: '0.75rem',
  lineHeight: '1.66',
  letterSpacing: '0.03333em',
  textAlign: 'left',
  marginTop: '3px',
  marginRight: '0',
  marginBottom: ' 0',
  marginLeft: '0',
})
