"use client";

import InsightsGraph from "@/components/InsightsGraph/InsightsGraph";
import Layout from "@/components/Layout/Layout";
import NexusPay from "@/utils/components/NexusPay";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// import NexusPay from "./components/NexusPay";
// import NexusPay from "nexus-frontend-sdk";

const index = () => {
  const tracked = useRef(false);
  const { activeAccountAdress } = useSelector((state) => state.authSlice);

  useEffect(() => {
    if (!tracked.current) {
      mixpanel.track("insights_page_viewed");
      tracked.current = true;
    }
  }, []);

  const [handleOpen, setHandleOpen] = useState(false);
  return (
    <Layout>
      <Head>
        <title>Transfer | NexusPay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <InsightsGraph activeAccountAdress={activeAccountAdress} />
      <NexusPay
        name="Nexus Pay "
        details="Sample request sent from insight page"
        amount="10"
        open={handleOpen}
        token="USD"
        onClick={() => setHandleOpen(true)}
        onClose={() => setHandleOpen(!handleOpen)}
        recipient_wallet= "0xede634cb984f2897df0d3630257d3707202f85187ae9c8e51bcef102235981d0"
      />
    </Layout>
  );
};

export default index;
