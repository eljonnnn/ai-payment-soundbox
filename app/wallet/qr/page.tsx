"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { Plus, Upload, Info } from "lucide-react";
import BottomNavigation from "@/components/wallet/BottomNavigation";

export default function QRScannerPage() {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopScanner = useCallback(() => {
    if (scannerRef.current && isScanning) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
          setIsScanning(false);
        })
        .catch((err) => {
          // Ignore "Scanner not running" errors during cleanup
          console.log("Scanner stop:", err);
          setIsScanning(false);
        });
    }
  }, [isScanning]);

  const onScanSuccess = useCallback(
    (decodedText: string) => {
      console.log("QR Code scanned:", decodedText);

      // Set scanning to false immediately to prevent double processing
      setIsScanning(false);

      // Stop scanner before navigation
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
            scannerRef.current = null;
          })
          .catch((err) => console.log("Stop error:", err));
      }

      // Parse merchant ID from QR code
      let parsedId = decodedText;

      if (decodedText.includes("/pay/")) {
        const match = decodedText.match(/\/pay\/([^/?]+)/);
        if (match) parsedId = match[1];
      }

      // Navigate after a brief delay to allow scanner cleanup
      setTimeout(() => {
        router.push(`/pay/${parsedId}`);
      }, 100);
    },
    [router]
  );

  const onScanFailure = useCallback(() => {
    // Silent - don't log every scan attempt
  }, []);

  const startScanner = useCallback(async () => {
    try {
      setError(null);

      // Ensure the element exists
      const element = document.getElementById("qr-reader");
      if (!element) {
        console.error("QR reader element not found");
        setError("Scanner initialization failed. Please refresh.");
        return;
      }

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
        },
        onScanSuccess,
        onScanFailure
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Camera error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        errorMessage.includes("NotAllowedError") ||
          errorMessage.includes("Permission")
          ? "Camera access denied. Please allow camera permissions."
          : "Unable to access camera. Please check permissions."
      );
    }
  }, [onScanSuccess, onScanFailure]);

  useEffect(() => {
    // Wait for DOM to be ready before starting scanner
    const timer = setTimeout(() => {
      startScanner();
    }, 100);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  return (
    <div className="fixed inset-0 bg-[#0066FF] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative z-20 bg-[#0066FF] safe-top">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="w-6"></div>
          <h1 className="text-white text-lg font-semibold">QR Reader</h1>
          <button className="text-white">
            <Info className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Scanner View */}
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <div id="qr-reader" className="w-full h-full" />
        </div>

        {/* Dark overlay for better visibility */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

        {/* Scanning Frame Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-0 pb-48">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-20 safe-bottom">
          {/* Action Buttons */}
          <div className="w-full px-4 flex justify-center gap-12 sm:gap-16 mb-4">
            <button className="flex flex-col items-center text-white">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 border border-white/30 active:scale-95 transition-transform">
                <Plus className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-xs sm:text-sm font-medium">
                Generate QR
              </span>
            </button>
            <button className="flex flex-col items-center text-white">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 border border-white/30 active:scale-95 transition-transform">
                <Upload className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-xs sm:text-sm font-medium">Upload QR</span>
            </button>
          </div>

          {/* Alipay+ Banner */}
          <div className="w-full px-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/20 p-3 sm:p-4">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                  <span className="text-white text-xs sm:text-sm font-medium">
                    Pay abroad with
                  </span>
                  <span className="text-white text-base sm:text-lg font-bold whitespace-nowrap">
                    支|Alipay+
                  </span>
                </div>
              </div>

              {/* Country Flags */}
              <div className="flex justify-center gap-2 sm:gap-3">
                <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white rounded flex items-center justify-center text-lg sm:text-xl">
                  🇯🇵
                </div>
                <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white rounded flex items-center justify-center text-lg sm:text-xl">
                  🇰🇷
                </div>
                <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white rounded flex items-center justify-center text-lg sm:text-xl">
                  🇮🇹
                </div>
                <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white rounded flex items-center justify-center text-lg sm:text-xl">
                  🇸🇬
                </div>
                <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white rounded flex items-center justify-center text-lg sm:text-xl">
                  🇩🇪
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="absolute top-4 left-4 right-4 z-20 bg-red-500/90 backdrop-blur-sm border border-red-300 text-white p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="relative z-20">
        <BottomNavigation />
      </div>
    </div>
  );
}
