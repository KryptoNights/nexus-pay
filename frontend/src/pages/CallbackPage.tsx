import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { useRouter } from "next/router";

function CallbackPage() {
  const isLoading = useRef(false);
  const switchKeylessAccount = useKeylessAccounts(
    (state) => state.switchKeylessAccount
  );
  const router = useRouter();
  const [idToken, setIdToken] = useState(null);

  useEffect(() => {
    // This is a workaround to prevent firing twice due to strict mode
    if (isLoading.current) return;
    isLoading.current = true;

    async function deriveAccount(idToken: string) {
      try {
        await switchKeylessAccount(idToken);
        router.push("/HomePage");
      } catch (error) {
        router.push("/");
      }
    }

    if (typeof window !== 'undefined') {
      const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
      const newIdToken = fragmentParams.get("id_token");
      setIdToken(newIdToken);

      if (!newIdToken) {
        router.push("/");
        return;
      }

      deriveAccount(newIdToken);
    }
  }, [idToken, switchKeylessAccount]);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="relative flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed tracking-wider">
        <span className="absolute flex h-3 w-3 -top-1 -right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Redirecting...
      </div>
    </div>
  );
}

export default CallbackPage;
