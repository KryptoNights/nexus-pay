import '@/styles/globals.css'

import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import store from "../redux/store"
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }: AppProps) {
  // suppress useLayoutEffect warnings when running outside a browser
  if (!typeof window) React.useLayoutEffect = useEffect

  return (
    <Provider store={store}>
      <ThemeProvider themes={['light', 'dark', 'cupcake', 'lofi', 'cyberpunk']}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
