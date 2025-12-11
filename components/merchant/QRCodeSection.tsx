"use client";

import { useState } from "react";
import {
  QrCode,
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface QRCodeSectionProps {
  qrCodeUrl: string;
  merchantId: string;
  paymentUrl: string;
}

export default function QRCodeSection({
  qrCodeUrl,
  merchantId,
  paymentUrl,
}: QRCodeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      toast.success("Payment URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.download = `payment-qr-${merchantId}.png`;
    link.href = qrCodeUrl;
    link.click();
    toast.success("QR code downloaded!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Payment QR Code",
          text: "Scan to pay",
          url: paymentUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      handleCopyUrl();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-blue-900">
              Payment QR Code
            </div>
            <div className="text-xs text-blue-600">
              Share with customers to accept payments
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && qrCodeUrl && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-4">
              {/* QR Code Display */}
              <div className="flex justify-center bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <Image
                    src={qrCodeUrl}
                    alt="Payment QR Code"
                    width={250}
                    height={250}
                    className="rounded-lg"
                  />
                </motion.div>
              </div>

              {/* Payment URL */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-blue-600 font-medium mb-2">
                  Payment URL
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-gray-700 bg-white px-3 py-2 rounded border border-gray-200 truncate">
                    {paymentUrl}
                  </code>
                  <button
                    onClick={handleCopyUrl}
                    className="p-2 hover:bg-white rounded transition-colors shrink-0"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white rounded transition-colors shrink-0"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadQR}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download QR
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-xs font-semibold text-blue-900 mb-1">
                  How it works
                </div>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Customers scan the QR code with their phone</li>
                  <li>• They enter payment details and confirm</li>
                  <li>• You receive instant audio notification</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
