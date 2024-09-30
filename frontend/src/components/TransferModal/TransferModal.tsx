import { useState } from "react";
import {
  getBalances,
  testSendMoneyToAccount,
  sendStablePayment,
} from "@/core/transactions";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { useDispatch, useSelector } from "react-redux";
import {
  convertAptToOcta,
  convertOctaToApt,
  isValidCustomText,
  isValidWalletAddress,
} from "@/core/utils";
import { setUserBalance } from "@/redux/reducers/authReducer";
import mixpanel from "mixpanel-browser";

const TransferModal = ({
  onClose,
  balance,
  setRecipientAddress,
  transferAmount,
  setTransferAmount,
  setTransferError,
  recipientAddress,
  transferError,
  paymentviaDynamicQR,
}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isApt, setIsApt] = useState(true); // New state for currency toggle
  const { activeAccount } = useKeylessAccounts();
  const dispatch = useDispatch();
  const { idToken, activeAccountAdress } = useSelector(
    (state: any) => state.authSlice
  );

  // console.log(activeAccountAdress);

  const handleTransferAmountChange = (e: any) => {
    const amount = e.target.value;
    setTransferAmount(amount);

    if (parseFloat(amount) > balance[0]?.amount) {
      setTransferError("Insufficient balance");
    } else {
      setTransferError("");
    }
  };

  const handleCurrencyToggle = () => {
    setIsApt(!isApt);
    setTransferAmount("");
  };

  const getEquivalentValue = (amount: number) => {
    const conversionRate = 7.99;
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
    try {
      if (!recipientAddress) {
        throw new Error("Active account is not provided.");
      }

      const hash = await sendStablePayment(
        recipientAddress,
        transferAmount,
        activeAccount!
      );
      console.log(hash);
    } catch (error) {
      console.error("Failed to send money:", error);
    }
  };
  // ENDS HERE

  const isTransferDisabled =
    transferError !== "" ||
    transferAmount === "" ||
    parseFloat(transferAmount) <= 0 ||
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
              <p className="text-md text-white text-left mb-2">Recipient:</p>
              <input
                type=""
                placeholder="Receipient"
                className="input input-bordered input-primary w-full"
                value={recipientAddress}
                disabled={true}
              />
            </div>
          )}

          <div className="flex items-center justify-between w-full">
            <label className="text-sm">
              {isApt ? "Switch to USDT" : "Switch to APT"}
            </label>
            <input
              type="checkbox"
              checked={!isApt}
              onChange={handleCurrencyToggle}
              className={`toggle ${!isApt ? "toggle-primary" : "toggle-secondary"}`} // Updated class for color change
            />
          </div>
          <div className="w-full relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder={`Enter amount of ${isApt ? "APT" : "USDT"}`}
              className="input input-bordered input-primary w-full text-left"
              value={transferAmount}
              onChange={handleTransferAmountChange}
              disabled={isLoading || isSuccess || paymentviaDynamicQR}
            />
            <span className="absolute right-3 top-2 text-gray-500 border-l pl-2">
              {" "}
              {getEquivalentValue(parseFloat(transferAmount)).toFixed(2)}{" "}
              {isApt ? "USDT" : "APT"}
            </span>
          </div>
          {transferError && (
            <p className="text-error text-sm mt-1">{transferError}</p>
          )}
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
              onClick={() => sendMoney(recipientAddress)}
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
          <button
            className="btn btn-primary w-full"
            onClick={() => sendStableMoney(recipientAddress)}
          >
            Send Stable
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
