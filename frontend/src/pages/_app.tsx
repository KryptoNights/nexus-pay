import "@/styles/globals.css";
import mixpanel from "mixpanel-browser";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "../redux/store";
import { Analytics } from "@vercel/analytics/react"

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
  ignore_dnt: true,
});
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // suppress useLayoutEffect warnings when running outside a browser
  if (!typeof window) React.useLayoutEffect = useEffect;
  localStorage.setItem("theme", "dark");

  // React.useEffect(() => {
  //   // write useEffect if we are not having any key related to @aptos-connect/keyless-accounts redirect to 3000
  //   if (!localStorage.getItem("@aptos-connect/keyless-accounts")) {
  //     router.push("/");
  //   } else {
  //     // router.push("/dashboard");
  //   }
  // });

  return (
    <Provider store={store}>
      <ThemeProvider themes={["light", "dark", "cupcake", "lofi", "cyberpunk"]}>
        <Component {...pageProps} />
        <Analytics/>
      </ThemeProvider>
    </Provider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), { ssr: false });
