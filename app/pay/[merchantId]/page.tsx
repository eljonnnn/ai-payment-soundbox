import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Store, CheckCircle2, Lock } from "lucide-react";

async function payMerchant(formData: FormData) {
  "use server";

  const merchantId = formData.get("merchantId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const customerName = formData.get("customerName") as string;

  await prisma.transaction.create({
    data: {
      merchantId,
      amount,
      customerName,
      status: "COMPLETED",
    },
  });

  redirect(`/pay/${merchantId}?success=true`);
}

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ merchantId: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { merchantId } = await params;
  const { success } = await searchParams;

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
  });

  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Merchant not found
          </h1>
          <p className="text-gray-600 mb-6">
            The merchant you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/wallet"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Back to Wallet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Header */}
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
          <h1 className="text-xl font-bold text-gray-900">Pay Merchant</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Merchant Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {merchant.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Verified Merchant</p>
          </div>
        </div>

        {success && (
          <div className="mb-4 p-5 bg-green-50 border-2 border-green-400 text-green-700 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Payment Successful!</p>
              <p className="text-sm text-green-600">
                Your payment has been processed
              </p>
            </div>
          </div>
        )}

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Enter Payment Details
          </h3>

          <form action={payMerchant} className="space-y-5">
            <input type="hidden" name="merchantId" value={merchantId} />

            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                placeholder="Juan Dela Cruz"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  ₱
                </span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="100.00"
                  step="0.01"
                  min="0.01"
                  required
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder-gray-400 font-semibold text-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
            >
              Pay Now
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Lock className="w-4 h-4" />
              <p className="text-xs">Secure payment powered by GCash</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          This is a mock payment for demo purposes only
        </p>
      </main>
    </div>
  );
}
