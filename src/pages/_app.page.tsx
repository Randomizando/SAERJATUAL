import { Header } from '@/components/Header'
import { SelecaoProvider } from '@/context'
import { globalStyles } from '@/styles/global'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect } from 'react'

globalStyles()
export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  useEffect(() => {
    localStorage.removeItem('@paginationOld')
    localStorage.removeItem('@filtro')
    localStorage.removeItem('@valuesSelected')
    localStorage.removeItem('@pageCache')
    window.localStorage.clear()
  }, [])

  return (
    <>
      <Header />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SelecaoProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Component {...pageProps} />
        </SelecaoProvider>
      </LocalizationProvider>
    </>
  )
}
