import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { collapseAddress } from "@/core/utils";
import { setActiveAccount, setAuthData } from "@/redux/reducers/authReducer";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Popup = ({
  onClose,
  balance,
  handlePopupClose,
}: {
  onClose: () => void;
  balance: any;
  handlePopupClose: any;
}) => {
  const [copyFeedback, setCopyFeedback] = useState("");

  const dispatch = useDispatch();
  const { idToken, activeAccount } = useSelector(
    (state: any) => state.authSlice
  );
  const { disconnectKeylessAccount } = useKeylessAccounts();

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
      id="modal"
      className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div className="modal-box bg-gray-800 text-white max-w-sm relative p-6">
        <button
          id="closeBtn"
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <div className="avatar">
            <div className="w-24 rounded-full bg-pink-300 p-2">
              <Image
                src={
                  idToken?.state?.accounts[0]?.idToken?.decoded?.picture ?? ""
                }
                width={240}
                height={240}
                alt="Avatar"
                className="mask mask-squircle"
              />
            </div>
          </div>
          <h3 className="font-bold text-lg mt-4">
            {collapseAddress(activeAccount)}
          </h3>
          <p className="text-gray-400">{balance} APT</p>
          <div className="modal-action flex justify-between w-full mt-6">
            <div className="relative">
              <button
                className="btn btn-outline btn-primary"
                onClick={() => {
                  handleCopy(activeAccount, "Address");
                }}
              >
                Copy Address
              </button>
              {copyFeedback && (
                <div className="absolute -bottom-6 left-0 right-0 text-center text-sm text-secondary animate-fade-in-out">
                  {copyFeedback}
                </div>
              )}
            </div>
            <button
              className="btn btn-outline btn-secondary"
              onClick={() => {
                disconnectKeylessAccount();
                dispatch(setAuthData({}));
                dispatch(setActiveAccount({}));
                localStorage.removeItem("activeAccount");
                handlePopupClose();
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
