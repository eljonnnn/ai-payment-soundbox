"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { Smartphone, Lightbulb, Target, FileText } from "lucide-react";
import Link from "next/link";

export default function QRScannerPage() {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [merchantId, setMerchantId] = useState("");

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setError(null);
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Camera error:", err);
      setError(
        "Unable to access camera. Please check permissions or enter merchant ID manually."
      );
      setManualEntry(true);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current && isScanning) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
        })
        .catch(console.error);
    }
  };

  const onScanSuccess = (decodedText: string) => {
    console.log("QR Code scanned:", decodedText);
    stopScanner();

    // Parse merchant ID from QR code
    // Supports: merchantId, /pay/merchantId, or full URL
    let parsedId = decodedText;

    if (decodedText.includes("/pay/")) {
      const match = decodedText.match(/\/pay\/([^/?]+)/);
      if (match) parsedId = match[1];
    }

    router.push(`/pay/${parsedId}`);
  };

  const onScanFailure = (error: string) => {
    // Silent - don't log every scan attempt
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (merchantId.trim()) {
      router.push(`/pay/${merchantId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/wallet"
            className="text-white hover:text-gray-300 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-white text-lg font-semibold">Scan QR Code</h1>
          <button
            onClick={() => setManualEntry(!manualEntry)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            {manualEntry ? "Camera" : "Manual"}
          </button>
        </div>
      </header>

      {/* Scanner View */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {!manualEntry ? (
          <div className="w-full max-w-md">
            <div
              id="qr-reader"
              className="rounded-xl overflow-hidden shadow-2xl"
            />
            
            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-white text-sm mb-2">
                Position the QR code within the frame
              </p>
              <p className="text-gray-400 text-xs">
                The scan will happen automatically
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-white text-lg font-semibold mb-1">
                Enter Merchant ID
              </h2>
              <p className="text-gray-400 text-sm">
                Manually enter the merchant&apos;s ID
              </p>
            </div>

            <form onSubmit={handleManualSubmit}>
              <input
                type="text"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder="e.g., merchant-id-123"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none mb-4"
              />
              <button
                type="submit"
                disabled={!merchantId.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
              >
                Continue to Payment
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-yellow-500/20 border border-yellow-500 text-yellow-300 p-3 rounded-lg text-xs">
                Camera not available. Please enter merchant ID manually.
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 max-w-md">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="text-gray-400">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-5 h-5" />
              </div>
              <p className="text-xs">Hold phone steady</p>
            </div>
            <div className="text-gray-400">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lightbulb className="w-5 h-5" />
              </div>
              <p className="text-xs">Ensure good lighting</p>
            </div>
            <div className="text-gray-400">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5" />
              </div>
              <p className="text-xs">Center QR code</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
