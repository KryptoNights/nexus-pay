import InsightsGraph from "@/components/InsightsGraph/InsightsGraph";
import Layout from "@/components/Layout/Layout";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const index = () => {
  const tracked = useRef(false);
  const { activeAccountAdress } = useSelector((state) => state.authSlice);

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
      <InsightsGraph activeAccountAdress={activeAccountAdress} />
    </Layout>
  );
};

export default index;
