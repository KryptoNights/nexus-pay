import Header from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import {
  setActiveAccountAddress,
  setAuthData,
  setUserBalance,
} from "@/redux/reducers/authReducer";
import { showFailureToast } from "@/utils/notifications";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  title?: string;
  children?: any;
  className?: string;
}

const Layout = ({ title, children, className }: Props) => {
  const { idToken } = useSelector((state: any) => state.authSlice);
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();
  const router = useRouter();
  const dispatch = useDispatch();
  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("Failed to parse JWT:", e);
      return null;
    }
  };
  React.useEffect(() => {
    const checkIfExpired = () => {
      const JwtToken = idToken?.state?.accounts[0]?.idToken.raw;
      if (JwtToken) {
        const expirationSec = parseJwt(JwtToken)?.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        if (expirationSec < currentTime) {
          console.log("Session Expired");
          disconnectKeylessAccount();
          showFailureToast("Session Expired! Please login again.");
          dispatch(setUserBalance({}));
          dispatch(setAuthData({}));
          dispatch(setActiveAccountAddress(""));
        }
      }
    };

    checkIfExpired();

    const intervalId = setInterval(() => {
      checkIfExpired();
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    let idToken;
    const storedToken = localStorage.getItem("@aptos-connect/keyless-accounts");
    if (storedToken) {
      idToken = JSON.parse(storedToken);
      dispatch(setAuthData(idToken));
    }
  }, []);

  useEffect(() => {
    if (!activeAccount) {
      router.push("/login");
      // showFailureToast("Session Expired! Please login again.");
    }
  }, [activeAccount, router]);

  return (
    <SidebarProvider>
      <div className={clsx(className, "bg-[#0D0D0D]")}>
        <Sidebar>
          <div className="flex min-h-screen flex-col">
            <Header title={title} />
            <div className="mx-4 mb-4 block flex-grow ">{children}</div>
          </div>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
