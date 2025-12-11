"use client";

import { supabase } from "@/lib/supabase";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { playSoundEffect, type SoundEffect } from "@/lib/sounds";
import { generateQRCode } from "@/lib/qrcode";
import {
  MESSAGE_TEMPLATES,
  formatMessage,
  type MessageTemplate,
} from "@/lib/voice-presets";
import { Settings, HelpCircle, Volume2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import MerchantSwitcher from "@/components/merchant/MerchantSwitcher";
import QuickStatsCards from "@/components/merchant/QuickStatsCards";
import QRCodeSection from "@/components/merchant/QRCodeSection";
import AudioSettingsDrawer from "@/components/merchant/AudioSettingsDrawer";
import TransactionList from "@/components/merchant/TransactionList";
import { calculateStats, type Transaction } from "@/lib/merchant-utils";

export default function MerchantSoundbox() {
  const params = useParams();
  const initialMerchantId = params.id as string;

  const [merchantId, setMerchantId] = useState(initialMerchantId);
  const [isListening, setIsListening] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Voice customization settings
  const [voiceRate, setVoiceRate] = useState(0.9);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [soundEffect, setSoundEffect] = useState<SoundEffect>("chime");

  // Voice presets and templates
  const [selectedPreset, setSelectedPreset] = useState<string>("Professional");
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate>(
    MESSAGE_TEMPLATES[0]
  );
  const [customMessage, setCustomMessage] = useState(
    MESSAGE_TEMPLATES[0].template
  );

  // QR Code
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // Load available voices
  useEffect(() => {
    let isSubscribed = true;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("Voices loaded:", voices.length);
      
      if (voices.length > 0 && isSubscribed) {
        setAvailableVoices(voices);
        
        // Only set default voice if not already set
        setSelectedVoice((currentVoice) => {
          if (currentVoice) return currentVoice;
          
          // Set default to Google US English voice, or fallback to first English voice
          const defaultVoice =
            voices.find((v) => v.name === "Google US English") ||
            voices.find((v) => v.lang === "en-US") ||
            voices.find((v) => v.lang.startsWith("en")) ||
            voices[0];
          return defaultVoice;
        });
      }
    };

    // Try loading voices immediately
    loadVoices();

    // Set up event listener for when voices are loaded
    const handleVoicesChanged = () => {
      console.log("Voices changed event fired");
      loadVoices();
    };
    
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

    // Aggressive fallback: retry multiple times
    const timer1 = setTimeout(loadVoices, 100);
    const timer2 = setTimeout(loadVoices, 500);
    const timer3 = setTimeout(loadVoices, 1000);

    return () => {
      isSubscribed = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, []); // Run only once on mount

  // Generate QR code when merchant changes
  useEffect(() => {
    const paymentUrl = `${window.location.origin}/pay/${merchantId}`;
    generateQRCode(paymentUrl).then(setQrCodeUrl).catch(console.error);
  }, [merchantId]);

  // Handle merchant switching
  const handleMerchantChange = (newMerchantId: string) => {
    // Stop current listening
    if (isListening) {
      setIsListening(false);
    }

    // Clear transactions
    setTransactions([]);

    // Update merchant ID
    setMerchantId(newMerchantId);

    // Update URL without page reload
    window.history.replaceState(null, "", `/merchant/${newMerchantId}`);

    toast.success("Merchant switched successfully!");
  };

  const startListening = () => {
    try {
      // Check if speech synthesis is supported
      if (!window.speechSynthesis) {
        toast.error("Text-to-speech is not supported in this browser");
        return;
      }

      // Prime speechSynthesis with user gesture
      const utterance = new SpeechSynthesisUtterance(
        "Soundbox activated. Listening for payments."
      );
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;
      utterance.volume = voiceVolume;
      window.speechSynthesis.speak(utterance);

      // Play activation sound
      playSoundEffect(soundEffect);

      setIsListening(true);
      toast.success("Soundbox activated!");
    } catch (err) {
      toast.error("Failed to initialize audio. Please try again.");
      console.error(err);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    toast("Soundbox deactivated", { icon: "🔇" });
  };

  const speakPayment = useCallback(
    (amount: number, customerName: string) => {
      // Play sound effect first
      playSoundEffect(soundEffect);

      // Format message using selected template
      const message =
        selectedTemplate.id === "custom"
          ? formatMessage(customMessage, amount, customerName)
          : formatMessage(selectedTemplate.template, amount, customerName);

      const utterance = new SpeechSynthesisUtterance(message);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;
      utterance.volume = voiceVolume;
      utterance.lang = selectedTemplate.language;
      window.speechSynthesis.speak(utterance);
    },
    [
      soundEffect,
      selectedTemplate,
      customMessage,
      selectedVoice,
      voiceRate,
      voicePitch,
      voiceVolume,
    ]
  );

  useEffect(() => {
    if (!isListening) return;

    console.log("Setting up realtime subscription for merchant:", merchantId);

    const channel = supabase
      .channel(`merchant-${merchantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Transaction",
          filter: `merchantId=eq.${merchantId}`,
        },
        (payload) => {
          console.log("Received transaction:", payload);
          const txn = payload.new as Transaction;

          // Add to transaction list at the top
          setTransactions((prev) => [txn, ...prev]);

          // Announce payment with sound effect and TTS
          speakPayment(Number(txn.amount), txn.customerName);

          // Show toast notification
          toast.success(
            `Payment received: ₱${Number(txn.amount).toFixed(2)} from ${
              txn.customerName
            }`,
            { duration: 5000 }
          );
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
        if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
          toast.error("Failed to connect to realtime updates");
        } else if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          console.log("Successfully subscribed to merchant channel");
        }
      });

    return () => {
      console.log("Unsubscribing from channel");
      channel.unsubscribe();
    };
  }, [isListening, merchantId, speakPayment]);

  // Calculate stats
  const stats = calculateStats(transactions);
  const paymentUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/pay/${merchantId}`;

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Logo and Title */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-2xl">G</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-900">
                    GCash Merchant Soundbox
                  </h1>
                  <p className="text-sm text-blue-600">
                    Real-time payment notifications
                  </p>
                </div>
              </div>

              {/* Right: Merchant Switcher and Actions */}
              <div className="flex items-center gap-3">
                <MerchantSwitcher
                  currentMerchantId={merchantId}
                  onMerchantChange={handleMerchantChange}
                />
                <button
                  onClick={() => setShowSettingsDrawer(true)}
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Audio Settings"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Help"
                >
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-8 py-8">
          {!isListening ? (
            <div className="max-w-2xl mx-auto">
              {/* Activation Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Volume2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-blue-900 mb-3">
                  Start Listening for Payments
                </h2>
                <p className="text-gray-700 mb-8 text-lg">
                  Activate the soundbox to receive real-time audio notifications
                  when customers complete payments.
                </p>
                <button
                  onClick={startListening}
                  className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-12 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🎧 Activate Soundbox
                </button>

                {/* Quick Info */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <button
                    onClick={() => setShowSettingsDrawer(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    ⚙️ Configure Audio Settings First
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="bg-linear-to-r from-green-500 to-green-700 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Volume2 className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">Soundbox Active</div>
                      <div className="text-green-100 text-sm">
                        Listening for payments on this merchant account
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={stopListening}
                    className="bg-red-600 bg-opacity-20 hover:bg-opacity-30 text-white font-semibold px-6 py-2.5 rounded-lg transition-all"
                  >
                    Stop Listening
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <QuickStatsCards stats={stats} />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Transactions (2/3 width) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-blue-900">
                      Recent Transactions
                    </h2>
                    <div className="text-sm text-blue-600">
                      {transactions.length} total
                    </div>
                  </div>
                  <TransactionList transactions={transactions} />
                </div>

                {/* Right: QR Code (1/3 width) */}
                <div className="lg:col-span-1">
                  <QRCodeSection
                    qrCodeUrl={qrCodeUrl}
                    merchantId={merchantId}
                    paymentUrl={paymentUrl}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Audio Settings Drawer */}
      <AudioSettingsDrawer
        isOpen={showSettingsDrawer}
        onClose={() => setShowSettingsDrawer(false)}
        voiceRate={voiceRate}
        setVoiceRate={setVoiceRate}
        voicePitch={voicePitch}
        setVoicePitch={setVoicePitch}
        voiceVolume={voiceVolume}
        setVoiceVolume={setVoiceVolume}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        availableVoices={availableVoices}
        soundEffect={soundEffect}
        setSoundEffect={setSoundEffect}
        selectedPreset={selectedPreset}
        setSelectedPreset={setSelectedPreset}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        customMessage={customMessage}
        setCustomMessage={setCustomMessage}
        speakPayment={speakPayment}
      />
    </>
  );
}
