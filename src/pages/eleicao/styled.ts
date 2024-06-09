import { styled } from '@ignite-ui/react'

export const ContainerInside = styled('main', {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '1rem',
  h1: {
    fontFamily: 'Roboto',
  },
  p: {
    fontFamily: 'Roboto',
  },
})

export const Container = styled('main', {
  padding: '2rem 4rem',
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
  // button: {
  //   padding: '1rem 2rem',
  // },
})

export const ConfirmationModal = styled('div', {
  padding: '1rem',
  textAlign: 'center',
  borderRadius: '20px',
})

export const WelcomeModal = styled('div', {
  padding: '1rem',
  textAlign: 'center',
  borderRadius: '20px',
})

export const BoxOptions = styled('div', {
  display: 'flex',
  gap: '3rem',
  alignItems: 'flex-start',
  margin: '1rem 0',
})

export const BoxOptionName = styled('div', {
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '.5rem',
  borderRadius: '0.5rem',
  backgroundColor: '#70B888',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
})

export const BoxCandidates = styled('div', {
  display: 'flex',
  gap: '1rem',
  backgroundColor: 'white',
  border: '1px solid black',
  alignItems: 'center',
  padding: '.3rem',
  margin: '1rem 0',
  borderRadius: '0.5rem',
})

export const CanditateName = styled('p', {})

export const CanditatePosition = styled('p', {})

export const Checkbox = styled('input', {
  width: '1.5rem',
  height: '47px',
  cursor: 'pointer',
  maxHeight: '47px',
})

export const WhiteButton = styled('div', {
  flex: 1,
  display: 'flex',
  height: '47px',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '.5rem',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
  border: '1px solid black',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
})

export const NulableButton = styled('div', {
  flex: 1,
  display: 'flex',
  height: '47px',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '.5rem',
  borderRadius: '0.5rem',
  backgroundColor: 'red',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
})

export const OutlinedButton = styled('button', {
  width:'100px',
  height:"30px",
  backgroundColor: 'white',
  fontSize: '15px',
  fontStyle: 'normal',
  lineHeight: '15px',
  borderRadius: '8px',
  border:'1px solid #0DA9A4',
  padding: '0.5rem',
  color: '#0DA9A4',
  marginTop: '1rem',
  '&:hover': {
    backgroundColor: '#eee',
    cursor: 'pointer',
  }
})

export const VotationButton = styled('button', {
  border: 0,
  width: 100,
  height: 30,
  borderRadius: 5,
  margin: 10,
  cursor: 'pointer',
  color:'black',
})

export const PopUpButton = styled('button', {
  
  border: 0,
  width: 100,
  height: 30,
  borderRadius: 6,
  marginRight: 10,
  marginTop: 10,
  color: '#fff',
  cursor: 'pointer',
  fontSize: '15px',
  
})