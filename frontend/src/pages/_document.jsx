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
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:site" content="@paywithnexus" />
        <meta name="twitter:creator" content="@kavishshahh" />
        <meta
          name="twitter:title"
          content="Nexus pay is a p2p and merchant payment platform. Open, decentralized, cross-border payments with instant-finality and low fees."
        />
        <meta
          name="twitter:image"
          content="https://i.imghippo.com/files/Lkn5387ZQ.jpg"
        />
        <meta name="twitter:url" content="https://nexuspay.vercel.app/"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
