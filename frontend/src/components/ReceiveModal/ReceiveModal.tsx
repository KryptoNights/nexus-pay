import React from "react";
import { useState } from "react";
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
  const [amount, setAmount] = useState("");
  const [qrString, setQrString] = useState("");

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

  React.useEffect(() => {
    let actualAmount = amount;
    const baseUrl = `https://nexuspay.vercel.app/dashboard?address=${activeAccount}&amount=${actualAmount}`;
    setQrString(baseUrl);
  }, [activeAccount, amount]);

  console.log(qrString);

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
            <QRCode value={qrString} size={200} />
          </div>
          <div className="text-sm w-full">
            <p>Amount :</p>
            <div className="flex items-center bg-gray-700 rounded">
              <input
                type="number"
                className="bg-gray-700 rounded w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
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

export default ReceiveModal;
