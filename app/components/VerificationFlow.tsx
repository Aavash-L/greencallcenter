"use client";
import { useState, useEffect } from "react";

interface Props {
  onComplete: (badges: { number: boolean; gps: boolean; recording: boolean }) => void;
  onCancel: () => void;
}

type Step = "sms" | "gps" | "call" | "done";

const CORRECT_CODE = "4827";

export default function VerificationFlow({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState<Step>("sms");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [smsVisible, setSmsVisible] = useState(false);
  const [gpsConfirmed, setGpsConfirmed] = useState(false);
  const [callDone, setCallDone] = useState(false);

  // Show SMS toast after brief delay
  useEffect(() => {
    if (step === "sms") {
      const t = setTimeout(() => setSmsVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [step]);

  // GPS auto-progress
  useEffect(() => {
    if (step === "gps") {
      const t = setTimeout(() => setGpsConfirmed(true), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Call auto-progress
  useEffect(() => {
    if (step === "call") {
      const t = setTimeout(() => setCallDone(true), 3000);
      return () => clearTimeout(t);
    }
  }, [step]);

  function handleCodeSubmit() {
    if (codeInput === CORRECT_CODE) {
      setCodeError(false);
      setStep("gps");
    } else {
      setCodeError(true);
    }
  }

  function handleAutofill() {
    setCodeInput(CORRECT_CODE);
    setCodeError(false);
  }

  function handleGpsNext() {
    setStep("call");
  }

  function handleCallNext() {
    onComplete({ number: true, gps: true, recording: true });
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl animate-slide-in overflow-hidden">
        {/* Header */}
        <div className="bg-[#166534] text-white px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-lg">Verifying Set</span>
            <button onClick={onCancel} className="text-green-200 hover:text-white text-sm">✕ Cancel</button>
          </div>
          {/* Step indicators */}
          <div className="flex gap-2 mt-3">
            {(["sms","gps","call"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? "bg-white text-[#166534]" :
                  (["sms","gps","call"].indexOf(step) > i) ? "bg-green-400 text-white" :
                  "bg-green-700 text-green-300"
                }`}>
                  {(["sms","gps","call"].indexOf(step) > i) ? "✓" : i + 1}
                </div>
                <span className="text-xs text-green-200 hidden sm:inline">
                  {s === "sms" ? "Number" : s === "gps" ? "GPS" : "Recording"}
                </span>
                {i < 2 && <div className="w-4 h-px bg-green-600" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          {/* STEP 1: SMS */}
          {step === "sms" && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">📱</div>
                <div>
                  <div className="font-semibold text-gray-800">Number Verification</div>
                  <div className="text-xs text-gray-500">Texting homeowner a code…</div>
                </div>
              </div>

              {/* SMS Toast */}
              {smsVisible && (
                <div className="bg-gray-100 rounded-2xl p-4 mb-4 animate-fade-in border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-[#166534] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">GS</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700">Green Star Exteriors</div>
                      <div className="text-xs text-gray-400">now</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl px-3 py-2 text-sm text-gray-800 shadow-sm">
                    Your verification code is{" "}
                    <span className="font-bold text-[#166534] text-base tracking-widest">4827</span>
                    . Valid for 5 min.
                  </div>
                </div>
              )}

              {smsVisible && (
                <div className="animate-fade-in">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Homeowner enters code:
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={codeInput}
                      onChange={e => { setCodeInput(e.target.value); setCodeError(false); }}
                      placeholder="_ _ _ _"
                      className={`flex-1 border-2 rounded-xl px-3 py-3 text-center text-xl font-bold tracking-[0.3em] outline-none transition-colors ${
                        codeError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#166534]"
                      }`}
                    />
                  </div>
                  {codeError && (
                    <p className="text-red-500 text-xs mb-2 text-center">❌ Wrong code — try again</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleAutofill}
                      className="flex-1 border border-gray-300 text-gray-600 text-sm rounded-xl py-2 hover:bg-gray-50 transition-colors"
                    >
                      Homeowner enters code ↓
                    </button>
                    <button
                      onClick={handleCodeSubmit}
                      className="flex-1 bg-[#166534] text-white text-sm rounded-xl py-2 font-semibold hover:bg-green-800 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {!smsVisible && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dot-bounce">
                  <span>Sending SMS</span>
                  <span>•</span><span>•</span><span>•</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: GPS */}
          {step === "gps" && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg">📍</div>
                <div>
                  <div className="font-semibold text-gray-800">Location Verification</div>
                  <div className="text-xs text-gray-500">Confirming rep location…</div>
                </div>
              </div>

              {/* Fake map */}
              <div className="relative bg-gradient-to-br from-green-50 to-blue-50 border-2 border-gray-200 rounded-xl h-40 mb-3 overflow-hidden">
                <div className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 19px,#d1d5db 19px,#d1d5db 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,#d1d5db 19px,#d1d5db 20px)"
                  }}
                />
                {/* Roads */}
                <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-white/80 -translate-y-1/2" />
                <div className="absolute top-0 bottom-0 left-1/3 w-1.5 bg-white/80" />
                {/* Blocks */}
                <div className="absolute top-4 left-4 w-12 h-8 bg-gray-200/60 rounded" />
                <div className="absolute top-4 right-4 w-16 h-10 bg-gray-200/60 rounded" />
                <div className="absolute bottom-4 left-8 w-14 h-9 bg-gray-200/60 rounded" />
                <div className="absolute bottom-4 right-8 w-10 h-7 bg-gray-200/60 rounded" />
                {/* Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-sm transition-all ${gpsConfirmed ? "bg-[#166534]" : "bg-orange-400"}`}>
                      📍
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
                {/* Pulse ring */}
                {!gpsConfirmed && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-orange-400 opacity-50 animate-ping" />
                )}
                {gpsConfirmed && (
                  <div className="absolute top-2 left-2 bg-[#166534] text-white text-xs rounded-lg px-2 py-1 animate-fade-in font-medium">
                    ✓ Location confirmed
                  </div>
                )}
              </div>

              {!gpsConfirmed && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dot-bounce">
                  <span>Locking GPS</span>
                  <span>•</span><span>•</span><span>•</span>
                </div>
              )}

              {gpsConfirmed && (
                <div className="animate-fade-in">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 text-sm text-green-800">
                    ✓ GPS verified — matches set address within 0.1 mi
                  </div>
                  <button
                    onClick={handleGpsNext}
                    className="w-full bg-[#166534] text-white rounded-xl py-2.5 font-semibold hover:bg-green-800 transition-colors"
                  >
                    Continue → Confirmation Call
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Call */}
          {step === "call" && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-lg">🎙️</div>
                <div>
                  <div className="font-semibold text-gray-800">Confirmation Call</div>
                  <div className="text-xs text-gray-500">Placing automated call to homeowner…</div>
                </div>
              </div>

              {!callDone && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">📞 Calling homeowner</span>
                    <span className="text-xs text-gray-400">0:00</span>
                  </div>
                  <div className="flex items-center gap-1 dot-bounce">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-xs text-gray-500 ml-1">Ringing</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">•</span>
                  </div>
                </div>
              )}

              {callDone && (
                <div className="animate-fade-in">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">🎙️ Recording captured</span>
                      <span className="text-xs text-gray-500 font-mono">0:08</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">▶</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-[#166534] animate-progress rounded-full" />
                      </div>
                      <span className="text-xs text-gray-400">0:08</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 italic">
                      "…yes, I do have an appointment with Green Star on Friday…"
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 text-sm text-green-800">
                    ✓ Verbal confirmation recorded
                  </div>
                  <button
                    onClick={handleCallNext}
                    className="w-full bg-[#166534] text-white rounded-xl py-2.5 font-semibold hover:bg-green-800 transition-colors"
                  >
                    Submit Set →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
