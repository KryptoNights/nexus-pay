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
      </Head>

      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-3xl font-bold text-purple-500">NexusPay</div>
          <div>
            <button
              className="text-sm py-2 px-4 bg-purple-600 rounded-full font-medium hover:bg-purple-700 transition duration-300"
              onClick={() => router.push("/LoginPage")}
            >
              Login
            </button>
          </div>
        </nav>

        <main className="flex-grow container mx-auto px-6 py-16">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Crypto Payments Simplified
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Pay, send, and receive crypto in your everyday life
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                Features That Empower You
              </h2>
              <ul className="space-y-4">
                {[
                  'Scan QR codes for instant payments',
                  'Receive funds via your unique QR',
                  'Send and receive using Nexus ID',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 text-green-500"
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
                className="mt-8 py-3 px-6 rounded-full font-semibold bg-purple-600 hover:bg-purple-700 transition duration-300"
                onClick={() => router.push("/LoginPage")}
              >
                Get Started
              </button>
            </div>
            <div className="relative">
              <div className="bg-gray-800 rounded-lg shadow-xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/dashboard_snapshot.png"
                  width={1200}
                  height={600}
                  alt="NexusPay App Interface"
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-yellow-500 text-gray-900 rounded-full p-4 shadow-lg animate-bounce">
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

          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
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
                  className="bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-purple-900 rounded-full p-4 inline-block mb-4">
                    <svg
                      className="w-8 h-8 text-purple-400"
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
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="py-8 text-center bg-gray-800">
          <p className="text-gray-400">&copy; 2024 NexusPay. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
