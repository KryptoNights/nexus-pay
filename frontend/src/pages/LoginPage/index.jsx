import { GOOGLE_CLIENT_ID } from "../../core/constants";
import useEphemeralKeyPair from "../../core/useEphemeralKeyPair";
import GoogleLogo from "../../../public/assets/GoogleLogo";
import { useDispatch } from "react-redux";
import { setAuthData } from "@/redux/reducers/authReducer";
import Layout from "@/components/Layout/Layout";
import Head from "next/head";
import { useRouter } from "next/router";

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
    // <Layout>
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">
            Welcome to NexusPay
          </h1>
          <p className="text-gray-400 mb-6 text-center">
            Sign in with your Google account to continue
          </p>
          <button
            onClick={openPopup}
            className="w-full flex items-center justify-center bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-600 hover:shadow-md transition-all duration-200 ease-in-out"
          >
            <GoogleLogo className="w-6 h-6 mr-2" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </>
    // </Layout>
  );
}

export default LoginPage;
