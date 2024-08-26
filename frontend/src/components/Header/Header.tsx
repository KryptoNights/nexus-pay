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
import { TransakConfig, Transak } from '@transak/transak-sdk';

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

  const handleAddFunds = (wallet: string, email: string) => {
    const transakConfig: TransakConfig = {
      apiKey: '563eea58-1a53-4237-9ce2-949187d72a23', // (Required)
      environment: Transak.ENVIRONMENTS.STAGING, // (Required)
      defaultNetwork: 'aptos',
      cryptoCurrencyList: 'APT',
      walletAddress: wallet,
      colorMode: 'DARK',
      defaultFiatCurrency: 'USD',
      defaultFiatAmount: 100,
      cryptoCurrencyCode: 'APT',
      disableWalletAddressForm: true,
      email: email,
    };
    const transak = new Transak(transakConfig);

    transak.init();

    // To get all the events
    Transak.on('*', (data) => {
      console.log(data);
    });

    // This will trigger when the user closed the widget
    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      console.log('Transak SDK closed!');
    });

    /*
    * This will trigger when the user has confirmed the order
    * This doesn't guarantee that payment has completed in all scenarios
    * If you want to close/navigate away, use the TRANSAK_ORDER_SUCCESSFUL event
    */
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
      console.log(orderData);
    });

    /*
    * This will trigger when the user marks payment is made
    * You can close/navigate away at this event
    */
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      transak.close();
    });

    return () => {
      transak.close();
    };
  }

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
    <div className="navbar sticky top-0 z-50 bg-base-200 bg-opacity-30 p-2 sm:p-4">
      <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <div className="flex lg:hidden">
              <SidebarToggle />
            </div>
            <h1 className="text-sm sm:text-md md:text-lg lg:text-2xl font-bold text-primary truncate">
              {title}
            </h1>
          </div>
          <div className="sm:hidden">
            {activeAccount.length > 0 && (
              <button
                onClick={handlePopupOpen}
                className="btn btn-circle btn-ghost btn-sm"
              >
                <Image
                  src={idToken?.state?.accounts[0]?.idToken?.decoded?.picture ?? ""}
                  width={24}
                  height={24}
                  alt="profile"
                  className="rounded-full"
                />
              </button>
            )}
          </div>
        </div>
        <div className="hidden sm:flex items-center justify-end mt-2 sm:mt-0">
          {activeAccount.length > 0 && idToken?.state?.accounts[0]?.idToken?.decoded?.email ? (
            <button
              onClick={() => handleAddFunds(activeAccount, idToken?.state?.accounts[0]?.idToken?.decoded?.email)}
              className="btn btn-primary p-0 bg-[rgb(0,0,0)] rounded-xl hover:bg-transparent"
            >
              <div className="hidden sm:block pt-[8px] pr-[8px] pb-[8px] pl-[12px]">
                + Add Funds
              </div>
            </button>
          ) : (
            <button></button>
          )}
          {activeAccount.length > 0 ? (
            <button
              onClick={handlePopupOpen}
              className="text-white btn btn-primary p-0 bg-[rgb(0,0,0)] rounded-xl hover:bg-transparent ml-2"
            >
              <div className="hidden sm:block pt-[8px] pr-[8px] pb-[8px] pl-[12px]">
                {balance} APT
              </div>
              <div className="bg-custom-gradient pt-[6px] pr-[8px] pl-[8px] pb-[8px] font-bold rounded-xl flex items-center h-[100%]">
                <div className="gap-[6px] flex items-center">
                  <div className="rounded-xl">
                    <Image
                      src={idToken?.state?.accounts[0]?.idToken?.decoded?.picture ?? ""}
                      width={24}
                      height={24}
                      alt="profile"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="hidden sm:block" style={{ textTransform: "none" }}>
                    {collapseAddress(activeAccount ?? activeAccount)}
                  </div>
                  <DropdownIcon />
                </div>
              </div>
            </button>
          ) : (
            <button></button>
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