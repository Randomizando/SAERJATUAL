import { styled } from '@ignite-ui/react'
import CircularProgress from '@mui/material/CircularProgress'

export function Loading() {
  const Box = styled('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '90vh',
  })

  return (
    <Box>
      <CircularProgress color="primary" />
    </Box>
  )
}
