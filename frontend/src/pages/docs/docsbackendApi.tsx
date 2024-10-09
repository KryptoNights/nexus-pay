import React from "react";

const DocsPage: React.FC = () => {
  return (
    <>
      {/* <Head>
        <title>NexusPay SDK Integration Guide</title>
        <meta
          name="description"
          content="Learn how to integrate NexusPay SDK into your business application"
        />
      </Head> */}

      {/* <div className="min-h-screen bg-[#0D0D0D] text-gray-300">
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

        <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                <code>npm install nexuspay-sdk # or yarn add nexuspay-sdk</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                2. Initialize the SDK
              </h2>
              <p className="mb-4">
                Import and initialize the SDK in your application:
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                <code>{`
import NexusPay from 'nexuspay-sdk';

const nexuspay = new NexusPay({
  apiKey: 'YOUR_API_KEY',
  // other configuration options
});
                `}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                3. Send a Payment Request
              </h2>
              <p className="mb-4">
                To initiate a payment request, use the following method:
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                <code>{`
const sendPaymentRequest = async (userEmail, orderId, amount) => {
  try {
    const response = await nexuspay.sendPaymentRequest({
      email: userEmail,
      orderId: orderId,
      amount: amount,
      currency: 'USD'
    });
    console.log('Payment request sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending payment request:', error);
  }
};
                `}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                4. Handle Payment Status Updates
              </h2>
              <p className="mb-4">
                Set up a webhook or use our SDK's event listener to receive
                payment status updates:
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                <code>{`
nexuspay.on('paymentUpdate', (update) => {
  const { orderId, status } = update;
  if (status === 'approved') {
    // Handle approved payment
    console.log(\`Payment for order \${orderId} has been approved\`);
  } else if (status === 'rejected') {
    // Handle rejected payment
    console.log(\`Payment for order \${orderId} has been rejected\`);
  }
});
                `}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                5. Verify Payment Status
              </h2>
              <p className="mb-4">
                You can also manually check the status of a payment:
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                <code>{`
const checkPaymentStatus = async (orderId) => {
  try {
    const status = await nexuspay.getPaymentStatus(orderId);
    console.log(\`Payment status for order \${orderId}: \${status}\`);
    return status;
  } catch (error) {
    console.error('Error checking payment status:', error);
  }
};
                `}</code>
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
                  Secure your API key and never expose it in client-side code.
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
      </div> */}
    </>
  );
};

export default DocsPage;
