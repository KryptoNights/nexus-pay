import React, { useState } from "react";

interface AddFundsModalProps {
  onClose: () => void;
  handleDepositViaCard: () => void;
  activeAccountAdress: string;
}

const AddFundsModal = ({
  onClose,
  handleDepositViaCard,
  activeAccountAdress,
}: AddFundsModalProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USDT");
  const [copyFeedback, setCopyFeedback] = useState("");

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleDepositClick = () => {
    handleDepositViaCard();
  };

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
        <h3 className="font-bold text-lg mb-4 text-center">Add Funds</h3>
        <div className="flex flex-col items-center gap-4">
          {!selectedOption && (
            <div className="flex flex-col items-center gap-4 w-full">
              <button
                onClick={handleDepositClick}
                className="btn btn-primary w-full"
              >
                Deposit via Fiat
              </button>
              <button
                onClick={() => handleOptionSelect("crypto")}
                className="btn btn-secondary w-full"
              >
                Deposit via Crypto Wallet
              </button>
            </div>
          )}

          {selectedOption === "crypto" && (
            <div className="w-full text-sm">
              <p className="text-gray-400 mb-2">
                Select a currency to deposit:
              </p>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="select select-bordered w-full bg-gray-700 text-white mb-4"
              >
                <option value="USDT">USDT</option>
                <option value="APT">APT</option>
              </select>
              <p className="text-gray-400 mb-2">Deposit to this address: (testnet)</p>
              <div className="flex items-center bg-gray-700 p-2 rounded">
                <p className="font-mono flex-grow truncate text-white">
                  {activeAccountAdress}
                </p>
                <button
                  onClick={() => handleCopy(activeAccountAdress, "Address")}
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
          )}
          {copyFeedback === "Address copied!" && (
            <div className="text-sm text-secondary animate-fade-in-out mt-1">
              {copyFeedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFundsModal;
