import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const ReceiveModal = ({
  onClose,
  activeAccount,
  selfNexusId,
}: {
  onClose: () => void;
  activeAccount: any;
  selfNexusId: any;
}) => {
  const nexusId = selfNexusId || "Can't find Nexus ID";
  const [copyFeedback, setCopyFeedback] = useState("");
  const [amount, setAmount] = useState<string>(""); // Initialize as an empty string
  const [qrString, setQrString] = useState("");
  const [currency, setCurrency] = useState<string>("APT"); // Currency selector state

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

  useEffect(() => {
    const actualAmount = amount || ""; // Ensure amount is a valid string for URL
    const baseUrl = `https://nexuspay.vercel.app/dashboard/?address=${activeAccount}&amount=${actualAmount}`;
    setQrString(baseUrl);
  }, [activeAccount, amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*\.?\d*$/.test(newValue)) {
      // Allow only numbers and one decimal point
      setAmount(newValue);
    }
  };

  const clearAmount = () => setAmount("");

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
          <div className="relative p-[5px] bg-white">
            {/* QR generator */}
            <QRCode value={qrString} size={200} />
          </div>
          <div className="text-sm w-full">
            <p>Amount :</p>
            <div className="flex items-center bg-gray-700 rounded relative">
              <input
                type="number"
                className="bg-gray-700 rounded w-full pr-10"
                value={amount}
                onChange={handleAmountChange}
                placeholder={`Enter amount to receive in ${currency}`}
              />
              {amount && (
                <button
                  onClick={clearAmount}
                  className="absolute right-3 text-gray-500 hover:text-gray-300"
                  title="Clear amount"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              {/* Quick amount buttons */}
              {[5, 10, 20].map((amt) => (
                <button
                  key={amt}
                  // className="btn btn-xs bg-primary hover:bg-primary-focus"
                  className="btn btn-xs border-primary bg-transparent text-white"
                  onClick={() => setAmount(String(amt))}
                >
                  {amt} {currency}
                </button>
              ))}
            </div>
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
            {copyFeedback === "Address copied!" && (
              <div className="text-sm text-secondary animate-fade-in-out mt-1">
                {copyFeedback}
              </div>
            )}
          </div>
          <div className="text-sm w-full">
            <p>Or use your Nexus username:</p>
            <div className="flex items-center bg-gray-700 p-2 rounded">
              <p className="font-mono flex-grow">{nexusId}</p>
              <button
                onClick={() => handleCopy(nexusId, "Username")}
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
            {copyFeedback === "Username copied!" && (
              <div className="text-sm text-secondary animate-fade-in-out mt-1">
                {copyFeedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveModal;
