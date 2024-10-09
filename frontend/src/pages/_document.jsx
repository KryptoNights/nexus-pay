import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="antialiased [font-feature-settings:'ss01']" lang="en">
      <Head>
        <meta
          name="keywords"
          content="Nexus, NexusPay, web3, Web3, Crypto, payments, payments sdk, easy payments, Eth Global"
        />
        <meta name="robots" content="index, follow" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="NqX5mc07r18m3it3uZ5VvRW_mkz7NmFQ5r6ZZM8IRGk"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
