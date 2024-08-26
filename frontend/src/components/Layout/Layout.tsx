import { Sidebar } from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import { SidebarProvider } from "@/context/SidebarContext";
import clsx from "clsx";
import { useSelector } from "react-redux";
import React from "react";
import { useRouter } from "next/router";

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
  React.useEffect(() => {
    // if active account is  {} push to /LoginPage
    if (Object.keys(activeAccountAdress).length === 0) {
      console.log(activeAccountAdress);
      router.push("/LoginPage");
    }
  }, [activeAccountAdress]);

  return (
    <SidebarProvider>
      <div className={clsx(className, "bg-base-200")}>
        <Sidebar>
          <div className="flex min-h-screen flex-col">
            <Header title={title} />
            <div className="mx-4 mb-4 block flex-grow">{children}</div>
          </div>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
