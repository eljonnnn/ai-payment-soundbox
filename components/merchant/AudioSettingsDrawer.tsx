"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, MessageSquare, Bell } from "lucide-react";
import { playSoundEffect, type SoundEffect } from "@/lib/sounds";
import {
  VOICE_PRESETS,
  MESSAGE_TEMPLATES,
  formatMessage,
  type MessageTemplate,
} from "@/lib/voice-presets";

interface AudioSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  voiceRate: number;
  setVoiceRate: (rate: number) => void;
  voicePitch: number;
  setVoicePitch: (pitch: number) => void;
  voiceVolume: number;
  setVoiceVolume: (volume: number) => void;
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  availableVoices: SpeechSynthesisVoice[];
  soundEffect: SoundEffect;
  setSoundEffect: (effect: SoundEffect) => void;
  selectedPreset: string;
  setSelectedPreset: (preset: string) => void;
  selectedTemplate: MessageTemplate;
  setSelectedTemplate: (template: MessageTemplate) => void;
  customMessage: string;
  setCustomMessage: (message: string) => void;
  speakPayment: (amount: number, customerName: string) => void;
}

export default function AudioSettingsDrawer({
  isOpen,
  onClose,
  voiceRate,
  setVoiceRate,
  voicePitch,
  setVoicePitch,
  voiceVolume,
  setVoiceVolume,
  selectedVoice,
  setSelectedVoice,
  availableVoices,
  soundEffect,
  setSoundEffect,
  selectedPreset,
  setSelectedPreset,
  selectedTemplate,
  setSelectedTemplate,
  customMessage,
  setCustomMessage,
  speakPayment,
}: AudioSettingsDrawerProps) {
  const applyPreset = (presetName: string) => {
    const preset = VOICE_PRESETS.find((p) => p.name === presetName);
    if (preset && presetName !== "Custom") {
      setVoiceRate(preset.rate);
      setVoicePitch(preset.pitch);
      setVoiceVolume(preset.volume);
    }
    setSelectedPreset(presetName);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-blue-900">
                  Audio Settings
                </h2>
                <p className="text-sm text-blue-600 mt-1">
                  Customize voice and sound notifications
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Voice Presets Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    Voice Preset
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {VOICE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.name)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedPreset === preset.name
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{preset.emoji}</div>
                      <div className="text-sm font-semibold text-blue-900">
                        {preset.name}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {preset.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine-tune Controls (only for Custom preset) */}
              {selectedPreset === "Custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-6 border-t border-gray-200"
                >
                  <h4 className="text-sm font-semibold text-blue-900">
                    Fine-tune Controls
                  </h4>

                  {/* Speed */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Speed: {voiceRate.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceRate}
                      onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Pitch */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Volume */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </motion.div>
              )}

              {/* Voice Selection */}
              <div className="pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  System Voice
                </label>
                <select
                  value={selectedVoice?.name || ""}
                  onChange={(e) => {
                    const voice = availableVoices.find(
                      (v) => v.name === e.target.value
                    );
                    setSelectedVoice(voice || null);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Templates Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    Message Template
                  </h3>
                </div>
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
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                >
                  {MESSAGE_TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>

                {selectedTemplate.id === "custom" ? (
                  <div>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Use {amount} and {customer} as placeholders"
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <p className="text-xs text-blue-600 mt-2">
                      Use{" "}
                      <code className="bg-blue-100 text-blue-900 px-1 rounded">
                        {"{amount}"}
                      </code>{" "}
                      and{" "}
                      <code className="bg-blue-100 text-blue-900 px-1 rounded">
                        {"{customer}"}
                      </code>{" "}
                      as placeholders
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 italic">
                      &ldquo;{selectedTemplate.template}&rdquo;
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      Language: {selectedTemplate.language}
                    </p>
                  </div>
                )}
              </div>

              {/* Sound Effect Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    Sound Effect
                  </h3>
                </div>
                <select
                  value={soundEffect}
                  onChange={(e) =>
                    setSoundEffect(e.target.value as SoundEffect)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                >
                  <option value="chime">🔔 Chime</option>
                  <option value="bell">🛎️ Bell</option>
                  <option value="cash-register">💰 Cash Register</option>
                  <option value="none">🔇 None</option>
                </select>
                <button
                  onClick={() => playSoundEffect(soundEffect)}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Test Sound Effect
                </button>
              </div>

              {/* Test Voice Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => speakPayment(100, "Test Customer")}
                  className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-all hover:shadow-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Test Voice with Current Settings
                  </div>
                </button>
                <p className="text-xs text-blue-600 text-center mt-3">
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
