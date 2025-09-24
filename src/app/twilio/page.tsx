"use client";

import { useEffect, useState } from "react";

interface TwilioStatus {
  message: string;
  timestamp: string;
  status: string;
}

interface SendSMSResponse {
  success: boolean;
  message: string;
  phoneNumber: string;
}

function Twilio() {
  const [status, setStatus] = useState<TwilioStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<SendSMSResponse | null>(null);

  // Fetch API status on component mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/twilio");
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch Twilio status:", error);
      }
    };

    fetchStatus();
  }, []);

  // Send SMS function
  const sendSMS = async () => {
    if (!phoneNumber || !message) {
      alert("Please enter both phone number and message");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/twilio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setPhoneNumber("");
        setMessage("");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to send SMS:", error);
      alert("Failed to send SMS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Twilio Integration</h1>

      {/* API Status */}
      {status && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <h2 className="font-bold">API Status</h2>
          <p>{status.message}</p>
          <p className="text-sm">Status: {status.status}</p>
          <p className="text-sm">
            Last checked: {new Date(status.timestamp).toLocaleString()}
          </p>
        </div>
      )}

      {/* Send SMS Form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Send SMS</h2>

        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Phone Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={sendSMS}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send SMS"}
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <h3 className="font-bold">SMS Sent Successfully!</h3>
          <p>Phone: {result.phoneNumber}</p>
          <p>Message: {result.message}</p>
        </div>
      )}
    </div>
  );
}

export default Twilio;
