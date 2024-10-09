"use client";

import InsightsGraph from "@/components/InsightsGraph/InsightsGraph";
import Layout from "@/components/Layout/Layout";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import NexusPay from "./components/NexusPay";

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
        name="Details"
        details="as"
        amount="100"
        open={handleOpen}
        onClick={() => setHandleOpen(true)}
        onClose={() => setHandleOpen(!handleOpen)}
      />
    </Layout>
  );
};

export default index;
