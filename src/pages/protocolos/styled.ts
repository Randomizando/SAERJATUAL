import { styled } from '@ignite-ui/react';

export const Container = styled('main', {
  padding: '26px 4rem',
  h1: {
    fontFamily: 'Roboto',
  },
  p: {
    fontFamily: 'Roboto',
  },
});

export const Box = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2rem',
  width: '100%',
});

export const ContentFilterDates = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  fontSize: '12px',
  p: {
    fontSize: '12px',
    minWidth: '100px',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  input: {
    border: 'solid 1px',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    height: '100%',
    fontFamily: 'Roboto',
  },
  span: {
    fontSize: '12px',
  },
  '>div': {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'end',
    justifyContent: 'space-between',
  },
  article: {
    display: 'flex',
    gap: '0.1rem',
  },
  button: {
    margin: '0px',
    fontSize: '12px',
    border: 'solid 1px',
    padding: '0.3rem 0.5rem',
  },
});
