import "@/styles/globals.css";
import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import store from "../redux/store";
import { Provider } from "react-redux";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [localActiveAccount, setLocalActiveAccount]: any = React.useState(null);
  // suppress useLayoutEffect warnings when running outside a browser
  if (!typeof window) React.useLayoutEffect = useEffect;
  localStorage.setItem("theme", "dark");

  return (
    <Provider store={store}>
      <ThemeProvider themes={["light", "dark", "cupcake", "lofi", "cyberpunk"]}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), { ssr: false });