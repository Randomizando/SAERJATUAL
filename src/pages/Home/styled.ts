import { styled, keyframes } from '@ignite-ui/react'

export const Container = styled('div', {
  background: 'linear-gradient(180deg, #0DA9A4 45%, #00F2FF 89%)',
  height: '80vh',
  position: 'relative',
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    paddingTop: '2rem',
    gap: 10,


    h1: {
      fontSize: '48px',
      textAlign: 'center',
      width: '50%',
      color: '#fff',
      lineHeight: '1.1',
      marginBottom: '1rem',
      '@media(max-width: 1280px)': {
        width: '90%',
      },
      '@media(max-width: 500px)': {
        fontSize: '32px',
      }
    },
    p: {
      color: '#fff',
      width: '30%',
      textAlign: 'center',
      marginBottom: '0.5rem',
      '@media(max-width: 1280px)': {
        width: '80%',
      },
    },
    button: {
      borderRadius: '30px',
      backgroundColor: '#343434',
      boxShadow: '1px 1px 10px 0px rgba(61, 61, 61, 0.50)',
      padding: '1rem 2rem',
      border: ' none',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      '&:hover': {
        transition: '0.5s',
        backgroundColor: '#1e0bff',
      },
    },
  },
})

export const ContentColorRadius = styled('div', {
  position: 'absolute',
  bottom: '0',
  left: '0',
  width: '100%',
  height: '12rem',
  backgroundColor: '#ffff',
  borderRadius: '50% 50% 0 0',

  '@media(max-width: 1280px)': {
    height: '5rem',
  },
})

// Crie um keyframe para a animação de flutuação
const floatAnimation = keyframes({
  '0%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(20px)' },
  '100%': { transform: 'translateY(0)' },
})

// Crie o estilo para a bolinha
export const Bola = styled('div', {
  position: 'absolute',
  width: '20px',
  height: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '50%',
  filter: 'blur(8px)',
  animation: `${floatAnimation} 4s infinite alternate ease-in-out`,
})

// Estilo do container para as bolinhas flutuantes
export const BolinhasFlutuantes = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
})
