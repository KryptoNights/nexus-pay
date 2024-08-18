import SidebarToggle from "@/components/Header/SidebarToggle";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { collapseAddress } from "@/core/utils";
import { setActiveAccount, setAuthData } from "@/redux/reducers/authReducer";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import dynamic from "next/dynamic";
import Image from "next/image";
import DropdownIcon from "public/assets/svgs/DropdownIcon";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { disconnectKeylessAccount } = useKeylessAccounts();
  const { idToken, activeAccount } = useSelector(
    (state: any) => state.authSlice
  );
  const dispatch = useDispatch();
  console.log(activeAccount);

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const Popup = ({ onClose }: { onClose: () => void }) => {
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
              {collapseAddress(activeAccount ? activeAccount : "0x1234")}
            </h3>
            <p className="text-gray-400">0 ETH</p>
            <div className="modal-action flex justify-between w-full mt-6">
              <button className="btn btn-outline btn-primary">
                Copy Address
              </button>
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

  return (
    <div className="navbar sticky top-0 z-50 bg-base-200 bg-opacity-30 p-4">
      <div className="flex flex-grow justify-between gap-3">
        <div className="flex flex-row gap-3">
          <div className="flex lg:hidden">
            <SidebarToggle />
          </div>
          <div className="flex flex-auto items-center">
            <h1 className="text-md align-middle font-bold leading-none text-primary sm:text-2xl">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex flex-auto items-center justify-end gap-3">
          {idToken ? (
            <button
              onClick={handlePopupOpen}
              className="text-white btn btn-primary p-0 m-3 bg-[rgb(0,0,0)] rounded-xl hover:bg-transparent"
            >
              <div className="block pt-[8px] pr-[8px] pb-[8px] pl-[12px]">
                0 ETH
              </div>
              <div className="bg-custom-gradient pt-[6px] pr-[8px] pl-[8px] pb-[8px] font-bold rounded-xl flex items-center h-[100%]">
                <div className="gap-[6px] flex items-center">
                  <div className="rounded-xl">
                    <Image
                      src={
                        idToken?.state?.accounts[0]?.idToken?.decoded
                          ?.picture ?? ""
                      }
                      width={24}
                      height={24}
                      alt="profile"
                      className="rounded-xl"
                    />
                  </div>
                  <div style={{ textTransform: "none" }}>
                    {collapseAddress(activeAccount ? activeAccount : "0x1234")}
                  </div>
                  <DropdownIcon />
                </div>
              </div>
            </button>
          ) : (
            <button>hi</button>
          )}
        </div>
      </div>
      {isPopupOpen && <Popup onClose={handlePopupClose} />}
    </div>
  );
};

export default Header;
