import Link from "next/link";
import { Mail } from "lucide-react";

export default function InboxPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/wallet" className="text-gray-700 hover:text-gray-900">
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
          <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Inbox Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Your notifications and messages will appear here.
          </p>
          <Link
            href="/wallet"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Back to Wallet
          </Link>
        </div>
      </main>
    </div>
  );
}
