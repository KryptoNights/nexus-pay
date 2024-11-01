"use client";

import { setAuthData } from "@/redux/reducers/authReducer";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import GoogleLogo from "../../../public/assets/GoogleLogo";
import { GOOGLE_CLIENT_ID } from "../../core/constants";
import useEphemeralKeyPair from "../../core/useEphemeralKeyPair";
import { useEffect } from "react";

function LoginPage() {
  const dispatch = useDispatch();
  // console.log(GOOGLE_CLIENT_ID);
  const ephemeralKeyPair = useEphemeralKeyPair();

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

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

  useEffect(() => {
    mixpanel.track("login_page_load");
  }, []);

  return (
    <>
      <Head>
        <title>Login | NexusPay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl">
          <div className="text-center">
            <Image
              src="/assets/logo.jpeg"
              alt="NexusPay Logo"
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-full border-black"
            />
            <h1 className="text-3xl font-bold text-white">
              Welcome to NexusPay
            </h1>
            <p className="mt-2 text-gray-400">Secure payments, simplified.</p>
          </div>

          <div className="mt-8 space-y-6">
            <a
              href={redirectUrl.toString()}
              onClick={() => mixpanel.track("login_initiated")}
              className="w-full flex items-center justify-center px-4 py-3 space-x-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 ease-in-out"
            >
              <div className="w-6 h-6">
                <GoogleLogo />
              </div>
              <span className="font-medium">Sign in with Google</span>
            </a>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              By signing in, you agree to our{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
