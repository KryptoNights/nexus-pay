import { testSendMoneyToAccount } from "@/core/transactions";
import { useSelector } from "react-redux";

const TransferModal = ({
  onClose,
  balance,
  setRecipientAddress,
  transferAmount,
  setTransferAmount,
  setTransferError,
  recipientAddress,
  transferError,
}: any) => {
  const { activeAccount } = useSelector((state: any) => state.authSlice);

  const handleTransferAmountChange = (e: any) => {
    const amount = e.target.value;
    setTransferAmount(amount);

    if (parseFloat(amount) > balance) {
      setTransferError("Insufficient balance");
    } else {
      setTransferError("");
    }
  };

  const sendMoney = async (recipientAddress: any) => {
    try {
      if (!recipientAddress) {
        throw new Error("Active account is not provided.");
      }

      const transactionHash = await testSendMoneyToAccount(
        recipientAddress,
        activeAccount!
      );

      console.log(`Transaction successful: ${transactionHash}`);
    } catch (error) {
      console.error("Failed to send money:", error);

      // if (error.message.includes("insufficient funds")) {
      //   console.error("Error: Insufficient funds.");
      // } else if (error.message.includes("network")) {
      //   console.error("Error: Network issue. Please try again.");
      // }

      return null;
    }
  };

  const isTransferDisabled =
    transferError !== "" ||
    transferAmount === "" ||
    parseFloat(transferAmount) <= 0;

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
          <div className="w-full">
            <input
              type="number"
              placeholder="Enter amount of APT"
              className="input input-bordered input-primary w-full"
              value={transferAmount}
              onChange={handleTransferAmountChange}
            />
            {transferError && (
              <p className="text-error text-sm mt-1">{transferError}</p>
            )}
          </div>
          <p className="text-sm">Balance: {balance} APT</p>
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              sendMoney(recipientAddress);
            }}
            disabled={isTransferDisabled}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
