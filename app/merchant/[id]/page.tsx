"use client";

import { supabase } from "@/lib/supabase";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { playSoundEffect, type SoundEffect } from "@/lib/sounds";
import { generateQRCode } from "@/lib/qrcode";
import {
  VOICE_PRESETS,
  MESSAGE_TEMPLATES,
  formatMessage,
  type MessageTemplate,
} from "@/lib/voice-presets";
import Image from "next/image";

interface Transaction {
  id: string;
  merchantId: string;
  amount: number;
  customerName: string;
  status: string;
  createdAt: string;
}

export default function MerchantSoundbox() {
  const params = useParams();
  const merchantId = params.id as string;
  const [isListening, setIsListening] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

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
  const [showQR, setShowQR] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      // Set default to first English voice
      const defaultVoice =
        voices.find((v) => v.lang.startsWith("en")) || voices[0];
      setSelectedVoice(defaultVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Generate QR code
  useEffect(() => {
    const paymentUrl = `${window.location.origin}/pay/${merchantId}`;
    generateQRCode(paymentUrl).then(setQrCodeUrl).catch(console.error);
  }, [merchantId]);

  const startListening = () => {
    try {
      // Check if speech synthesis is supported
      if (!window.speechSynthesis) {
        setError("Text-to-speech is not supported in this browser");
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
      setError(null);
    } catch (err) {
      setError("Failed to initialize audio. Please try again.");
      console.error(err);
    }
  };

  const applyPreset = (presetName: string) => {
    const preset = VOICE_PRESETS.find((p) => p.name === presetName);
    if (preset && presetName !== "Custom") {
      setVoiceRate(preset.rate);
      setVoicePitch(preset.pitch);
      setVoiceVolume(preset.volume);
    }
    setSelectedPreset(presetName);
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

          // Add to transaction list
          setTransactions((prev) => [txn, ...prev]);

          // Announce payment with sound effect and TTS
          speakPayment(Number(txn.amount), txn.customerName);
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
        if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
          setError("Failed to connect to realtime updates");
        }
      });

    return () => {
      console.log("Unsubscribing from channel");
      channel.unsubscribe();
    };
  }, [isListening, merchantId, speakPayment]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Merchant Soundbox
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time payment notifications with audio alerts
              </p>
            </div>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">🔊</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {!isListening ? (
            <div className="text-center py-12">
              <button
                onClick={startListening}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl text-xl transition duration-200 shadow-lg hover:shadow-xl"
              >
                🎧 Start Listening for Payments
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Click to activate audio notifications
              </p>

              {/* Settings Panel */}
              <div className="mt-8">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  ⚙️ {showSettings ? "Hide" : "Show"} Audio Settings
                </button>

                {showSettings && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-6 text-left max-w-2xl mx-auto space-y-6">
                    <h3 className="font-semibold text-gray-800 text-lg mb-4">
                      🎙️ Audio Customization
                    </h3>

                    {/* Voice Presets */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Voice Preset
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {VOICE_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => applyPreset(preset.name)}
                            className={`p-3 rounded-lg border-2 transition ${
                              selectedPreset === preset.name
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-blue-300"
                            }`}
                          >
                            <div className="text-2xl mb-1">{preset.emoji}</div>
                            <div className="text-sm font-medium text-gray-800">
                              {preset.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {preset.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message Templates */}
                    <div className="mb-6 pt-6 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        💬 Message Template
                      </label>
                      <select
                        value={selectedTemplate.id}
                        onChange={(e) => {
                          const template = MESSAGE_TEMPLATES.find(
                            (t) => t.id === e.target.value
                          );
                          if (template) {
                            setSelectedTemplate(template);
                            if (template.id === "custom") {
                              setCustomMessage(template.template);
                            }
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                      >
                        {MESSAGE_TEMPLATES.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>

                      {selectedTemplate.id === "custom" ? (
                        <div className="mt-3">
                          <textarea
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            placeholder="Use {amount} and {customer} as placeholders"
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                            rows={2}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Use{" "}
                            <code className="bg-gray-200 px-1 rounded">
                              {"{amount}"}
                            </code>{" "}
                            and{" "}
                            <code className="bg-gray-200 px-1 rounded">
                              {"{customer}"}
                            </code>{" "}
                            as placeholders
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm text-gray-600 italic">
                            &ldquo;{selectedTemplate.template}&rdquo;
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Language: {selectedTemplate.language}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Fine-tune Controls (only for Custom preset) */}
                    {selectedPreset === "Custom" && (
                      <div className="mb-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          🎚️ Fine-tune Controls
                        </h4>

                        {/* Speed */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Speed: {voiceRate.toFixed(1)}x
                          </label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={voiceRate}
                            onChange={(e) =>
                              setVoiceRate(parseFloat(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>

                        {/* Pitch */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pitch: {voicePitch.toFixed(1)}
                          </label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={voicePitch}
                            onChange={(e) =>
                              setVoicePitch(parseFloat(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>

                        {/* Volume */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Volume: {Math.round(voiceVolume * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={voiceVolume}
                            onChange={(e) =>
                              setVoiceVolume(parseFloat(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Voice Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🗣️ System Voice
                      </label>
                      <select
                        value={selectedVoice?.name || ""}
                        onChange={(e) => {
                          const voice = availableVoices.find(
                            (v) => v.name === e.target.value
                          );
                          setSelectedVoice(voice || null);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        {availableVoices.map((voice) => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sound Effect */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🔔 Sound Effect
                      </label>
                      <select
                        value={soundEffect}
                        onChange={(e) =>
                          setSoundEffect(e.target.value as SoundEffect)
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="chime">🔔 Chime</option>
                        <option value="bell">🛎️ Bell</option>
                        <option value="cash-register">💰 Cash Register</option>
                        <option value="none">🔇 None</option>
                      </select>
                      <button
                        onClick={() => playSoundEffect(soundEffect)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Test Sound
                      </button>
                    </div>

                    {/* Test Voice Button */}
                    <div className="pt-6 border-t border-gray-200">
                      <button
                        onClick={() => speakPayment(100, "Test Customer")}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition"
                      >
                        🔊 Test Voice with Current Settings
                      </button>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Preview: &ldquo;
                        {formatMessage(
                          selectedTemplate.id === "custom"
                            ? customMessage
                            : selectedTemplate.template,
                          100,
                          "Test Customer"
                        )}
                        &rdquo;
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-100 border border-green-400 p-4 rounded-lg flex items-center">
                <div className="flex-shrink-0">
                  <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-green-800 font-semibold ml-3">
                  🔊 Listening for payments...
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Merchant ID:</strong>{" "}
                  <code className="bg-white px-2 py-1 rounded">
                    {merchantId}
                  </code>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Payment URL:</strong>{" "}
                  <code className="bg-white px-2 py-1 rounded text-xs">{`${window.location.origin}/pay/${merchantId}`}</code>
                </p>

                <button
                  onClick={() => setShowQR(!showQR)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showQR ? "📋 Hide QR Code" : "📱 Show QR Code"}
                </button>

                {showQR && qrCodeUrl && (
                  <div className="mt-4 text-center bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">Scan to pay</p>
                    <Image
                      src={qrCodeUrl}
                      alt="Payment QR Code"
                      width={300}
                      height={300}
                      className="mx-auto rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.download = `payment-qr-${merchantId}.png`;
                        link.href = qrCodeUrl;
                        link.click();
                      }}
                      className="mt-3 text-sm text-green-600 hover:text-green-800"
                    >
                      💾 Download QR Code
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Recent Transactions
                </h2>
                {transactions.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No transactions yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Waiting for customer payments...
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {transactions.map((txn) => (
                      <li
                        key={txn.id}
                        className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              ₱{Number(txn.amount).toFixed(2)}
                            </div>
                            <div className="text-gray-700 font-medium mt-1">
                              {txn.customerName}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(txn.createdAt).toLocaleString("en-PH", {
                                dateStyle: "medium",
                                timeStyle: "medium",
                              })}
                            </div>
                          </div>
                          <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {txn.status}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
