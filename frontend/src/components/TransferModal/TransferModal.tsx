import {
  getBalances,
  sendStablePayment,
  testSendMoneyToAccount,
  testSendMoneyToAccountSimulate,
} from "@/core/transactions";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import {
  convertAptToOcta,
  formatBalanceUtils,
  isValidCustomText,
  isValidWalletAddress,
} from "@/core/utils";
import { setUserBalance } from "@/redux/reducers/authReducer";
import mixpanel from "mixpanel-browser";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TransferModal = ({
  onClose,
  balance,
  transferAmount,
  setTransferAmount,
  setTransferError,
  recipientAddress,
  transferError,
  paymentviaDynamicQR,
}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [simulationIsLoading, setSimulationIsLoading] = useState(false);
  const [conversionRate, setConversionRate] = useState(0);
  const [usdtDeducted, setUSDTDeducted] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [estimateGasFee, setEstimateGasFee] = useState(0);
  const [isApt, setIsApt] = useState(false); // New state for currency toggle
  const { activeAccount } = useKeylessAccounts();
  const dispatch = useDispatch();
  const { activeAccountAdress } = useSelector((state: any) => state.authSlice);

  const handleTransferAmountChange = (e: any) => {  
    const amount = e.target.value;
    setTransferAmount(amount);
    console.log(amount);
    // const showInsufficientBalanceMessage =
    //   parseFloat(amount) >
    //   (isApt
    //     ? Number(formatBalanceUtils(balance[0]?.amount, 8))
    //     : Number(formatBalanceUtils(balance[1]?.amount, 6)));

    // if (showInsufficientBalanceMessage) {
    //   setTransferError("Insufficient balance");
    // }
    // else {
    //   setTransferError("");
    // }
  };

  const handleCurrencyToggle = () => {
    setIsApt(!isApt);
    setTransferAmount("");
  };

  const getEquivalentValue = (amount: number) => {
    console.log(conversionRate);
    if (isNaN(amount) || amount < 0) return 0;
    return isApt ? amount * conversionRate : amount / conversionRate;
  };

  const sendMoney = async (recipientAddress: any) => {
    mixpanel.track("send_money_initiated");
    setIsLoading(true);
    try {
      if (!recipientAddress) {
        throw new Error("Active account is not provided.");
      }

      const getBalancesResponse = await getBalances(activeAccountAdress);
      dispatch(setUserBalance(getBalancesResponse));

      const transactionHash = await testSendMoneyToAccount(
        recipientAddress,
        activeAccount!,
        convertAptToOcta(transferAmount),
        "0x1::aptos_coin::AptosCoin"
      );

      setIsSuccess(true);
      mixpanel.track("successful_transaction");
    } catch (error) {
      console.error("Failed to send money:", error);
      setTransferError("Transaction failed. Please try again.");
      mixpanel.track("failed to send money", {
        error: error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // THIS IS JUST A SAMPLE EXAMPLE // NEEDS TO BE COMMENTED OUT
  const sendStableMoney = async (recipientAddress: any) => {
    mixpanel.track("send_stable_money_initiated");
    setIsLoading(true);
    try {
      if (!recipientAddress) {
        throw new Error("Active account is not provided.");
      }

      const hash = await sendStablePayment(
        recipientAddress,
        transferAmount,
        activeAccount!,
        true
      );
      if (typeof hash === "string") {
        console.log("tx has executed", hash);
      } else if (typeof hash === "object") {
        console.log(
          "tx has only simulated",
          hash.apt_deducted,
          hash.usdt_deducted,
          hash.usdt_per_apt,
          hash.gas_used
        );
      }
      setIsSuccess(true);
      console.log(hash);
    } catch (error) {
      console.error("Failed to send money:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // ENDS HERE

  const sendMoneySimulalte = async (recipientAddress: any) => {
    setSimulationIsLoading(true);
    try {
      if (!recipientAddress) {
        throw new Error("Active account is not provided.");
      }
      const getBalancesResponse = await getBalances(activeAccountAdress);
      dispatch(setUserBalance(getBalancesResponse));

      if (isApt) {
        const hash = await testSendMoneyToAccountSimulate(
          recipientAddress,
          activeAccount!,
          convertAptToOcta(transferAmount),
          "0x1::aptos_coin::AptosCoin"
        );
        // console.log(JSON.parse(hash));
        setEstimateGasFee(Number(JSON.parse(hash).max_gas_amount));
      } else {
        const hash: any = await sendStablePayment(
          recipientAddress,
          transferAmount,
          activeAccount!,
          true
        );
        console.log("transactionHash", hash);
        setEstimateGasFee(hash.gas_used);
        if (Number(hash.usdt_per_apt) != 0) {
          setConversionRate(hash.usdt_per_apt);
        } else {
          setConversionRate(0);
        }
        if (Number(hash.usdt_deducted) != 0) {
          setUSDTDeducted(hash.usdt_deducted);
        } else {
          setUSDTDeducted(0);
        }
      }

      setSimulationIsLoading(false);
    } catch (error) {
      console.error("Failed to send money:", error);
      setTransferError("sendMoneySimulalte failed. Please try again.");
    } finally {
      setSimulationIsLoading(false);
    }
  };

  const sendMoneyDebounced = async (recipientAddress: any) => {
    await sendMoneySimulalte(recipientAddress);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (transferAmount) {
        sendMoneyDebounced(recipientAddress);
      }
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [transferAmount, recipientAddress]); // Dependencies for useEffect

  const isTransferDisabled =
    transferError !== "" ||
    transferAmount === "" ||
    parseFloat(transferAmount) <= 0 ||
    // parseFloat(transferAmount) >
    //   (isApt
    //     ? Number(formatBalanceUtils(balance[0]?.amount, 8))
    //     : Number(formatBalanceUtils(balance[1]?.amount, 6))) ||
    simulationIsLoading ||
    isLoading ||
    !recipientAddress ||
    !(
      !isValidWalletAddress(recipientAddress) ||
      !isValidCustomText(recipientAddress)
    );

  const formatBalance = (amount: number, decimals: number = 6) => {
    return (amount / 1e8).toFixed(decimals);
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
        <h3 className="font-bold text-lg mb-4">Transfer APT</h3>
        <div className="flex flex-col items-center gap-4">
          {/* Show recipient address and gas fees */}
          {recipientAddress && (
            <div className="flex-col gap-4 items-center w-full">
              <h4 className="font-bold text-lg mb-3 text-left w-full">
                Recipient:
              </h4>
              <input
                type=""
                placeholder="Receipient"
                className="input input-bordered input-primary w-full"
                value={recipientAddress}
                disabled={true}
              />
            </div>
          )}
          <h4 className="font-bold text-lg mb-0 text-left w-full">
            Select Amount
          </h4>{" "}
          <div className="w-full relative flex items-center justify-between">
            <select
              value={isApt ? "APT" : "USD"}
              onChange={(e) => setIsApt(e.target.value === "APT")}
              className="select select-bordered w-3/8"
            >
              <option value="USD">USD</option>
              <option value="APT">APT</option>
            </select>
            <input
              type="text"
              inputMode="numeric"
              placeholder={`Enter amount in ${isApt ? "APT" : "USD"}`}
              className="input input-bordered input-primary w-full text-left ml-2"
              value={transferAmount}
              onChange={handleTransferAmountChange}
              disabled={
                isLoading ||
                isSuccess ||
                paymentviaDynamicQR ||
                simulationIsLoading
              }
            />
          </div>
          {transferAmount != 0 && (
            <>
              {simulationIsLoading ? (
                <>
                  <div className="text-sm mt-2 w-full border border-gray-600 rounded-lg p-4 bg-gray-700 flex-col">
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-md text-left font-bold">
                        Simulating Response
                      </span>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm mt-2 w-full border border-gray-600 rounded-lg p-4 bg-gray-700 flex-col">
                  {!isApt && conversionRate != 0 && (
                    <div className="flex flex-row justify-between w-full">
                      <div>{!isApt ? "1 USD :" : "1 APT :"} </div>
                      <div className="font-bold">
                        {!isApt
                          ? getEquivalentValue(1).toFixed(3) + " APT"
                          : getEquivalentValue(1).toFixed(3) + " USD"}
                      </div>
                    </div>
                  )}
                  {!isApt && conversionRate != 0 && (
                    <div className="flex flex-row justify-between w-full">
                      <p>Amount Deducted:</p>
                      <p>
                        <span className="font-bold">
                          {" "}
                          {getEquivalentValue(
                            parseFloat(transferAmount)
                          ).toFixed(3)}{" "}
                        </span>
                        <span className="font-bold">
                          {isApt ? "USD" : "APT"}
                        </span>
                      </p>
                    </div>
                  )}
                  {!isApt && usdtDeducted != 0 && (
                    <div className="flex flex-row justify-between w-full">
                      <p>Amount Deducted:</p>
                      <p>
                        <span className="font-bold"> {usdtDeducted} </span>
                        <span className="font-bold">
                          {isApt ? "USD" : "USD"}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="flex flex-row justify-between w-full">
                    <p>Estimated Gas Fees:</p>
                    <p>
                      <span className="font-bold">
                        {Number(estimateGasFee / 1e8).toFixed(5)}{" "}
                        {isApt ? "APT" : "APT"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {transferError && (
            <p className="text-error text-sm mt-1">{transferError}</p>
          )}
          {/* Move balance display here */}
          <p className="text-sm">
            Balance: {formatBalance(balance[0]?.amount)} APT
          </p>
          {!recipientAddress && (
            <p className="text-sm text-red-500">
              Please enter address or Nexus id
            </p>
          )}
          {isSuccess ? (
            <div className="text-green-500 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Transaction Successful!
            </div>
          ) : (
            <button
              className="btn btn-primary w-full"
              // onClick={() => sendMoney(recipientAddress)}
              onClick={() =>
                isApt
                  ? sendMoney(recipientAddress)
                  : sendStableMoney(recipientAddress)
              }
              disabled={isTransferDisabled}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Send"
              )}
            </button>
          )}
          {/* THIS IS JUST A SAMPLE EXAMPLE // NEEDS TO BE COMMENTED OUT */}
          {/* <button
            className="btn btn-primary w-full"
            onClick={() => sendStableMoney(recipientAddress)}
          >
            Send Stable
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
