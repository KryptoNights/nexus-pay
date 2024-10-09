import CopyButton from "@/components/CopyButton/CopyButton";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const DocsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>NexusPay SDK Integration Guide</title>
        <meta
          name="description"
          content="Learn how to integrate NexusPay SDK into your business application"
        />
      </Head>

      <div className="min-h-screen bg-[#0D0D0D] text-gray-300 flex flex-col">
        <nav className="sticky top-0 z-50 bg-opacity-90 backdrop-filter backdrop-blur-lg bg-[#0D0D0D] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/">
                  <span className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer">
                    NexusPay
                  </span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link href="/">
                  <span className="text-gray-300 hover:text-blue-300 transition-colors duration-300 cursor-pointer">
                    Back to Home
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
          <h1 className="text-4xl font-bold text-blue-300 mb-8">
            NexusPay SDK Integration Guide
          </h1>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                1. Install the SDK
              </h2>
              <p className="mb-4">
                First, install the NexusPay SDK using npm or yarn:
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto relative">
                <CopyButton text="npm install nexus-frontend-sdk" />
                <code>npm install nexus-frontend-sdk</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                2. Import the SDK Component
              </h2>
              <p className="mb-4">
                Import the NexusPay component in your frontend:
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto relative">
                <CopyButton text='import NexusPay from "nexus-frontend-sdk";' />
                <code>import NexusPay from "nexus-frontend-sdk";</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                3. Use the Component
              </h2>
              <p className="mb-4">
                Implement the NexusPay component in your frontend to request
                payment:
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto relative">
                <CopyButton
                  text={`const PaymentPage = () => {
  const [handleOpen, setHandleOpen] = useState(false);
  return (
    <NexusPay
      name="Nexus Pay"
      details="Payment for your order"
      amount="1000"
      open={handleOpen}
      onClick={() => setHandleOpen(true)}
      onClose={() => setHandleOpen(false)}
    />
  );
};

export default PaymentPage;`}
                />
                <code>{`const PaymentPage = () => {
  const [handleOpen, setHandleOpen] = useState(false);
  return (
    <NexusPay
      name="Nexus Pay"
      details="Payment for your order"
      amount="1000"
      open={handleOpen}
      onClick={() => setHandleOpen(true)}
      onClose={() => setHandleOpen(false)}
    />
  );
};

export default PaymentPage;`}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                Best Practices
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Always handle errors and edge cases in your integration.
                </li>
                <li>
                  Implement proper error handling and logging for debugging
                  purposes.
                </li>
                <li>Consider implementing retry logic for failed requests.</li>
                <li>
                  Keep your SDK version up to date for the latest features and
                  security updates.
                </li>
              </ul>
            </section>
          </div>
        </main>

        <footer className="bg-gray-900 text-gray-300 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center">
              Need custom support or additional features? Contact us at{" "}
              <a
                href="mailto:kavishshah30@gmail.com"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                kavishshah30@gmail.com
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DocsPage;
