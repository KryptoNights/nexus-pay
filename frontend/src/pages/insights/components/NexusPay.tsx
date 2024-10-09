import React, { useState } from "react";
import { RequestIframeProps } from "./types";

type RequiredRequestIframeProps = Required<RequestIframeProps>;
const NexusPay: React.FC<RequiredRequestIframeProps> = ({
  name,
  onClick,
  details,
  amount,
  buttonClassName,
  onClose,
  open,
}) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        "https://nexus-send-request-876401151866.us-central1.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 12345890",
          },
          body: JSON.stringify({
            name: name,
            details: details,
            amount: amount,
            token: "USD",
            email_to_request: email,
            callback_url:
              "https://nexus-test-txfill-callback-876401151866.us-central1.run.app",
          }),
        }
      );
      const data = await response.json();
      // console.log(data);

      setMessage("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      setMessage("Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={onClick}
          className={
            buttonClassName
              ? buttonClassName
              : "p-3 bg-blue-600 text-white rounded-md transition duration-200 hover:bg-blue-700"
          }
        >
          Pay Now
        </button>
      )}
      {open && (
        <div className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="m-auto bg-white shadow-lg rounded-lg p-8 w-full max-w-md relative">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={onClose}
            >
              ✕
            </button>
            <div className="nexus_iframe">
              <div className="nexus_card">
                <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
                  Nexus Payment Request
                </h2>
                <div className="mb-6">
                  <label className="block text-sm  mb-2 text-gray-700 font-bold">
                    Email to request:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className="w-full p-3 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white text-gray-800 placeholder-gray-400" // Updated styles
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full p-3 bg-blue-600 text-white rounded-md transition duration-200 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Request"}
                </button>
                {message && (
                  <p
                    className={`mt-4 text-sm ${
                      message.includes("successfully")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NexusPay;
