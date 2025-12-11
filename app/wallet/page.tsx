"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Smartphone, 
  Building2, 
  FileText, 
  PiggyBank, 
  CreditCard, 
  Gift, 
  Bus,
  Building,
  Shield,
  UtensilsCrossed,
  Plane,
  Leaf
} from "lucide-react";
import UserSwitcher from "@/components/wallet/UserSwitcher";
import BottomNavigation from "@/components/wallet/BottomNavigation";
import { getStoredUser, type WalletUser } from "@/lib/wallet-users";

const ACTION_BUTTONS = [
  { id: "send", label: "Send", icon: ArrowUpRight, href: "/wallet/send", color: "text-blue-600" },
  { id: "load", label: "Load", icon: Smartphone, href: "/wallet/load", color: "text-blue-600" },
  { id: "transfer", label: "Transfer", icon: Building2, href: "/wallet/transfer", color: "text-blue-600" },
  { id: "bills", label: "Bills", icon: FileText, href: "/wallet/bills", color: "text-blue-600" },
  { id: "gsave", label: "GSave", icon: PiggyBank, href: "/wallet/gsave", color: "text-blue-600" },
  { id: "cards", label: "Cards", icon: CreditCard, href: "/wallet/cards", color: "text-blue-600" },
  { id: "rewards", label: "A+ Rewards", icon: Gift, href: "/wallet/rewards", color: "text-blue-600" },
  { id: "commute", label: "Commute", icon: Bus, href: "/wallet/commute", color: "text-red-500" },
];

const EXPLORE_SERVICES = [
  { id: "us-account", label: "US Account", icon: Building, color: "text-blue-600" },
  { id: "ginsure", label: "GInsure", icon: Shield, color: "text-blue-600" },
  { id: "food-hub", label: "Food Hub", icon: UtensilsCrossed, color: "text-blue-600" },
  { id: "travel", label: "Travel", icon: Plane, color: "text-blue-600" },
  { id: "gforest", label: "GForest", icon: Leaf, color: "text-green-600" },
];

export default function WalletPage() {
  const [currentUser, setCurrentUser] = useState<WalletUser>({
    id: "user-1",
    name: "Juan dela Cruz",
    balance: 353.01,
    avatar: "👤",
  });
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  const handleUserChange = (user: WalletUser) => {
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hello!</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Merry GCash!
              </div>
              <button className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-blue-700">
                HELP
              </button>
            </div>
          </div>

          {/* User Switcher */}
          <div className="mt-3">
            <UserSwitcher onUserChange={handleUserChange} />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-4 -mb-3">
            <button className="flex-1 text-center py-3 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">
              Wallet
            </button>
            <button className="flex-1 text-center py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              Save
            </button>
            <button className="flex-1 text-center py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              Borrow
            </button>
            <button className="flex-1 text-center py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              Invest
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-4">
        {/* Balance Card */}
        <div className="bg-blue-600 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-white/80 text-sm font-medium flex items-center gap-2">
              AVAILABLE BALANCE
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/60 hover:text-white"
              >
                {showBalance ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white text-4xl font-bold">
              {showBalance ? `₱${currentUser.balance.toFixed(2)}` : "₱•••••"}
            </div>
            <button className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-gray-50 transition shadow-md">
              + Cash In
            </button>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {ACTION_BUTTONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                href={action.href}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:bg-gray-50 transition shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <span className="text-xs text-center font-medium text-gray-700">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Explore Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Explore the App</h2>
            <Link
              href="/explore"
              className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:text-blue-700"
            >
              View All
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {EXPLORE_SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:bg-gray-50 transition shadow-sm min-w-[80px]"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <span className="text-xs text-center font-medium text-gray-700 whitespace-nowrap">
                    {service.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">
                Reload toll credits
              </h3>
              <p className="text-white/90 text-sm mb-3">
                in just one app
              </p>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-full text-sm transition">
                Pay Bills Now
              </button>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
