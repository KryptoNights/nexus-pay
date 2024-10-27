"use client";

import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

// Near entry of your product, init Mixpanel

// mixpanel.identify(`guest`);
// mixpanel.people.set({
//   '$name': "anon",
//   '$email': "anon@mail",
//   '$address': `guest`,
// });

const LandingPage: React.FC = () => {
  const router = useRouter();
  const { idToken, activeAccountAdress } = useSelector(
    (state: any) => state.authSlice
  );

  const headerRef = useRef(null);
  const stepsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const businessRef = useRef<HTMLElement>(null);

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a duration of 1000ms for animations
    mixpanel.track("landing_page_viewed");
  }, []);

  const features: string[] = [
    "Scan QR codes for instant payments",
    "Receive funds via your unique QR",
    "Send and receive using Nexus ID",
  ];

  const handleRedirect = () => {
    mixpanel.track("landing_login_clicked");
    router.push("/dashboard");
  };

  const handleScroll = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();

      const scrollPosition = window.scrollY + rect.top;

      const headerHeight = 72;

      const bufferOffset = 100;

      const targetScrollPosition = scrollPosition - headerHeight - bufferOffset;

      window.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth",
      });
    }
  };

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
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08 .402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  const businessSteps: Array<{
    title: string;
    description: string;
    icon: string;
  }> = [
    {
      title: "1. Integrate SDK",
      description: "Add our SDK to your application",
      icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    },
    {
      title: "2. Send Payment Request",
      description: "Initiate a payment request with user's email.",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      title: "3. Receive Status",
      description:
        "Verify receive status about approval or rejection using our API.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
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

      <div className="min-h-[34vh] bg-gradient-to-b  text-white flex flex-col bg-[#0D0D0D]">
        <nav className="sticky top-0 z-50  bg-opacity-90 backdrop-filter backdrop-blur-lg bg-[#0D0D0D]">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div
              onClick={() => {
                handleScroll(headerRef);
                mixpanel.track("OnClick NexusPay Logo");
              }}
              className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:cursor-pointer"
            >
              NexusPay
            </div>
            <div className="space-x-4 hidden md:flex md:items-center">
              <a
                onClick={() => handleScroll(stepsRef)}
                className="text-white hover:text-blue-300 transition-colors duration-300 hover:cursor-pointer"
              >
                Steps
              </a>
              <a
                onClick={() => handleScroll(featuresRef)}
                className="text-white hover:text-blue-300 transition-colors duration-300  hover:cursor-pointer"
              >
                Features
              </a>
              <a
                onClick={() => handleScroll(faqRef)}
                className="text-white hover:text-blue-300 transition-colors duration-300 hover:cursor-pointer"
              >
                FAQs
              </a>
              <a
                onClick={() => handleScroll(businessRef)}
                className="text-white hover:text-blue-300 transition-colors duration-300 hover:cursor-pointer"
              >
                For Businesses
              </a>
              <a
                href="/docs"
                className="text-white hover:text-blue-300 transition-colors duration-300 hover:cursor-pointer"
              >
                Docs
              </a>
              <button
                className="text-sm py-2 px-6 bg-blue-600 rounded-full font-medium hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl shadow-blue-500/30"
                onClick={handleRedirect}
              >
                Login
              </button>
            </div>
            <div className="md:hidden">
              <button
                className="text-sm py-2 px-6 bg-blue-600 rounded-full font-medium hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl shadow-blue-500/30"
                onClick={handleRedirect}
              >
                Login
              </button>
            </div>
          </div>
        </nav>

        <main
          ref={headerRef}
          className="flex-grow container mx-auto px-6 py-10 lg:px-20 bg-[#0D0D0D]"
        >
          <header
            className="text-center mb-16 sm:mb-24 min-h-[50vh] sm:min-h-[62vh] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-8 sm:mt-[7vh] justify-items-center lg:pl-10 lg:pr-10"
            data-aos="fade-up"
          >
            <div className="flex flex-col items-center lg:items-start">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 sm:mb-8 text-blue-300 text-center lg:text-start">
                Crypto Payments Simplified
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 text-center lg:text-start">
                Effortless Crypto Payments for Consumers and Merchants –
                Anytime, Anywhere with NexusPay
              </p>
              <button
                className="py-3 px-6 sm:px-8 bg-blue-600 text-white rounded-full text-base sm:text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl hover:shadow-blue-500/30"
                onClick={handleRedirect}
              >
                Get Started
              </button>
            </div>
            <div className="flex justify-center lg:justify-end mt-8 lg:mt-0 relative">
              <img
                src="assets/dashboard_ss.png"
                alt="dashboard snapshot"
                className="max-w-full h-auto rounded-lg shadow-2xl transform transition-transform duration-300 hover:scale-105 hover:shadow-3xl" // Added hover effects for 3D look
                width={250}
                height={200}
              />
            </div>
          </header>

          <section
            ref={stepsRef}
            className="mb-32 min-h-[34vh]"
            data-aos="fade-up"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 text-blue-200">
              Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  data-aos="fade-up"
                >
                  <div className="bg-blue-600 rounded-full p-4 inline-block mb-6">
                    <svg
                      className="w-8 h-8 text-white"
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
                  <h3 className="text-xl font-semibold mb-4 text-blue-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            ref={featuresRef}
            className="mb-32 min-h-[34vh]"
            data-aos="fade-up"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 text-blue-200">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  data-aos="fade-up"
                >
                  <div className="bg-blue-600 rounded-full p-4 inline-block mb-6">
                    <svg
                      className="w-8 h-8 text-white"
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
                  </div>
                  <p className="text-lg text-gray-300">{feature}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            ref={businessRef}
            className="mb-32 min-h-[34vh]"
            data-aos="fade-up"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 text-blue-200">
              For Businesses
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {businessSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  data-aos="fade-up"
                >
                  <div className="bg-blue-600 rounded-full p-4 inline-block mb-6">
                    <svg
                      className="w-8 h-8 text-white"
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
                  <h3 className="text-xl font-semibold mb-4 text-blue-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <a
                href="/docs"
                className="inline-block py-3 px-8 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl hover:shadow-blue-500/30"
              >
                View Integration Guide
              </a>
            </div>
          </section>

          <section ref={faqRef} className="mb-32" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 text-blue-200">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div
                className="bg-gray-800 rounded-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                data-aos="fade-up"
              >
                <h3 className="text-xl font-semibold text-blue-300">
                  Is NexusPay secure?
                </h3>
                <p className="text-gray-400 mt-4">
                  Absolutely! We use advanced encryption and follow industry
                  standards to ensure your funds are always safe.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default LandingPage;
