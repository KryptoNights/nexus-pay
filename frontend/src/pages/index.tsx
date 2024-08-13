import Layout from '@/components/Layout/Layout'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

const Home: NextPage = () => {
  const [recipientAddress, setRecipientAddress] = useState('')

  // const { data, isIdle, isError, isLoading, isSuccess, sendTransaction } =
  //   useSendTransaction({
  //     request: {
  //       to: '0xce4a9990251944b625c11d2f4a28b38197aa29e1',
  //       value: BigNumber.from('10000000000000000'), // .01 ETH
  //     },
  //   })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(event.target.value)
  }

  return (
    <Layout>
      <Head>
        <title>Transfer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow items-center justify-center py-10 px-20 text-center">
        <h1 className="my-10 text-6xl font-bold">
          <span className="text-secondary">Transfer</span> anywhere
        </h1>
        <input
          type="text"
          placeholder="0x123... or yourname.movemoney"
          className="input input-bordered input-primary w-full max-w-xs rounded-full"
          value={recipientAddress}
          onChange={handleInputChange}
        />

        <div className="m-8 flex-row gap-6">
          <div className="btn btn-primary m-3" onClick={() => {}}>
            <p>Transfer</p>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Home
