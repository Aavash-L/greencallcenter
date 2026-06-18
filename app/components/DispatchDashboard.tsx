"use client";
import { useState } from "react";
import { useStore } from "../store";
import { SetRecord } from "../types";
import SetDrawer from "./SetDrawer";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function DispatchDashboard() {
  const { sets, toggleFlag } = useStore();
  const [selected, setSelected] = useState<SetRecord | null>(null);

  const total = sets.length;
  const verified = sets.filter(s => s.status === "Verified").length;
  const flagged = sets.filter(s => s.status === "Flagged").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Sets Today" value={total} color="blue" />
        <StatCard label="Verified" value={verified} color="green" />
        <StatCard label="Flagged" value={flagged} color="red" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Incoming Sets</h2>
          <span className="text-xs text-gray-400">Newest first • Click row for details</span>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Rep</th>
                <th className="px-4 py-3 text-left">Homeowner</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Appt</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Verification</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Demo</th>
              </tr>
            </thead>
            <tbody>
              {sets.map((s, i) => (
                <tr
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`border-t border-gray-50 cursor-pointer transition-colors ${
                    s.status === "Flagged"
                      ? "bg-red-50 hover:bg-red-100"
                      : "hover:bg-gray-50"
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{formatTime(s.submittedAt)}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.repName}</td>
                  <td className="px-4 py-3 text-gray-700">{s.homeownerName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[180px] truncate">{s.address}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{s.apptDate}<br />{s.apptTime}</td>
                  <td className="px-4 py-3 text-gray-600">{s.product}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Badge icon="📱" active={s.badges.number} label="Number" />
                      <Badge icon="📍" active={s.badges.gps} label="GPS" mismatch={s.gpsMismatch} />
                      <Badge icon="🎙️" active={s.badges.recording} label="Call" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={s.status} />
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggleFlag(s.id)}
                      className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                        s.status === "Flagged"
                          ? "border-green-300 text-green-700 hover:bg-green-50"
                          : "border-red-200 text-red-500 hover:bg-red-50"
                      }`}
                    >
                      {s.status === "Flagged" ? "↩ Unflag" : "⚠️ Flag"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-50">
          {sets.map(s => (
            <div
              key={s.id}
              onClick={() => setSelected(s)}
              className={`px-4 py-3 cursor-pointer ${s.status === "Flagged" ? "bg-red-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{s.homeownerName}</div>
                  <div className="text-xs text-gray-500">{s.repName} · {formatTime(s.submittedAt)}</div>
                  <div className="text-xs text-gray-400 truncate max-w-[200px]">{s.address}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusPill status={s.status} />
                  <div className="flex gap-1">
                    <Badge icon="📱" active={s.badges.number} label="" />
                    <Badge icon="📍" active={s.badges.gps} label="" mismatch={s.gpsMismatch} />
                    <Badge icon="🎙️" active={s.badges.recording} label="" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GPS Mismatch alert banner if any flagged */}
      {flagged > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3 animate-fade-in">
          <span className="text-xl">⚠️</span>
          <div>
            <div className="font-semibold text-red-800 text-sm">Fraud Detection Alert</div>
            <div className="text-xs text-red-700 mt-0.5">
              {flagged} set{flagged > 1 ? "s" : ""} flagged for GPS mismatch — rep location did not match the set address.
              This catches fraud a phone call verification cannot.
            </div>
          </div>
        </div>
      )}

      {selected && (
        <SetDrawer
          set={selected}
          onClose={() => setSelected(null)}
          onToggleFlag={() => { toggleFlag(selected.id); setSelected(s => s ? { ...s, status: s.status === "Flagged" ? "Verified" : "Flagged", gpsMismatch: s.status !== "Flagged" } : null); }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: "blue" | "green" | "red" }) {
  const colors = {
    blue:  "bg-blue-50 border-blue-100 text-blue-800",
    green: "bg-green-50 border-green-100 text-green-800",
    red:   "bg-red-50 border-red-100 text-red-800",
  };
  const numColors = { blue: "text-blue-700", green: "text-green-700", red: "text-red-700" };
  return (
    <div className={`${colors[color]} border rounded-xl px-4 py-3 sm:py-4`}>
      <div className={`text-2xl sm:text-3xl font-bold ${numColors[color]}`}>{value}</div>
      <div className="text-xs font-medium mt-0.5 opacity-80">{label}</div>
    </div>
  );
}

function Badge({ icon, active, label, mismatch }: { icon: string; active: boolean; label: string; mismatch?: boolean }) {
  return (
    <span
      title={label}
      className={`text-sm ${active && !mismatch ? "opacity-100" : mismatch ? "opacity-100" : "opacity-25 grayscale"}`}
    >
      {mismatch ? "❌" : icon}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "Verified") {
    return <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">✓ Verified</span>;
  }
  if (status === "Flagged") {
    return <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap animate-pulse">⚠ Flagged</span>;
  }
  return <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">Pending</span>;
}
