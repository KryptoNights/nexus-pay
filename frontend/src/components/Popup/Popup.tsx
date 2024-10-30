import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { collapseAddress } from "@/core/utils";
import {
  setActiveAccountAddress,
  setAuthData,
} from "@/redux/reducers/authReducer";
import { showFailureToast } from "@/utils/notifications";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Popup = ({
  onClose,
  balance,
  handlePopupClose,
  formatBalance,
}: {
  onClose: () => void;
  balance: any;
  handlePopupClose: any;
  formatBalance: any;
}) => {
  const [copyFeedback, setCopyFeedback] = useState("");

  const dispatch = useDispatch();
  const { idToken, activeAccountAdress } = useSelector(
    (state: any) => state.authSlice
  );
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();

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
  const router = useRouter();

  useEffect(() => {
    if (!activeAccount) {
      router.push("/login");
      showFailureToast("Session Expired! Please login again.");
    }
  }, [activeAccount, router]);

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
          <div className="avatar" style={{ width: "6rem", height: "6rem" }}>
            <Image
              src={
                idToken?.state?.accounts[0]?.idToken?.decoded?.picture ??
                "/assets/dp.jpeg"
              }
              width={440}
              height={440}
              alt="Avatar"
              className="mask mask-squircle rounded-full"
            />
          </div>
          <h3 className="font-bold text-lg mt-4">
            {collapseAddress(activeAccountAdress)}
          </h3>
          <p className="text-gray-400">
            {isNaN(balance[1]?.amount)
              ? "0"
              : Number(formatBalance(balance[0]?.amount, 8))}{" "}
            APT
          </p>
          <p className="text-gray-400">
            {isNaN(balance[1]?.amount)
              ? "0"
              : Number(formatBalance(balance[1]?.amount, 6))}{" "}
            USDT
          </p>
          <div className="modal-action flex justify-between w-full mt-6">
            <div className="relative">
              <button
                className="btn btn-outline btn-primary"
                onClick={() => {
                  handleCopy(activeAccountAdress, "Address");
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
              onClick={async () => {
                disconnectKeylessAccount();
                console.log("he");
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
