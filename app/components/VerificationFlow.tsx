"use client";
import { useState, useEffect } from "react";

interface Props {
  onComplete: (badges: { number: boolean; gps: boolean; recording: boolean }) => void;
  onCancel: () => void;
}

type Step = "sms" | "gps" | "call";
const STEPS: Step[] = ["sms", "gps", "call"];
const CORRECT_CODE = "4827";

export default function VerificationFlow({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState<Step>("sms");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [smsVisible, setSmsVisible] = useState(false);
  const [gpsConfirmed, setGpsConfirmed] = useState(false);
  const [callDone, setCallDone] = useState(false);

  useEffect(() => {
    if (step === "sms") {
      const t = setTimeout(() => setSmsVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (step === "gps") {
      const t = setTimeout(() => setGpsConfirmed(true), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

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

  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl shadow-2xl animate-slide-in flex flex-col max-h-[92vh]">

        {/* Green header */}
        <div className="bg-[#166534] text-white px-5 pt-5 pb-5 rounded-t-3xl sm:rounded-t-2xl shrink-0">
          {/* Drag handle on mobile */}
          <div className="w-10 h-1 bg-green-500 rounded-full mx-auto mb-4 sm:hidden" />

          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-lg">Verifying Set</span>
            <button
              onClick={onCancel}
              className="text-green-200 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              ✕ Cancel
            </button>
          </div>

          {/* Step pills */}
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                  stepIdx === i ? "bg-white text-[#166534] shadow" :
                  stepIdx > i  ? "bg-green-400 text-white" :
                  "bg-green-700 text-green-400"
                }`}>
                  {stepIdx > i ? "✓" : i + 1}
                </div>
                <div className={`flex-1 text-xs font-medium ml-1.5 ${stepIdx >= i ? "text-white" : "text-green-500"}`}>
                  {s === "sms" ? "Number" : s === "gps" ? "GPS" : "Recording"}
                </div>
                {i < 2 && <div className="w-4 h-px bg-green-600 shrink-0 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* STEP 1: SMS */}
          {step === "sms" && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl shrink-0">📱</div>
                <div>
                  <div className="font-semibold text-gray-800">Number Verification</div>
                  <div className="text-sm text-gray-400">Texting homeowner a code…</div>
                </div>
              </div>

              {!smsVisible && (
                <div className="flex items-center gap-2 text-sm text-gray-400 dot-bounce py-2">
                  <span>Sending SMS</span>
                  <span>•</span><span>•</span><span>•</span>
                </div>
              )}

              {smsVisible && (
                <div className="animate-fade-in space-y-4">
                  {/* SMS bubble */}
                  <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 bg-[#166534] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">GS</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-700">Green Star Exteriors</div>
                        <div className="text-xs text-gray-400">now</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-800 shadow-sm leading-relaxed">
                      Your verification code is{" "}
                      <span className="font-bold text-[#166534] text-lg tracking-widest">4827</span>
                      . Valid for 5 min.
                    </div>
                  </div>

                  {/* Code entry */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Homeowner enters code:
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={codeInput}
                      onChange={e => { setCodeInput(e.target.value); setCodeError(false); }}
                      placeholder="_ _ _ _"
                      className={`w-full border-2 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none transition-colors ${
                        codeError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#166534]"
                      }`}
                    />
                    {codeError && (
                      <p className="text-red-500 text-sm mt-2 text-center">❌ Wrong code — try again</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setCodeInput(CORRECT_CODE); setCodeError(false); }}
                      className="flex-1 border-2 border-gray-200 text-gray-600 text-sm rounded-xl py-3.5 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                      Autofill code ↓
                    </button>
                    <button
                      onClick={handleCodeSubmit}
                      className="flex-1 bg-[#166534] text-white text-sm rounded-xl py-3.5 font-semibold hover:bg-green-800 active:scale-[0.98] transition-all"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: GPS */}
          {step === "gps" && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl shrink-0">📍</div>
                <div>
                  <div className="font-semibold text-gray-800">Location Verification</div>
                  <div className="text-sm text-gray-400">Confirming rep location…</div>
                </div>
              </div>

              {/* Fake map */}
              <div className="relative bg-gradient-to-br from-green-50 to-blue-50 border-2 border-gray-200 rounded-2xl h-44 overflow-hidden">
                <div className="absolute inset-0 opacity-25"
                  style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 19px,#d1d5db 19px,#d1d5db 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,#d1d5db 19px,#d1d5db 20px)" }}
                />
                <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-white/80 -translate-y-1/2" />
                <div className="absolute top-0 bottom-0 left-1/3 w-1.5 bg-white/80" />
                <div className="absolute top-5 left-5 w-14 h-9 bg-gray-200/60 rounded-lg" />
                <div className="absolute top-5 right-5 w-16 h-11 bg-gray-200/60 rounded-lg" />
                <div className="absolute bottom-5 left-8 w-12 h-8 bg-gray-200/60 rounded-lg" />
                <div className="absolute bottom-5 right-8 w-10 h-7 bg-gray-200/60 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                  <div className={`w-9 h-9 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-base transition-all ${gpsConfirmed ? "bg-[#166534]" : "bg-orange-400"}`}>
                    📍
                  </div>
                </div>
                {!gpsConfirmed && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-orange-400 opacity-50 animate-ping" />
                )}
                {gpsConfirmed && (
                  <div className="absolute top-3 left-3 bg-[#166534] text-white text-xs rounded-lg px-2.5 py-1.5 animate-fade-in font-medium">
                    ✓ Location confirmed
                  </div>
                )}
              </div>

              {!gpsConfirmed && (
                <div className="flex items-center gap-2 text-sm text-gray-400 dot-bounce">
                  <span>Locking GPS</span>
                  <span>•</span><span>•</span><span>•</span>
                </div>
              )}

              {gpsConfirmed && (
                <div className="animate-fade-in space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
                    ✓ GPS verified — matches set address within 0.1 mi
                  </div>
                  <button
                    onClick={() => setStep("call")}
                    className="w-full bg-[#166534] text-white rounded-xl py-4 font-semibold hover:bg-green-800 active:scale-[0.98] transition-all"
                  >
                    Continue → Confirmation Call
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Call */}
          {step === "call" && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl shrink-0">🎙️</div>
                <div>
                  <div className="font-semibold text-gray-800">Confirmation Call</div>
                  <div className="text-sm text-gray-400">Placing automated call to homeowner…</div>
                </div>
              </div>

              {!callDone && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">📞 Calling homeowner</span>
                    <span className="text-xs text-gray-400 font-mono">0:00</span>
                  </div>
                  <div className="flex items-center gap-2 dot-bounce">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-sm text-gray-500 ml-1">Ringing</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-300">•</span>
                  </div>
                </div>
              )}

              {callDone && (
                <div className="animate-fade-in space-y-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
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
                    <p className="mt-3 text-sm text-gray-400 italic">
                      "…yes, I do have an appointment with Green Star on Friday…"
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
                    ✓ Verbal confirmation recorded
                  </div>
                  <button
                    onClick={() => onComplete({ number: true, gps: true, recording: true })}
                    className="w-full bg-[#166534] text-white rounded-xl py-4 font-semibold hover:bg-green-800 active:scale-[0.98] transition-all"
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
