import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '#fff',
    color: '#000',
    '-webkit-font-smoothing': 'antialiased',
  },
})
