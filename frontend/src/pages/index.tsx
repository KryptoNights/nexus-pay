import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const { idToken, activeAccountAdress } = useSelector(
    (state: any) => state.authSlice
  );

  const router = useRouter();
  // React.useEffect(() => {

  // }, [activeAccountAdress]);

  const handleRedirect = () => {
    if (Object.keys(activeAccountAdress).length === 0) {
      router.push("/LoginPage");
    } else {
      router.push("/dashboard");
    }
  };

  const features: string[] = [
    "Scan QR codes for instant payments",
    "Receive funds via your unique QR",
    "Send and receive using Nexus ID",
  ];

  const steps: Array<{
    title: string;
    description: string;
    icon: string;
  }> = [
    {
      title: "1. Sign Up",
      description: "Create your account and get your unique Nexus ID",
      icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
    },
    {
      title: "2. Add Funds",
      description: "Deposit crypto into your NexusPay wallet",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
    {
      title: "3. Start Paying",
      description: "Use NexusPay for your everyday transactions",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  return (
    <>
      <Head>
        <title>NexusPay - Simplify Your Crypto Payments</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="NexusPay - Pay, send, and receive crypto in your everyday life. Simplify your crypto payments with our easy-to-use platform."
        />
        <meta
          property="og:title"
          content="NexusPay - Simplify Your Crypto Payments"
        />
        <meta
          property="og:description"
          content="Pay, send, and receive crypto in your everyday life with NexusPay."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300">
              NexusPay
            </div>
            <div className="space-x-4">
              <button
                className="text-sm py-2 px-6 bg-blue-600 rounded-full font-medium hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg hover:shadow-blue-500/30"
                onClick={handleRedirect}
              >
                Login
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-grow container mx-auto px-6 py-16">
          <header className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-blue-300">
              Crypto Payments Simplified
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Pay, send, and receive crypto in your everyday life with
              unparalleled ease and security
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-10">
              <h2 className="text-3xl md:text-5xl font-semibold mb-8 text-blue-200">
                Features That Empower You
              </h2>
              <ul className="space-y-8">
                {[
                  "Scan QR codes for instant payments",
                  "Receive funds via your unique QR",
                  "Send and receive using Nexus ID",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-lg group">
                    <svg
                      className="w-8 h-8 mr-4 text-green-500 group-hover:text-green-400 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="group-hover:text-blue-300 transition-colors duration-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className="mt-12 py-4 px-10 rounded-full font-semibold bg-blue-600 hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl hover:shadow-blue-500/30 text-lg"
                onClick={() => router.push("/LoginPage")}
              >
                Get Started
              </button>
            </div>
            <div className="relative">
              <div className="bg-gray-700 rounded-3xl shadow-2xl p-6 transform hover:rotate-2 transition-all duration-300 hover:shadow-blue-500/30">
                <Image
                  src="/assets/dashboard_snapshot.png"
                  width={1200}
                  height={600}
                  alt="NexusPay App Interface"
                  className="rounded-2xl object-cover w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-blue-500 text-white rounded-full p-6 shadow-lg animate-bounce">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-32">
            <h2 className="text-4xl md:text-6xl font-semibold text-center mb-20 text-blue-200">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-16">
              {[
                {
                  title: "1. Sign Up",
                  description:
                    "Create your account and get your unique Nexus ID",
                  icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
                },
                {
                  title: "2. Add Funds",
                  description: "Deposit crypto into your NexusPay wallet",
                  icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                },
                {
                  title: "3. Start Paying",
                  description: "Use NexusPay for your everyday transactions",
                  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-2xl p-10 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-gray-600"
                >
                  <div className="bg-blue-600 rounded-full p-6 inline-block mb-8">
                    <svg
                      className="w-12 h-12 text-blue-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={step.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-6 text-blue-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-lg">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-32 bg-gray-700 rounded-3xl p-16 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-blue-200">
              Ready to simplify your crypto payments?
            </h2>
            <button
              className="py-4 px-12 rounded-full font-semibold bg-blue-600 hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-xl shadow-xl hover:shadow-blue-500/30"
              onClick={() => router.push("/LoginPage")}
            >
              Join NexusPay Today
            </button>
          </div>
        </main>

        <footer className="py-16 text-center bg-gray-900">
          <div className="container mx-auto px-6">
            <p className="text-gray-400 mb-8">
              &copy; 2024 NexusPay. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
