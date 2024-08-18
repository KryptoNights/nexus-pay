import Layout from '@/components/Layout/Layout'
import TransactionTable from '@/components/Table/TransactionTable'
import Head from 'next/head'
import React from 'react'

const Transactions = () => {
  return (
    <Layout>
      <Head>
        <title>Transactions</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TransactionTable />
    </Layout>
  )
}

export default Transactions
