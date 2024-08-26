import Layout from "@/components/Layout/Layout";
import ReceiveModal from "@/components/ReceiveModal/ReceiveModal";
import ScannerModal from "@/components/ScannerModal/ScannerModal";
import TransferModal from "@/components/TransferModal/TransferModal";
import { get_nexus_ids_starting_with, getBalances } from "@/core/transactions";
import { divideByTenMillion } from "@/core/utils";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import mixpanel from "mixpanel-browser";
import { setUserBalance } from "@/redux/reducers/authReducer";

const Home: NextPage = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  // const [balance, setBalance] = useState(0);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferError, setTransferError] = useState("");

  const { activeAccountAdress, idToken, balance } = useSelector(
    (state: any) => state.authSlice
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (activeAccountAdress) {
        const getBalancesResponse = await getBalances(activeAccountAdress);
        console.log(divideByTenMillion(getBalancesResponse[0]?.amount));

        dispatch(
          setUserBalance(divideByTenMillion(getBalancesResponse[0]?.amount))
        );
      }
    };

    //to be removed
    if (
      typeof window !== "undefined" &&
      activeAccountAdress &&
      idToken?.state?.accounts[0]?.idToken?.raw
    ) {
      const response = axios.post(
        "https://nexus-link-mail-id-to-wallet-7kxt74l7iq-uc.a.run.app",
        {
          wallet: activeAccountAdress,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken?.state?.accounts[0]?.idToken?.raw}`,
          },
        }
      );
    }
    fetchBalances();
  }, [activeAccountAdress]);

  // mixpanel.identify(`${activeAccount}`);

  // mixpanel.people.set({
  //   $name: "kavish shah",
  //   $email: "kavishshah30@gmail.com",
  //   $address: `${activeAccount}`,
  // });

  // mixpanel.track("page_view");
  const handleGoogleSignIn = () => {
    router.push("/LoginPage");
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setRecipientAddress(value);

    if (value.length > 2) {
      try {
        const id_token = idToken?.state?.accounts[0]?.idToken?.raw;
        const results: string[] = await get_nexus_ids_starting_with(
          id_token,
          value
        );

        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Transfer | NexusPay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center px-4 py-8 sm:py-12 text-center lg:mr-[10px]">
        <h1 className="mb-6 sm:mb-8 mt-4 sm:mt-8 text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
          Transfer <span className="text-white">anywhere</span>
        </h1>

        <div className="w-full max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="0x123... or yourname@nexus"
              className="input input-bordered input-primary w-full pr-20 sm:pr-24 rounded-full text-sm sm:text-base"
              value={recipientAddress}
              onChange={handleInputChange}
            />
            <button
              className="absolute right-0 top-0 bottom-0 btn btn-secondary rounded-r-full flex items-center px-2 sm:px-4 tooltip tooltip-left text-xs sm:text-sm"
              onClick={() => handlePopupOpen()}
              data-tip="Scan QR Code"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              <span className="hidden sm:inline">Scan</span>
            </button>

            {suggestions?.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10 text-left">
                {suggestions?.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                    onClick={() => {
                      setRecipientAddress(suggestion);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
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
              activeAccount={activeAccountAdress}
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
