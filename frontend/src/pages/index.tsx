import AOS from "aos";
import "aos/dist/aos.css";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import SVGIllustrator from "public/assets/qr.svg";

const LandingPage: React.FC = () => {
  const router = useRouter();
  const { idToken, activeAccountAdress } = useSelector(
    (state: any) => state.authSlice
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerRef = useRef(null);
  const stepsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const businessRef = useRef<HTMLElement>(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    mixpanel.track("landing_page_viewed");
  }, []);

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
      window.scrollTo({ top: targetScrollPosition, behavior: "smooth" });
    }
  };

  const features: string[] = [
    "Instant QR code payments",
    "Unique QR for receiving funds",
    "Send & receive via Nexus ID",
    "Low transaction fees",
    "Real-time transaction tracking",
    "Multi-currency support",
  ];

  const features2 = [
    "NEVER TOUCH CRYPTO — Get settled in cash",
    "ELIMINATE FRAUD CHARGEBACKS — Crypto payments are irreversible",
    "Light Speed — Transaction are fast as we are using Aptos",
    "ANY CHANNEL — Reach hundreds of millions of customers",
    "ZERO FEES — Zero Platform fees just pay for gas",
    "GLOBAL — Access all countries & territories instantly",
    "QR — Generate Dynamic Qr code to send and recive payment",
  ];

  const steps = [
    {
      title: "1. Sign Up",
      description:
        "Create your account in minutes and receive your unique Nexus ID. This ID will be your gateway to seamless crypto transactions.",
      icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
    },
    {
      title: "2. Add Funds",
      description:
        "Easily deposit various cryptocurrencies into your NexusPay wallet.",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
    {
      title: "3. Start Paying",
      description:
        "Use NexusPay for your everyday transactions. Enjoy instant payments, low fees, and the ability to send money globally with just a few taps.",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08 .402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  const businessSteps = [
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
          content="NexusPay - Pay, send, and receive crypto in your everyday life."
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

      <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A] text-white flex flex-col">
        <nav className="sticky top-0 z-50 bg-opacity-90 backdrop-filter backdrop-blur-lg bg-[#1A1A1A]">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div
              onClick={() => {
                handleScroll(headerRef);
                mixpanel.track("OnClick NexusPay Logo");
              }}
              className="text-4xl font-bold text-blue-500 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
            >
              NexusPay
            </div>
            <div className="hidden md:flex md:items-center space-x-6">
              {["Steps", "For Businesses"].map((item, index) => (
                <a
                  key={index}
                  onClick={() => handleScroll([stepsRef, businessRef][index])}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                >
                  {item}
                </a>
              ))}
              <a
                href="/docs"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              >
                Docs
              </a>
              <button
                className="py-3 px-8 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
                onClick={handleRedirect}
              >
                Get Started
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none"
              >
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden bg-[#0D0D0D] py-2">
              {["Steps", "For Businesses"].map((item, index) => (
                <a
                  key={index}
                  onClick={() => {
                    handleScroll([stepsRef, businessRef][index]);
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 px-4 text-sm text-white hover:bg-gray-800"
                >
                  {item}
                </a>
              ))}
              <a
                href="/docs"
                className="block py-2 px-4 text-sm text-white hover:bg-gray-800"
              >
                Docs
              </a>
              <button
                className="block w-full text-left py-2 px-4 text-sm text-white hover:bg-gray-800"
                onClick={() => {
                  handleRedirect();
                  setIsMenuOpen(false);
                }}
              >
                Get Started
              </button>
            </div>
          )}
        </nav>

        <main
          ref={headerRef}
          className="flex-grow container mx-auto px-6 py-16 lg:px-20 "
        >
          <header
            className="text-center mb-40  flex flex-col items-center mt-[7vh]"
            data-aos="fade-up"
          >
            <h1 className="text-6xl md:text-8xl font-extrabold mb-4 text-white">
              Crypto Payments Simplified
            </h1>
            <button
              className="mt-24 py-3 px-8 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              onClick={handleRedirect}
            >
              Get Started
            </button>
          </header>

          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl 2xl:text-6xl font-bold mb-6">
                Accept or send <span className="text-blue-600">Crypto</span>
                <br />
                payments globally
              </h1>
              <div className="space-y-6">
                {features2.map((feature, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <svg
                      className="w-6 h-6 text-blue-600 mr-3 border border-blue-600 rounded-full p-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm lg:text-base">
                      {feature.includes(" — ") ? (
                        <>
                          <strong>{feature.split(" — ")[0]}</strong>
                          {" — "}
                          {feature.split(" — ")[1]}
                        </>
                      ) : (
                        feature
                      )}
                    </span>
                  </div>
                ))}
              </div>
              {/* <div className="mt-8 space-x-4">
                <button
                  onClick={handleRedirect}
                  className="py-3 px-6 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-300"
                >
                  Get Started
                </button>
              </div> */}
            </div>
            <div className="lg:w-1/2 ">
              <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto">
                <div className="text-right mb-4">
                  <span className="text-3xl font-bold">$135.00</span>
                </div>
                <div className="flex justify-center">
                  <Image
                    src={SVGIllustrator}
                    alt={""}
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>

          <section
            ref={stepsRef}
            className="mb-32 mt-[20vh]"
            data-aos="fade-up"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 text-blue-200">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
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

          {/* <section ref={featuresRef} className="mb-32" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 text-blue-200">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="bg-blue-600 rounded-full p-3 inline-block mb-4">
                    <svg
                      className="w-6 h-6 text-white"
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
          </section> */}

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
                className="inline-block py-3 px-8 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-xl"
              >
                View Integration Guide
              </a>
            </div>
          </section>

          {/* <section ref={faqRef} className="mb-32" data-aos="fade-up">
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
          </section> */}
        </main>
      </div>
    </>
  );
};

export default LandingPage;
