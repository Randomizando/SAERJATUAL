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
  gap: '2rem',
  flexWrap: 'wrap',
  alignItems: 'end',
})

export const Fieldset = styled('div', {
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

export const ContainerInputFile = styled('div', {
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flex: 1,
  justifyContent: 'space-between',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  button: {
    marginTop: '0px',
    flex: 1,
    fontSize: '12px',
    padding: '0.5rem 1rem',
    zIndex: 2,
  },
  '> p': {
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.6)',
  },
})

export const ContentInputFile = styled('div', {
  border: 'solid 1px rgb(169, 169, 178)',
  position: 'absolute',
  width: '88%',
  height: '100%',
  borderRadius: '4px',
  alignItems: 'center',
  display: 'flex',
  input: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height: '100%',
    margin: '0px',
    overflow: 'hidden',
    right: '0px',
    cursor: 'pointer',
    opacity: '0',
  },
  p: {
    width: '100%',
    paddingLeft: '0.5rem',
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.6)',
    overflow: 'hidden',
    zIndex: 1,
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

export const ContainerDividedEqually = styled('div', {
  display: 'flex',
  width: '100%',
})

export const FilesContainer = styled('div', {
  width: '100%',
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginTop: '1rem',

  p: {
    color: '#515151',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '26.3rem',
    overflow: 'hidden',
    fontSize: '0.9rem',
  },

  '#fileButton': {
    width: 'max-content',
    padding: '0.25rem 0.6rem 0.3rem',
    fontSize: '1rem',
    background: '#0da9a4',
    borderRadius: '6px',
    color: '#fff',
    textDecoration: 'none',
  },
})

export const ContentFileToEditOrDelete = styled('div', {
  display: 'flex',
  alignItems: 'end',
  width: 'min-content',
  marginLeft: '-0.5rem',
  button: {
    fontSize: '0.8rem',
    marginLeft: '0.5rem',
    minWidth: '60px',
  },
  '> a': {
    width: 'max-content',
    padding: '0.5rem',
    fontSize: '0.8rem',
    background: '#0da9a4',
    borderRadius: '6px 6px 6px 6px',
    color: '#fff',
    textDecoration: 'none',
  },
})

export const EmptyContainer = styled('div', {
  width: '6.9rem',
})
