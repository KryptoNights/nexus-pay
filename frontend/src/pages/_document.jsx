import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="antialiased [font-feature-settings:'ss01']" lang="en">
      <Head>
        <meta
          name="keywords"
          content="payments sdk, Nexus, NexusPay, Web3, Crypto, payments, easy payments, eth global, eth global nyc, stablecoin payments"
        />
        <meta name="robots" content="index, follow" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="NqX5mc07r18m3it3uZ5VvRW_mkz7NmFQ5r6ZZM8IRGk"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@paywithnexus" />
        <meta name="twitter:creator" content="@SarahMaslinNir" />
        <meta
          name="twitter:title"
          content="Pay anyone anywhere fast and secure using crypto"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
