import { Sidebar } from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import { SidebarProvider } from "@/context/SidebarContext";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useRouter } from "next/router";
import {
  setActiveAccountAddress,
  setAuthData,
  setUserBalance,
} from "@/redux/reducers/authReducer";

interface Props {
  title?: string;
  children?: any;
  className?: string;
}

const Layout = ({ title, children, className }: Props) => {
  const { idToken, activeAccountAdress } = useSelector(
    (state: any) => state.authSlice
  );
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
          localStorage.removeItem("@aptos-connect/keyless-accounts");
          localStorage.removeItem("activeAccount");
          dispatch(setUserBalance(0));
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

  React.useEffect(() => {
    // if active account is  {} push to /login
    if (Object.keys(activeAccountAdress).length === 0) {
      router.push("/login");
    }
  }, [activeAccountAdress]);

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
