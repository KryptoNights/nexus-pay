import Layout from "@/components/Layout/Layout";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const Home: NextPage = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();

  // const { data, isIdle, isError, isLoading, isSuccess, sendTransaction } =
  //   useSendTransaction({
  //     request: {
  //       to: '0xce4a9990251944b625c11d2f4a28b38197aa29e1',
  //       value: BigNumber.from('10000000000000000'), // .01 ETH
  //     },
  //   })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(event.target.value);
  };
  console.log(activeAccount);

  return (
    <Layout>
      <Head>
        <title>Transfer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-[6.75rem] flex-grow items-center justify-center pl-2em pr-2em text-center">
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
  );
};

export default Home;
