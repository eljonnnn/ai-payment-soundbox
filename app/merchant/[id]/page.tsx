"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Transaction {
  id: string;
  merchantId: string;
  amount: number;
  customerName: string;
  status: string;
  createdAt: string;
}

export default function MerchantSoundbox() {
  const params = useParams();
  const merchantId = params.id as string;
  const [isListening, setIsListening] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startListening = () => {
    try {
      // Check if speech synthesis is supported
      if (!window.speechSynthesis) {
        setError("Text-to-speech is not supported in this browser");
        return;
      }

      // Prime speechSynthesis with user gesture
      const utterance = new SpeechSynthesisUtterance(
        "Soundbox activated. Listening for payments."
      );
      window.speechSynthesis.speak(utterance);
      setIsListening(true);
      setError(null);
    } catch (err) {
      setError("Failed to initialize audio. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isListening) return;

    console.log("Setting up realtime subscription for merchant:", merchantId);

    const channel = supabase
      .channel(`merchant-${merchantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Transaction",
          filter: `merchantId=eq.${merchantId}`,
        },
        (payload) => {
          console.log("Received transaction:", payload);
          const txn = payload.new as Transaction;

          // Add to transaction list
          setTransactions((prev) => [txn, ...prev]);

          // Announce payment via TTS
          const message = `Payment received: ${txn.amount} pesos from ${txn.customerName}`;
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = "en-US";
          utterance.rate = 0.9; // Slightly slower for clarity
          window.speechSynthesis.speak(utterance);
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
        if (status === "SUBSCRIPTION_ERROR") {
          setError("Failed to connect to realtime updates");
        }
      });

    return () => {
      console.log("Unsubscribing from channel");
      channel.unsubscribe();
    };
  }, [isListening, merchantId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Merchant Soundbox
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time payment notifications with audio alerts
              </p>
            </div>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">🔊</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {!isListening ? (
            <div className="text-center py-12">
              <button
                onClick={startListening}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl text-xl transition duration-200 shadow-lg hover:shadow-xl"
              >
                🎧 Start Listening for Payments
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Click to activate audio notifications
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-100 border border-green-400 p-4 rounded-lg flex items-center">
                <div className="flex-shrink-0">
                  <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-green-800 font-semibold ml-3">
                  🔊 Listening for payments...
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Merchant ID:</strong>{" "}
                  <code className="bg-white px-2 py-1 rounded">
                    {merchantId}
                  </code>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Payment URL:</strong>{" "}
                  <code className="bg-white px-2 py-1 rounded text-xs">{`${window.location.origin}/pay/${merchantId}`}</code>
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Recent Transactions
                </h2>
                {transactions.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No transactions yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Waiting for customer payments...
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {transactions.map((txn) => (
                      <li
                        key={txn.id}
                        className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              ₱{Number(txn.amount).toFixed(2)}
                            </div>
                            <div className="text-gray-700 font-medium mt-1">
                              {txn.customerName}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(txn.createdAt).toLocaleString("en-PH", {
                                dateStyle: "medium",
                                timeStyle: "medium",
                              })}
                            </div>
                          </div>
                          <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {txn.status}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
