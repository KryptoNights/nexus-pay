import { useDispatch } from "react-redux";
import { setAuthData } from "@/redux/reducers/authReducer";
import Layout from "@/components/Layout/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { GOOGLE_CLIENT_ID } from "@/core/constants";
import useEphemeralKeyPair from "@/core/useEphemeralKeyPair";
import GoogleLogo from "public/assets/GoogleLogo";

function LoginPage() {
  const dispatch = useDispatch();
  const ephemeralKeyPair = useEphemeralKeyPair();

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  if (typeof window === "undefined") return;

  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:5173
     */
    redirect_uri: `${window.location.origin}/CallbackPage`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  const router = useRouter();
  const openPopup = () => {
    const popup = window.open(redirectUrl, '“popup', 'popup=true');
    if (!popup) {
      alert('Popup blocked! Please allow popups for this site.');
      return;
    }
    if (popup) {
      const checkPopup = setInterval(() => {
        if (popup?.window?.location?.href?.includes('id_token')) {

          let idToken;
          if (popup?.localStorage?.getItem("@aptos-connect/keyless-accounts")) {
            idToken = JSON.parse(popup.localStorage.getItem("@aptos-connect/keyless-accounts"));
            console.log("id", idToken);

            dispatch(setAuthData(idToken));
          } else {
            console.log("No auth data found in localStorage.");
          }

          const fullUrl = popup.window.location.href;
          const url = new URL(fullUrl);
          const path = `${url.pathname}${url.search}${url.hash}`;

          popup.close();

          router.push(path)
          // window.location.replace(popup.window.location.href);
        }
        if (!popup || !popup.closed) return;
        clearInterval(checkPopup);
      }, 1000);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center h-[100%]">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to Nexus Pay</h1>
          <p className="text-lg mb-8">
            Sign in with your Google account to continue
          </p>
          <button
            onClick={openPopup}
            className="w-full flex justify-center items-center border rounded-lg px-8 py-2 hover:bg-gray-100 hover:shadow-sm active:bg-gray-50 active:scale-95 transition-all"
          >
            <GoogleLogo />
            Sign in with Google
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
