"use client";

import { motion } from "framer-motion";
import { TrendingUp, Receipt, DollarSign } from "lucide-react";
import {
  formatCurrency,
  formatNumber,
  type MerchantStats,
} from "@/lib/merchant-utils";

interface QuickStatsCardsProps {
  stats: MerchantStats;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="text-sm text-blue-600 font-medium mb-2">{label}</div>
        <div className="text-2xl font-bold text-blue-900">{value}</div>
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

export default function QuickStatsCards({ stats }: QuickStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={DollarSign}
        label="Total Revenue Today"
        value={formatCurrency(stats.totalRevenue)}
        color="bg-linear-to-br from-green-500 to-green-600"
        delay={0}
      />
      <StatCard
        icon={Receipt}
        label="Transactions Today"
        value={formatNumber(stats.transactionCount)}
        color="bg-linear-to-br from-blue-500 to-blue-600"
        delay={0.1}
      />
      <StatCard
        icon={TrendingUp}
        label="Average Transaction"
        value={formatCurrency(stats.averageTransaction)}
        color="bg-linear-to-br from-purple-500 to-purple-600"
        delay={0.2}
      />
    </div>
  );
}
