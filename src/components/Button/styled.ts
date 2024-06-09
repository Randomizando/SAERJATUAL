import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'end',
  button: {
    width: '100%',
    backgroundColor: '#0DA9A4',
    fontSize: '15px',
    fontStyle: 'normal',
    lineHeight: '15px',
    borderRadius: '8px',
    padding: '0.5rem',
    border: 'none',
    color: '#fff',
    marginTop: '1rem',
    '&:hover': {
      backgroundColor: '#0c9894',
      cursor: 'pointer',
    },
    '&:disabled': {
      pointerEvents: 'none',
      opacity: 0.7,
    },
  },
})
