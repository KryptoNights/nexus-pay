import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { getAddressAsString } from "@/core/utils";
import { setActiveAccountAddress } from "@/redux/reducers/authReducer";
import { showFailureToast } from "@/utils/notifications";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

function CallbackPage() {
  const isLoading = useRef(false);
  const switchKeylessAccount = useKeylessAccounts(
    (state) => state.switchKeylessAccount
  );
  const navigate = useRouter();

  const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
  const idToken = fragmentParams.get("id_token");
  const dispatch = useDispatch();
  const { activeAccount } = useKeylessAccounts();
  useEffect(() => {
    const setData = async () => {
      const address = getAddressAsString(
        activeAccount?.accountAddress.toString()
      );
      console.log(address);
      localStorage.setItem("activeAccount", address);
      await dispatch(setActiveAccountAddress(address));
    };
    setData();
  }, [activeAccount]);

  useEffect(() => {
    // This is a workaround to prevent firing twice due to strict mode
    if (isLoading.current) return;
    isLoading.current = true;

    async function deriveAccount(idToken: string) {
      console.log(idToken);
      try {
        await switchKeylessAccount(idToken);
        console.log("here");
        navigate.push("/dashboard");
      } catch (error) {
        console.log("here", error);
        showFailureToast("Please login again.")
        mixpanel.track("switchKeylessAccount failed", {
          error: error
        })
        navigate.push("/login");
        mixpanel.track("login failed because of switchKeylessAccount failed")
      }
    }

    if (!idToken) {
      navigate.push("/login");
      mixpanel.track("login failed because of idToken not found on callback")
      showFailureToast("Please login again. idToken not found!")
      return;
    }

    deriveAccount(idToken);
  }, [idToken, isLoading, navigate, switchKeylessAccount]);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="relative flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed tracking-wider">
        <span className="absolute flex h-3 w-3 -top-1 -right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Connecting to your wallet
      </div>
    </div>
  );
}

export default CallbackPage;
