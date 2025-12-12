"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Volume2,
  Smartphone,
  Zap,
  Shield,
  TrendingUp,
  Users,
  ChevronDown,
  Sparkles,
  Store,
  Wallet,
  Check,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showSetup, setShowSetup] = useState(false);

  const features = [
    {
      icon: Volume2,
      title: "Real-Time Audio Alerts",
      description:
        "Instant voice notifications when payments arrive. Never miss a transaction.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Powered by Supabase Realtime for sub-second payment notifications.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with PostgreSQL and encrypted connections.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description:
        "Seamless experience across all devices. Wallet and soundbox anywhere.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track transactions, revenue, and performance in real-time.",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Multi-Merchant Support",
      description: "Manage multiple merchant accounts with easy switching.",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-2xl">G</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  GCash Payment Soundbox
                </h1>
                <p className="text-sm text-gray-500">
                  Next-generation payment notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/wallet"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Wallet
              </Link>
              <Link
                href="/merchant/test"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm font-medium"
              >
                Merchant Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Powered by AI & Real-Time Technology
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Payment
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Experience with Sound
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Real-time payment notifications with intelligent voice
            announcements. Built for merchants who want to stay connected with
            every transaction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/merchant/test"
              className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="flex items-center gap-2 justify-center">
                <Store className="w-5 h-5" />
                <span>Open Merchant Portal</span>
              </div>
            </Link>
            <Link
              href="/wallet"
              className="group relative bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-2 justify-center">
                <Wallet className="w-5 h-5" />
                <span>Try Customer Wallet</span>
              </div>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="text-3xl font-bold text-blue-600 mb-1">
                &lt;1s
              </div>
              <div className="text-sm text-gray-600">Notification Speed</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="text-3xl font-bold text-green-600 mb-1">
                99.9%
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="text-3xl font-bold text-purple-600 mb-1">
                24/7
              </div>
              <div className="text-sm text-gray-600">Always On</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Payments
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed for modern merchants
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 shadow-md`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Role Selection Cards */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Experience
          </h3>
          <p className="text-lg text-gray-600">
            Select your role to get started
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Merchant Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="group"
          >
            <Link href="/merchant/test">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-200 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10">
                  <Store className="w-16 h-16 mb-4" />
                  <h4 className="text-3xl font-bold mb-3">Merchant Soundbox</h4>
                  <p className="text-blue-50 mb-6 text-lg leading-relaxed">
                    Monitor your business with real-time payment notifications,
                    voice announcements, and comprehensive analytics.
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>Live transaction monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>Customizable voice alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>QR code generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>Transaction history</span>
                    </li>
                  </ul>

                  <div className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <span>Access Portal</span>
                    <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Customer Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="group"
          >
            <Link href="/wallet">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-200 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10">
                  <Wallet className="w-16 h-16 mb-4" />
                  <h4 className="text-3xl font-bold mb-3">Customer Wallet</h4>
                  <p className="text-purple-50 mb-6 text-lg leading-relaxed">
                    Send payments seamlessly with QR code scanning, instant
                    confirmations, and transaction tracking.
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>QR code payment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>Instant confirmations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>Transaction history</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>Multiple users support</span>
                    </li>
                  </ul>

                  <div className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold px-6 py-3 rounded-lg group-hover:bg-purple-50 transition-colors">
                    <span>Open Wallet</span>
                    <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Built with Modern Technology
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 16",
              "React 19",
              "Prisma ORM",
              "Supabase Realtime",
              "PostgreSQL",
              "Tailwind CSS v4",
              "TypeScript",
              "Framer Motion",
              "Web Speech API",
            ].map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:border-blue-300 hover:from-blue-50 hover:to-blue-50 transition-all cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Setup Instructions (Collapsible) */}
      <section className="max-w-7xl mx-auto px-8 py-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 shadow-lg text-white"
        >
          <button
            onClick={() => setShowSetup(!showSetup)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">Developer Setup Guide</h3>
                <p className="text-gray-300 text-sm">
                  Click to view installation and configuration steps
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-6 h-6 transition-transform ${
                showSetup ? "rotate-180" : ""
              }`}
            />
          </button>

          {showSetup && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-gray-700"
            >
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      Configure Environment
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      Create{" "}
                      <code className="bg-gray-700 px-2 py-1 rounded">
                        .env.local
                      </code>{" "}
                      with Supabase credentials
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Run Migrations</div>
                    <p className="text-gray-300 text-sm">
                      Execute{" "}
                      <code className="bg-gray-700 px-2 py-1 rounded">
                        npx prisma migrate dev
                      </code>
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      Configure Supabase Realtime
                    </div>
                    <p className="text-gray-300 text-sm">
                      Run SQL commands from supabase-setup.md
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Seed Database</div>
                    <p className="text-gray-300 text-sm">
                      Execute{" "}
                      <code className="bg-gray-700 px-2 py-1 rounded">
                        npx prisma db seed
                      </code>
                    </p>
                  </div>
                </li>
              </ol>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-gray-600 text-sm">
                © 2025 GCash Payment Soundbox. All rights reserved.
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Built with ❤️ using Next.js & Supabase
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
