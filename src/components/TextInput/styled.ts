import { styled } from '@ignite-ui/react'
import TextField from '@mui/material/TextField'
import InputMask from 'react-input-mask'
export const Container = styled('div', {
  display: 'flex',
  alignItems: 'start',
  flex: 1,
  flexDirection: 'column',
})
export const ContainerTextField = styled(TextField, {})

export const ContainerMaskInput = styled('label', {
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Roboto',
  fontSize: '12px',
  height: '100%',
  color: 'rgba(0, 0, 0, 0.6)',
  width: '$w',
})
export const ContentMaskInput = styled(InputMask, {
  fontFamily: 'roboto',
  fontSize: '16px',
  padding: '0.3rem',
  border: 'solid 1px rgba(0, 0, 0, 0.42)',
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderTopColor: 'transparent',
  '&:focus': {
    outline: 'none',
    BorderBottomColor: 'rgba(0, 0, 0, 0.42)',
  },
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
