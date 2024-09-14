import InsightsGraph from "@/components/InsightsGraph/InsightsGraph";
import Layout from "@/components/Layout/Layout";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import React, { useEffect, useRef } from "react";

const index = () => {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      mixpanel.track("insights_page_viewed");
      tracked.current = true;
    }
  }, []);
  return (
    <Layout>
      <Head>
        <title>Transfer | NexusPay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <InsightsGraph activeAccountAdress="0xede634cb984f2897df0d3630257d3707202f85187ae9c8e51bcef102235981d0" />
    </Layout>
  );
};

export default index;
