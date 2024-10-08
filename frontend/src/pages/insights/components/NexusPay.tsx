import React, { useState } from "react";
import axios from "axios";
// import "./nexus.css"; // Importing the CSS file
import { RequestIframeProps } from "./types";

const NexusPay: React.FC<RequestIframeProps> = ({ name, details, amount }) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value); // Directly using e.target.value
  };

  const handleSubmit = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        "https://nexus-send-request-876401151866.us-central1.run.app",
        {
          name: name,
          details: details,
          amount: amount,
          token: "USD",
          email_to_request: email,
          callback_url:
            "https://nexus-test-txfill-callback-876401151866.us-central1.run.app",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 12345890",
          },
        }
      );

      console.log(response);
      setMessage("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      setMessage("Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Nexus Payment Request</h2>
        <div className="mb-6">
          <label className="label">Email to request:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="input"
          />
        </div>
        <button onClick={handleSubmit} className="button" disabled={loading}>
          {loading ? "Sending..." : "Send Request"}
        </button>
        {message && (
          <p
            className={`message ${
              message.includes("successfully") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default NexusPay;
