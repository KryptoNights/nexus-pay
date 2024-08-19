import Layout from "@/components/Layout/Layout";
import ReceiveModal from "@/components/ReceiveModal/ReceiveModal";
import ScannerModal from "@/components/ScannerModal/ScannerModal";
import TransferModal from "@/components/TransferModal/TransferModal";
import { getBalances } from "@/core/transactions";
import { divideByTenMillion } from "@/core/utils";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Home: NextPage = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferError, setTransferError] = useState("");

  const { activeAccount } = useSelector((state: any) => state.authSlice);
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(event.target.value);
  };

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (activeAccount) {
        const getBalancesResponse = await getBalances(activeAccount);
        console.log(divideByTenMillion(getBalancesResponse[0]?.amount));

        setBalance(divideByTenMillion(getBalancesResponse[0]?.amount));
      }
    };

    fetchBalances();
  }, [activeAccount]);

  const handleGoogleSignIn = () => {
    router.push("/LoginPage");
  };

  // if (!activeAccount) {
  //   return (
  //     <Layout>
  //       <Head>
  //         <title>Create Account | MoveMoney</title>
  //         <link rel="icon" href="/favicon.ico" />
  //       </Head>
  //       <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
  //         <div className="text-sm text-gray-400 mb-4">01 A NEW WEB3 WALLET</div>
  //         <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
  //           CREATE YOUR MOVEMONEY ACCOUNT
  //           <br />
  //           WITH A SINGLE CLICK
  //         </h1>
  //         <p className="text-center mb-8 max-w-2xl">
  //           MoveMoney Connect is the MoveMoney account manager that connects you
  //           to your favorite apps with no downloads required.
  //         </p>
  //         <button
  //           className="bg-white text-black py-2 px-4 rounded-full flex items-center"
  //           onClick={handleGoogleSignIn}
  //         >
  //           <img src="/google-icon.png" alt="Google" className="w-6 h-6 mr-2" />
  //           CONTINUE WITH GOOGLE
  //         </button>
  //       </main>
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      <Head>
        <title>Transfer | MoveMoney</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center px-4 py-12 text-center lg:mr-[10px]">
        <h1 className="mb-8 mt-8 text-4xl font-bold text-secondary">
          Transfer <span className="text-white">anywhere</span>
        </h1>

        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="0x123... or yourname.movemoney"
              className="input input-bordered input-primary w-full rounded-full pr-12"
              value={recipientAddress}
              onChange={handleInputChange}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
              onClick={() => handlePopupOpen()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </button>
          </div>

          {isPopupOpen && (
            <div className="mt-4">
              <ScannerModal
                onClose={handlePopupClose}
                setRecipientAddress={setRecipientAddress}
                handlePopupClose={handlePopupClose}
              />
            </div>
          )}
          {isReceiveModalOpen && (
            <ReceiveModal
              onClose={() => setIsReceiveModalOpen(false)}
              activeAccount={activeAccount}
            />
          )}

          <div className="mt-6 flex justify-center gap-4">
            <button
              className="btn btn-primary"
              onClick={() => setIsReceiveModalOpen(true)}
            >
              Receive
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsTransferModalOpen(true)}
            >
              Transfer
            </button>
          </div>
        </div>

        {isTransferModalOpen && (
          <TransferModal
            onClose={() => setIsTransferModalOpen(false)}
            balance={balance}
            transferAmount={transferAmount}
            setTransferAmount={setTransferAmount}
            setTransferError={setTransferError}
            recipientAddress={recipientAddress}
            transferError={transferError}
          />
        )}
      </main>
    </Layout>
  );
};

export default Home;
