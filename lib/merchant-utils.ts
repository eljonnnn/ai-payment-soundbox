export interface MerchantInfo {
  id: string;
  name: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  merchantId: string;
  amount: number;
  customerName: string;
  status: string;
  createdAt: string;
}

export interface MerchantStats {
  totalRevenue: number;
  transactionCount: number;
  averageTransaction: number;
}

export function calculateStats(transactions: Transaction[]): MerchantStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.createdAt);
    return txnDate >= today;
  });

  const totalRevenue = todayTransactions.reduce(
    (sum, txn) => sum + Number(txn.amount),
    0
  );
  const transactionCount = todayTransactions.length;
  const averageTransaction =
    transactionCount > 0 ? totalRevenue / transactionCount : 0;

  return {
    totalRevenue,
    transactionCount,
    averageTransaction,
  };
}

export function formatCurrency(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-PH").format(num);
}

export function getStoredMerchantId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("selectedMerchantId");
}

export function setStoredMerchantId(merchantId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("selectedMerchantId", merchantId);
}
