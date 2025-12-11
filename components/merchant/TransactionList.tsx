"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Receipt, Package } from "lucide-react";
import { formatCurrency, type Transaction } from "@/lib/merchant-utils";

interface TransactionListProps {
  transactions: Transaction[];
}

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="text-center py-16"
  >
    <div className="w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
      <Package className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-600 mb-2">
      No transactions yet
    </h3>
    <p className="text-sm text-gray-500">Waiting for customer payments...</p>
  </motion.div>
);

const TransactionItem = ({
  transaction,
  index,
}: {
  transaction: Transaction;
  index: number;
}) => {
  const amount = Number(transaction.amount);
  const isLargeAmount = amount >= 1000;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
      className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isLargeAmount
                ? "bg-linear-to-br from-green-500 to-green-600"
                : "bg-linear-to-br from-blue-500 to-blue-600"
            }`}
          >
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold text-gray-900">
              {transaction.customerName}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {new Date(transaction.createdAt).toLocaleString("en-PH", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-2xl font-bold ${
              isLargeAmount ? "text-green-600" : "text-gray-900"
            }`}
          >
            {formatCurrency(amount)}
          </div>
          <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full mt-1">
            {transaction.status}
          </div>
        </div>
      </div>
      {isLargeAmount && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-gray-100"
        >
          <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
            <span className="text-base">🎉</span>
            Large transaction!
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const dates = Object.keys(groupedTransactions);

  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {dates.map((date) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-sm font-semibold text-gray-700">{date}</div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="text-xs text-gray-500">
                {groupedTransactions[date].length} transaction
                {groupedTransactions[date].length > 1 ? "s" : ""}
              </div>
            </div>
            <div className="space-y-3">
              {groupedTransactions[date].map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
