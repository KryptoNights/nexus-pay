import Layout from "@/components/Layout/Layout";
import QRScanner from "@/components/QRScanner/QRScanner";
import { GOOGLE_CLIENT_ID } from "@/core/constants";
import useEphemeralKeyPair from "@/core/useEphemeralKeyPair";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { setAuthData } from "@/redux/reducers/authReducer";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";

const Home: NextPage = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
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

  const ScannerModal = ({ onClose }: { onClose: () => void }) => {
    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
    return (
      <div
        id="modal"
        className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackgroundClick}
      >
        <div className="modal-box bg-gray-800 text-white max-w-sm relative">
          <button
            id="closeBtn"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
          <div className="flex flex-col items-center">
            <div className="">
              <QRScanner
                setRecipientAddress={setRecipientAddress}
                handlePopupClose={handlePopupClose}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReceiveModal = ({ onClose }: { onClose: () => void }) => {
    const sampleUsername = "kavish.movemoney";
    const [copyFeedback, setCopyFeedback] = useState("");

    const handleCopy = (text: string, type: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopyFeedback(`${type} copied!`);
          setTimeout(() => setCopyFeedback(""), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          setCopyFeedback("Failed to copy");
        });
    };

    return (
      <div
        className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-box bg-gray-800 text-white max-w-sm relative p-6">
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-4">Receive Funds</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* QR generator */}
              <QRCode value={activeAccount} size={200} />
            </div>
            <div className="text-sm w-full">
              <p>Wallet Address:</p>
              <div className="flex items-center bg-gray-700 p-2 rounded">
                <p className="font-mono flex-grow truncate">{activeAccount}</p>
                <button
                  onClick={() => handleCopy(activeAccount, "Address")}
                  className="ml-2 text-primary hover:text-primary-focus"
                  title="Copy address"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-sm w-full">
              <p>Or use your MoveMoney username:</p>
              <div className="flex items-center bg-gray-700 p-2 rounded">
                <p className="font-mono flex-grow">{sampleUsername}</p>
                <button
                  onClick={() => handleCopy(sampleUsername, "Username")}
                  className="ml-2 text-primary hover:text-primary-focus"
                  title="Copy username"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {copyFeedback && (
              <div className="text-sm text-secondary animate-fade-in-out">
                {copyFeedback}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
              <ScannerModal onClose={handlePopupClose} />
            </div>
          )}
          {isReceiveModalOpen && (
            <ReceiveModal onClose={() => setIsReceiveModalOpen(false)} />
          )}

          <div className="mt-6 flex justify-center gap-4">
            <button
              className="btn btn-primary"
              onClick={() => setIsReceiveModalOpen(true)}
            >
              Receive
            </button>
            <button className="btn btn-secondary">Transfer</button>
          </div>
        </div>

        {/* {activeAccount && (
          <div className="mt-8 text-sm text-gray-400">
            Connected: {activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}
          </div>
        )} */}
      </main>
    </Layout>
  );
};

export default Home;
