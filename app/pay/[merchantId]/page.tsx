import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Merchant not found
          </h1>
          <p className="text-gray-600 mt-2">
            The merchant you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💳</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Pay {merchant.name}
          </h1>
          <p className="text-gray-500 mt-2">Mock Wallet Payment</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✓ Payment successful!
          </div>
        )}

        <form action={payMerchant} className="space-y-4">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              placeholder="Juan Dela Cruz"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (₱)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="100.00"
              step="0.01"
              min="0.01"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
          >
            Pay Now
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          This is a mock payment for testing purposes only
        </p>
      </div>
    </div>
  );
}
