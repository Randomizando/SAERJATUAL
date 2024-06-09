import { styled } from '@ignite-ui/react';

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
});

export const Box = styled('div', {
  display: 'flex',
  alignItems: 'end',
  gap: '2rem',
});

export const FormErrorMessage = styled('p', {
  color: 'red',
});
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
});

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
});

export const FilesContainer = styled('div', {
  width: '100%',
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginTop: '1rem',

  'p': {
    color: '#515151',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '26.3rem',
    overflow: 'hidden',
    fontSize: '0.9rem'
  },

  '#fileButton': {
    width: 'max-content',
    padding: '0.25rem 0.6rem 0.3rem',
    fontSize: '1rem',
    background: '#0da9a4',
    borderRadius: '6px',
    color: '#fff',
    textDecoration: 'none',
  }
});

export const FilesWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  height: '32px',
  'p': {
    width: '190px',
    overflow: 'hidden',
    paddingLeft: '0.5rem',
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.6)',
  }
});
