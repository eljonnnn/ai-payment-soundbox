"use client";

import { supabase } from "@/lib/supabase";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
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
  const [voicesLoaded, setVoicesLoaded] = useState(false);

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

  // Load available voices with retry logic
  useEffect(() => {
    if (typeof window === "undefined") return;

    let attempts = 0;
    const maxAttempts = 20; // Increased from 10
    let pollInterval: NodeJS.Timeout | null = null;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log(
        `[Voice Loading] Attempt ${attempts + 1}: Found ${voices.length} voices`
      );

      if (voices.length > 0) {
        console.log("✅ Voices loaded:", voices.length);
        console.log(
          "Available voices:",
          voices.map((v) => `${v.name} (${v.lang})`)
        );
        setAvailableVoices(voices);
        // Set default to Google US English voice
        const defaultVoice =
          voices.find(
            (v) => v.name === "Google US English" && v.lang === "en-US"
          ) ||
          voices.find((v) => v.name.includes("Google") && v.lang === "en-US") ||
          voices.find((v) => v.lang === "en-US") ||
          voices.find((v) => v.lang.startsWith("en")) ||
          voices[0];
        console.log(
          "Selected default voice:",
          defaultVoice?.name,
          defaultVoice?.lang
        );
        setSelectedVoice(defaultVoice);
        setVoicesLoaded(true);
        return true;
      }
      return false;
    };

    // Try loading immediately (might be cached)
    console.log("[Voice Loading] Initial load attempt...");
    if (loadVoices()) {
      console.log("[Voice Loading] Voices loaded immediately");
      return;
    }

    // Set up event listener for async voice loading
    const handleVoicesChanged = () => {
      console.log("[Voice Loading] voiceschanged event fired");
      if (loadVoices() && pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    };

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      handleVoicesChanged
    );

    // Fallback polling for browsers that don't fire the event reliably
    console.log("[Voice Loading] Starting polling fallback...");
    pollInterval = setInterval(() => {
      attempts++;
      if (loadVoices() || attempts >= maxAttempts) {
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        if (attempts >= maxAttempts && !voicesLoaded) {
          console.error(
            "❌ Voices failed to load after",
            maxAttempts,
            "attempts"
          );
          // Still set voices loaded to true to allow the app to function
          setVoicesLoaded(true);
        }
      }
    }, 200); // Increased from 100ms to 200ms

    // Cleanup
    return () => {
      console.log("[Voice Loading] Cleanup");
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate QR code when merchant changes
  useEffect(() => {
    if (typeof window === "undefined") return;

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
    router.replace(`/merchant/${newMerchantId}`);

    toast.success("Merchant switched successfully!");
  };

  const startListening = () => {
    try {
      // Check if speech synthesis is supported
      if (!window.speechSynthesis) {
        toast.error("Text-to-speech is not supported in this browser");
        return;
      }

      // Check if voices are loaded
      if (!voicesLoaded || availableVoices.length === 0) {
        toast.error(
          "Voice system is still loading. Please wait a moment and try again.",
          { duration: 4000 }
        );
        return;
      }

      // Prime speechSynthesis with user gesture
      const utterance = new SpeechSynthesisUtterance(
        "Soundbox activated. Listening for payments."
      );
      // Ensure we have a voice before using it
      const voiceToUse = selectedVoice || availableVoices[0];
      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }
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
      console.log("=== speakPayment called ===");
      console.log("Amount:", amount);
      console.log("Customer:", customerName);

      // Play sound effect first
      playSoundEffect(soundEffect);

      // Check if voices are loaded
      if (typeof window === "undefined" || !voicesLoaded) {
        console.warn("Voices not yet loaded, skipping speech");
        return;
      }

      // Format message using selected template
      const message =
        selectedTemplate.id === "custom"
          ? formatMessage(customMessage, amount, customerName)
          : formatMessage(selectedTemplate.template, amount, customerName);

      console.log("Message to speak:", message);

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Small delay after cancel (required by some browsers)
      setTimeout(() => {
        // Get fresh voices list
        const voices = window.speechSynthesis.getVoices();
        console.log("Available voices count:", voices.length);

        if (voices.length === 0) {
          console.error("No voices available at speech time");
          return;
        }

        const utterance = new SpeechSynthesisUtterance(message);

        // Try to use selected voice, or fall back to first available voice
        let voiceToUse = selectedVoice;
        if (!voiceToUse || !voices.find((v) => v.name === voiceToUse?.name)) {
          // Find a voice that matches the language
          voiceToUse =
            voices.find((v) => v.lang.startsWith(selectedTemplate.language)) ||
            voices[0];
          console.log("Falling back to voice:", voiceToUse?.name);
        }

        if (voiceToUse) {
          utterance.voice = voiceToUse;
          console.log(
            "Using voice:",
            voiceToUse.name,
            "Lang:",
            voiceToUse.lang
          );
        } else {
          console.error("No voices available!");
        }

        utterance.rate = voiceRate;
        utterance.pitch = voicePitch;
        utterance.volume = voiceVolume;
        utterance.lang = selectedTemplate.language;

        console.log("Utterance settings:", {
          rate: utterance.rate,
          pitch: utterance.pitch,
          volume: utterance.volume,
          lang: utterance.lang,
          voice: utterance.voice?.name,
          text: utterance.text,
        });

        // Add event listeners for debugging
        utterance.onstart = () => console.log("✅ Speech started");
        utterance.onend = () => console.log("✅ Speech ended");
        utterance.onerror = (event) =>
          console.error("❌ Speech error:", event.error, event);
        utterance.onpause = () => console.log("⏸️ Speech paused");
        utterance.onresume = () => console.log("▶️ Speech resumed");

        console.log("Calling speechSynthesis.speak()...");
        window.speechSynthesis.speak(utterance);

        // Check if speaking
        setTimeout(() => {
          console.log("Is speaking?", window.speechSynthesis.speaking);
          console.log("Is pending?", window.speechSynthesis.pending);
          console.log("Is paused?", window.speechSynthesis.paused);
        }, 200);
      }, 50);
    },
    [
      soundEffect,
      selectedTemplate,
      customMessage,
      selectedVoice,
      voiceRate,
      voicePitch,
      voiceVolume,
      voicesLoaded,
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

      {/* Voice Loading Indicator */}
      {!voicesLoaded && (
        <div className="fixed top-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg z-50 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-yellow-800 font-medium">
            Loading voice system...
          </p>
        </div>
      )}

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
                  <h1 className="text-2xl font-bold text-gray-900">
                    GCash Merchant Soundbox
                  </h1>
                  <p className="text-sm text-gray-500">
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
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Start Listening for Payments
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
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
              <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Volume2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-700 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">
                        Soundbox Active
                      </div>
                      <div className="text-green-50 text-sm">
                        Listening for payments on this merchant account
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={stopListening}
                    className="bg-white hover:bg-green-50 text-red-600 font-semibold px-6 py-2.5 rounded-lg transition-all shadow-sm"
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
                    <h2 className="text-xl font-bold text-gray-900">
                      Recent Transactions
                    </h2>
                    <div className="text-sm text-gray-500">
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
