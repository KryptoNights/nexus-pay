import Layout from "@/components/Layout/Layout";
import TransactionTable from "@/components/Table/TransactionTable";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import React, { useEffect, useRef } from "react";

const Transactions = () => {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      mixpanel.track("transaction_page_viewed");
      tracked.current = true;
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>Transactions</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TransactionTable />
    </Layout>
  );
};

export default Transactions;
