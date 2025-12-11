"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Store } from "lucide-react";
import { MerchantInfo, setStoredMerchantId } from "@/lib/merchant-utils";
import { motion, AnimatePresence } from "framer-motion";

interface MerchantSwitcherProps {
  currentMerchantId: string;
  onMerchantChange: (merchantId: string) => void;
}

export default function MerchantSwitcher({
  currentMerchantId,
  onMerchantChange,
}: MerchantSwitcherProps) {
  const [merchants, setMerchants] = useState<MerchantInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentMerchant = merchants.find((m) => m.id === currentMerchantId);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const response = await fetch("/api/merchants/list");
      const data = await response.json();
      setMerchants(data.merchants || []);
    } catch (error) {
      console.error("Failed to fetch merchants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMerchantSelect = (merchantId: string) => {
    setStoredMerchantId(merchantId);
    onMerchantChange(merchantId);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md min-w-[250px]"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Store className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs text-blue-600 font-medium">Merchant</div>
          <div className="text-sm font-semibold text-blue-900 truncate">
            {currentMerchant?.name || "Select merchant"}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden"
            >
              <div className="py-1 max-h-64 overflow-y-auto">
                {merchants.map((merchant) => (
                  <button
                    key={merchant.id}
                    onClick={() => handleMerchantSelect(merchant.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${
                      merchant.id === currentMerchantId
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        merchant.id === currentMerchantId
                          ? "bg-gradient-to-br from-blue-600 to-blue-700"
                          : "bg-gradient-to-br from-gray-400 to-gray-500"
                      }`}
                    >
                      <Store className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div
                        className={`text-sm font-semibold ${
                          merchant.id === currentMerchantId
                            ? "text-blue-700"
                            : "text-blue-900"
                        }`}
                      >
                        {merchant.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        ID: {merchant.id.slice(0, 8)}...
                      </div>
                    </div>
                    {merchant.id === currentMerchantId && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
