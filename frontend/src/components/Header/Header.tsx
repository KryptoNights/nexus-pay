"use client";

import SidebarToggle from "@/components/Header/SidebarToggle";
import { getBalances } from "@/core/transactions";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { collapseAddress, divideByTenMillion } from "@/core/utils";
import { setActiveAccount, setAuthData } from "@/redux/reducers/authReducer";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import dynamic from "next/dynamic";
import Image from "next/image";
import DropdownIcon from "public/assets/svgs/DropdownIcon";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../Popup/Popup";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { disconnectKeylessAccount } = useKeylessAccounts();
  const [balance, setBalance] = useState(0);
  const { idToken, activeAccount } = useSelector(
    (state: any) => state.authSlice
  );
  const dispatch = useDispatch();

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (activeAccount) {
        const getBalancesResponse = await getBalances(activeAccount);
        setBalance(divideByTenMillion(getBalancesResponse[0]?.amount));
      }
    };
    if (activeAccount.length > 0) {
      fetchBalances();
    }
  }, [activeAccount]);

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
          {activeAccount.length > 0 ? (
            <button
              onClick={handlePopupOpen}
              className="text-white btn btn-primary p-0 m-3 bg-[rgb(0,0,0)] rounded-xl hover:bg-transparent"
            >
              <div className="block pt-[8px] pr-[8px] pb-[8px] pl-[12px]">
                {balance} APT
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
                    {collapseAddress(activeAccount ?? activeAccount)}
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
      {isPopupOpen && (
        <Popup
          onClose={handlePopupClose}
          balance={balance}
          handlePopupClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default Header;
