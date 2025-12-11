"use client";

import { useState, useEffect } from "react";
import { WALLET_USERS, getStoredUser, setStoredUser, type WalletUser } from "@/lib/wallet-users";

interface UserSwitcherProps {
  onUserChange?: (user: WalletUser) => void;
}

export default function UserSwitcher({ onUserChange }: UserSwitcherProps) {
  const [currentUser, setCurrentUser] = useState<WalletUser>(WALLET_USERS[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);
  }, []);

  const handleUserSelect = (user: WalletUser) => {
    setCurrentUser(user);
    setStoredUser(user);
    setIsOpen(false);
    onUserChange?.(user);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <span className="text-2xl">{currentUser.avatar}</span>
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-900">
            {currentUser.name}
          </div>
          <div className="text-xs text-gray-500">Tap to switch</div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                Demo Users
              </div>
              {WALLET_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                    currentUser.id === user.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ₱{user.balance.toFixed(2)}
                    </div>
                  </div>
                  {currentUser.id === user.id && (
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
