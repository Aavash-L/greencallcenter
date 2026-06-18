"use client";
import { SetRecord } from "../types";

interface Props {
  set: SetRecord;
  onClose: () => void;
  onToggleFlag: () => void;
}

export default function SetDrawer({ set, onClose, onToggleFlag }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Drawer */}
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 px-5 pt-5 pb-4 border-b ${set.status === "Flagged" ? "bg-red-50 border-red-100" : "bg-white border-gray-100"}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-gray-900 text-lg">{set.homeownerName}</div>
              <div className="text-sm text-gray-500">{set.address}</div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-3 text-xl leading-none">✕</button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {set.status === "Flagged" ? (
              <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-semibold">⚠ Flagged</span>
            ) : (
              <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold">✓ Verified</span>
            )}
            <span className="text-xs text-gray-400 font-mono">{set.id}</span>
          </div>
          {set.gpsMismatch && (
            <div className="mt-2 bg-red-100 border border-red-300 rounded-xl px-3 py-2 text-xs text-red-800 font-medium">
              ⚠️ GPS MISMATCH — rep location ≠ set address — possible fake set
            </div>
          )}
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Set details */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Set Details</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <Row label="Rep" value={set.repName} />
              <Row label="Phone" value={set.phone} />
              <Row label="Appointment" value={`${set.apptDate} at ${set.apptTime}`} />
              <Row label="Product" value={set.product} />
              {set.notes && <Row label="Notes" value={set.notes} />}
            </div>
          </section>

          {/* Verification badges */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Verification</h3>
            <div className="grid grid-cols-3 gap-3">
              <VerifCard
                icon="📱"
                label="Number"
                active={set.badges.number}
                detail="SMS code confirmed"
              />
              <VerifCard
                icon={set.gpsMismatch ? "❌" : "📍"}
                label="GPS"
                active={set.badges.gps}
                detail={set.gpsMismatch ? "Mismatch detected" : "Location confirmed"}
                error={set.gpsMismatch}
              />
              <VerifCard
                icon="🎙️"
                label="Recording"
                active={set.badges.recording}
                detail="0:08 captured"
              />
            </div>
          </section>

          {/* GPS mini map */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">GPS Location</h3>
            <div className={`relative border-2 rounded-xl h-36 overflow-hidden ${set.gpsMismatch ? "border-red-300 bg-red-50" : "border-gray-200 bg-gradient-to-br from-green-50 to-blue-50"}`}>
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 15px,#9ca3af 15px,#9ca3af 16px),repeating-linear-gradient(90deg,transparent,transparent 15px,#9ca3af 15px,#9ca3af 16px)"
                }}
              />
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/70 -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-2/5 w-1 bg-white/70" />

              {/* Set address pin (green) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                <div className="w-7 h-7 bg-[#166534] rounded-full border-2 border-white shadow flex items-center justify-center text-xs">📍</div>
              </div>

              {/* Mismatched rep pin (red) */}
              {set.gpsMismatch && (
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-full">
                  <div className="w-7 h-7 bg-red-500 rounded-full border-2 border-white shadow flex items-center justify-center text-xs">🔴</div>
                </div>
              )}

              <div className={`absolute bottom-2 left-2 text-xs rounded-lg px-2 py-1 font-medium ${set.gpsMismatch ? "bg-red-500 text-white" : "bg-[#166534] text-white"}`}>
                {set.gpsMismatch ? "⚠ 2.4 mi mismatch" : "✓ Location confirmed"}
              </div>

              {set.gpsMismatch && (
                <div className="absolute bottom-2 right-2 bg-white border border-red-200 text-xs text-red-600 rounded-lg px-2 py-1">
                  📍 Set addr &nbsp; 🔴 Rep loc
                </div>
              )}
            </div>
          </section>

          {/* Recording play bar */}
          {set.badges.recording && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Recording</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">🎙️ Verbal Confirmation</span>
                  <span className="text-xs text-gray-500 font-mono">0:08</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">▶</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-[#166534] w-0 hover:w-full transition-all duration-[8000ms] rounded-full cursor-pointer" />
                  </div>
                  <span className="text-xs text-gray-400">0:08</span>
                </div>
                <div className="mt-2 text-xs text-gray-500 italic">
                  "…yes, I do have an appointment with Green Star on Friday…"
                </div>
              </div>
            </section>
          )}

          {/* Audit trail */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Audit Trail</h3>
            <div className="space-y-1">
              {set.auditTrail.map((entry, i) => (
                <div key={i} className={`flex gap-3 text-xs py-1.5 px-3 rounded-lg ${entry.event.includes("MISMATCH") || entry.event.includes("⚠") || entry.event.includes("flagged") ? "bg-red-50 text-red-700" : "text-gray-600"}`}>
                  <span className="font-mono text-gray-400 shrink-0">{entry.time}</span>
                  <span>{entry.event}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Demo toggle */}
          <section className="border-t border-dashed border-gray-200 pt-4">
            <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Demo Controls</div>
            <button
              onClick={onToggleFlag}
              className={`w-full py-2 rounded-xl text-sm font-medium border transition-colors ${
                set.status === "Flagged"
                  ? "border-green-300 text-green-700 hover:bg-green-50"
                  : "border-red-300 text-red-600 hover:bg-red-50"
              }`}
            >
              {set.status === "Flagged" ? "↩ Mark as Verified" : "⚠️ Simulate GPS Mismatch (Fake Set)"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-800 text-right">{value}</span>
    </div>
  );
}

function VerifCard({ icon, label, active, detail, error }: { icon: string; label: string; active: boolean; detail: string; error?: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center border ${
      error ? "bg-red-50 border-red-200" :
      active ? "bg-green-50 border-green-200" :
      "bg-gray-50 border-gray-100 opacity-50"
    }`}>
      <div className="text-xl mb-1">{icon}</div>
      <div className={`text-xs font-semibold ${error ? "text-red-700" : active ? "text-green-700" : "text-gray-400"}`}>{label}</div>
      <div className={`text-xs mt-0.5 ${error ? "text-red-500" : "text-gray-400"}`}>{detail}</div>
    </div>
  );
}
