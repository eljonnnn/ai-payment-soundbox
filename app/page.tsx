import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              Payment Soundbox 🔊
            </h1>
            <p className="text-xl text-gray-600">
              Real-time payment notifications with text-to-speech for merchants
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Welcome to the MVP
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              This application demonstrates instant payment notifications using
              Supabase Realtime and the Web Speech API. Merchants receive audio
              alerts the moment customers complete payments.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="text-4xl mb-4">🔊</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Merchant Soundbox
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Listen for incoming payments with real-time audio
                  notifications
                </p>
                <div className="text-xs text-gray-500 bg-white p-2 rounded">
                  <strong>Route:</strong> /merchant/[id]
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Customer Wallet
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Mock payment interface for testing transactions
                </p>
                <div className="text-xs text-gray-500 bg-white p-2 rounded">
                  <strong>Route:</strong> /pay/[merchantId]
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📋 Setup Required
              </h3>
              <ol className="text-left text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  <span>
                    Configure{" "}
                    <code className="bg-white px-2 py-1 rounded">
                      .env.local
                    </code>{" "}
                    with Supabase credentials
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  <span>
                    Run{" "}
                    <code className="bg-white px-2 py-1 rounded">
                      npx prisma migrate dev
                    </code>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  <span>
                    Execute SQL commands from{" "}
                    <code className="bg-white px-2 py-1 rounded">
                      supabase-setup.md
                    </code>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">4.</span>
                  <span>
                    Run{" "}
                    <code className="bg-white px-2 py-1 rounded">
                      npx prisma db seed
                    </code>
                  </span>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/merchant/test"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
              >
                View Merchant Demo
              </Link>
              <Link
                href="/pay/test"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
              >
                View Payment Demo
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              (Replace &ldquo;test&rdquo; with actual merchant IDs from seed
              output)
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              🛠️ Tech Stack
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Next.js 15",
                "React 19",
                "Prisma",
                "Supabase",
                "PostgreSQL",
                "Tailwind CSS",
                "TypeScript",
              ].map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 text-gray-600 text-sm">
            <p>
              📖 See{" "}
              <a
                href="https://github.com"
                className="text-blue-600 hover:underline"
              >
                README.md
              </a>{" "}
              for complete setup instructions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
