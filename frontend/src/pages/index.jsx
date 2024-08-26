import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';

const LandingPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>NexusPay - Simplify Your Crypto Payments</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="NexusPay - Pay, send, and receive crypto in your everyday life. Simplify your crypto payments with our easy-to-use platform." />
        <meta property="og:title" content="NexusPay - Simplify Your Crypto Payments" />
        <meta property="og:description" content="Pay, send, and receive crypto in your everyday life with NexusPay." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white flex flex-col">
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-3xl font-bold text-purple-400 hover:text-purple-300 transition-colors duration-300">NexusPay</div>
          <div className="space-x-4">
            <button
              className="text-sm py-2 px-4 bg-purple-600 rounded-full font-medium hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              onClick={() => router.push("/LoginPage")}
            >
              Login
            </button>
          </div>
        </nav>

        <main className="flex-grow container mx-auto px-6 py-16">
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Crypto Payments Simplified
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Pay, send, and receive crypto in your everyday life with ease and security
            </p>
          </header>

          {/* Improved grid layout for better responsiveness */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                Features That Empower You
              </h2>
              <ul className="space-y-6">
                {[
                  'Scan QR codes for instant payments',
                  'Receive funds via your unique QR',
                  'Send and receive using Nexus ID',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-lg">
                    <svg
                      className="w-6 h-6 mr-4 text-green-400"
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
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="mt-8 py-3 px-8 rounded-full font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                onClick={() => router.push("/SignupPage")}
              >
                Get Started
              </button>
            </div>
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl shadow-2xl p-4 transform hover:rotate-2 transition-all duration-300 hover:shadow-purple-500/30">
                <Image
                  src="/assets/dashboard_snapshot.png"
                  width={1200}
                  height={600}
                  alt="NexusPay App Interface"
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-gray-900 rounded-full p-4 shadow-lg animate-bounce">
                <svg
                  className="w-8 h-8"
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

          <div className="mb-24">
            <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: '1. Sign Up',
                  description: 'Create your account and get your unique Nexus ID',
                  icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
                },
                {
                  title: '2. Add Funds',
                  description: 'Deposit crypto into your NexusPay wallet',
                  icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
                },
                {
                  title: '3. Start Paying',
                  description: 'Use NexusPay for your everyday transactions',
                  icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="bg-purple-700 rounded-full p-4 inline-block mb-6">
                    <svg
                      className="w-10 h-10 text-purple-300"
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
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-400 text-lg">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to simplify your crypto payments?</h2>
            <button
              className="py-4 px-10 rounded-full font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-lg"
              onClick={() => router.push("/LoginPage")}
            >
              Join NexusPay Today
            </button>
          </div>
        </main>

        <footer className="py-12 text-center bg-gray-800">
          <div className="container mx-auto px-6">
            <p className="text-gray-400 mb-4">&copy; 2024 NexusPay. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
