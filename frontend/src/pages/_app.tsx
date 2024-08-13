import '@/styles/globals.css'

import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }: AppProps) {
  // suppress useLayoutEffect warnings when running outside a browser
  if (!typeof window) React.useLayoutEffect = useEffect

  return (
    <ThemeProvider themes={['light', 'dark', 'cupcake', 'lofi', 'cyberpunk']}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
