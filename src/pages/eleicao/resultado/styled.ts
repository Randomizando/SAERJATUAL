import { styled } from '@ignite-ui/react'

export const Container = styled('main', {
  maxWidth: '1500px',
  margin: '0 auto',
  padding: '2rem',
  legend: {
    fontFamily: 'Roboto',
    display: 'flex',
    gap: '0.3rem',
  },
})

export const Box = styled('div', {
  display: 'flex',
  alignItems: 'end',
  gap: '2rem',
})

export const Table = styled('table', {
  margin: '20px auto',
  borderCollapse: 'collapse',
  width: '50%',
  border: '1px solid black',
  'tr, th, td': {
    border: '1px solid black',
    padding: '0.5rem',
  },
  th: {
    backgroundColor: '#70B888',
  },
  td: {
    textAlign: 'center',
  },
  tfoot: {
    td: {
      backgroundColor: '#70B888',
    },
  },
})
