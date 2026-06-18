"use client";
import { useState } from "react";
import { useStore } from "../store";
import { SetRecord, Product } from "../types";
import VerificationFlow from "./VerificationFlow";

type Screen = "home" | "form" | "verifying" | "done";

const PRODUCTS: Product[] = ["Roof", "Siding", "Windows", "Doors"];
const PRODUCT_ICONS: Record<Product, string> = { Roof: "🏠", Siding: "🧱", Windows: "🪟", Doors: "🚪" };

function genId() {
  return "SET-" + Math.random().toString(36).slice(2, 5).toUpperCase() + Date.now().toString().slice(-3);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function RepView() {
  const { sets, addSet } = useStore();
  const [screen, setScreen] = useState<Screen>("home");
  const [lastSet, setLastSet] = useState<SetRecord | null>(null);

  const [form, setForm] = useState({
    homeownerName: "",
    phone: "",
    address: "",
    apptDate: "",
    apptTime: "",
    product: "Roof" as Product,
    notes: "",
  });

  const todaySets = sets.filter(s => s.repName === "Aavash");

  function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setScreen("verifying");
  }

  function handleVerificationComplete(badges: { number: boolean; gps: boolean; recording: boolean }) {
    const now = new Date().toISOString();
    const id = genId();
    const record: SetRecord = {
      id,
      repName: "Aavash",
      homeownerName: form.homeownerName,
      phone: form.phone,
      address: form.address,
      apptDate: form.apptDate,
      apptTime: form.apptTime,
      product: form.product,
      notes: form.notes,
      submittedAt: now,
      status: "Verified",
      badges,
      gpsMismatch: false,
      auditTrail: [
        { time: new Date(now).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), event: `Set form submitted by Aavash` },
        { time: new Date(Date.now() + 3000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), event: `SMS code 4827 sent to ${form.phone}` },
        { time: new Date(Date.now() + 18000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), event: "Homeowner entered correct code — number verified ✓" },
        { time: new Date(Date.now() + 19000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), event: `GPS location captured — matches ${form.address} ✓` },
        { time: new Date(Date.now() + 20000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), event: "Confirmation call placed" },
        { time: new Date(Date.now() + 28000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), event: "0:08 verbal recording captured ✓" },
        { time: new Date(Date.now() + 29000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), event: "Set dispatched — status: Verified" },
      ],
    };
    addSet(record);
    setLastSet(record);
    setScreen("done");
    setForm({ homeownerName: "", phone: "", address: "", apptDate: "", apptTime: "", product: "Roof", notes: "" });
  }

  if (screen === "verifying") {
    return (
      <>
        <div className="max-w-sm mx-auto px-4 pt-8">
          <div className="text-center text-gray-400 text-sm">Verification in progress…</div>
        </div>
        <VerificationFlow
          onComplete={handleVerificationComplete}
          onCancel={() => setScreen("form")}
        />
      </>
    );
  }

  if (screen === "done" && lastSet) {
    return (
      <div className="max-w-sm mx-auto px-4 pt-6 pb-10 animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">✅</div>
          <h2 className="text-xl font-bold text-gray-800">Set Sent to Dispatch</h2>
          <p className="text-gray-500 text-sm mt-1">All verifications complete</p>
        </div>

        {/* Receipt card */}
        <div className="bg-white border-2 border-green-200 rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
            <div>
              <div className="font-bold text-gray-800">{lastSet.homeownerName}</div>
              <div className="text-xs text-gray-500">{lastSet.address}</div>
            </div>
            <div className="bg-[#166534] text-white text-xs px-2 py-1 rounded-lg font-medium">
              {lastSet.id}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <div className={`text-xl mb-1 ${lastSet.badges.number ? "" : "opacity-30"}`}>📱</div>
              <div className={`text-xs font-medium ${lastSet.badges.number ? "text-green-700" : "text-gray-400"}`}>
                {lastSet.badges.number ? "✓ Number" : "✗ Number"}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-xl mb-1 ${lastSet.badges.gps ? "" : "opacity-30"}`}>📍</div>
              <div className={`text-xs font-medium ${lastSet.badges.gps ? "text-green-700" : "text-gray-400"}`}>
                {lastSet.badges.gps ? "✓ GPS" : "✗ GPS"}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-xl mb-1 ${lastSet.badges.recording ? "" : "opacity-30"}`}>🎙️</div>
              <div className={`text-xs font-medium ${lastSet.badges.recording ? "text-green-700" : "text-gray-400"}`}>
                {lastSet.badges.recording ? "✓ Recording" : "✗ Recording"}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
            <div className="flex justify-between"><span className="font-medium">Rep</span><span>Aavash</span></div>
            <div className="flex justify-between"><span className="font-medium">Product</span><span>{PRODUCT_ICONS[lastSet.product]} {lastSet.product}</span></div>
            <div className="flex justify-between"><span className="font-medium">Appointment</span><span>{lastSet.apptDate} {lastSet.apptTime}</span></div>
            <div className="flex justify-between"><span className="font-medium">Submitted</span><span>{formatTime(lastSet.submittedAt)}</span></div>
          </div>
        </div>

        <button
          onClick={() => setScreen("home")}
          className="w-full bg-[#166534] text-white rounded-2xl py-3 font-semibold hover:bg-green-800 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (screen === "form") {
    return (
      <div className="max-w-sm mx-auto px-4 pt-4 pb-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setScreen("home")} className="text-gray-400 hover:text-gray-600">← </button>
          <h2 className="text-lg font-bold text-gray-800">Log New Set</h2>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Homeowner Name *</label>
            <input
              required
              value={form.homeownerName}
              onChange={e => setForm(f => ({ ...f, homeownerName: e.target.value }))}
              placeholder="Full name"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#166534] transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number *</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="(xxx) xxx-xxxx"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#166534] transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Address *</label>
            <input
              required
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="123 Main St, City, NJ"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#166534] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Appt Date *</label>
              <input
                required
                type="date"
                value={form.apptDate}
                onChange={e => setForm(f => ({ ...f, apptDate: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#166534] transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Appt Time *</label>
              <input
                required
                type="time"
                value={form.apptTime}
                onChange={e => setForm(f => ({ ...f, apptTime: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#166534] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Product Interest *</label>
            <div className="grid grid-cols-4 gap-2">
              {PRODUCTS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, product: p }))}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                    form.product === p
                      ? "border-[#166534] bg-green-50 text-[#166534]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">{PRODUCT_ICONS[p]}</span>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any relevant details…"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#166534] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#166534] text-white rounded-2xl py-3.5 font-bold text-base hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20"
          >
            Verify & Submit Set →
          </button>
        </form>
      </div>
    );
  }

  // Home screen
  return (
    <div className="max-w-sm mx-auto px-4 pt-6 pb-10">
      {/* Rep greeting */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#166534] rounded-full flex items-center justify-center text-white font-bold text-lg">A</div>
        <div>
          <div className="font-bold text-gray-800 text-lg">Hey, Aavash 👋</div>
          <div className="text-sm text-gray-500">Today&apos;s sets: {todaySets.length}</div>
        </div>
      </div>

      {/* Big CTA */}
      <button
        onClick={() => setScreen("form")}
        className="w-full bg-[#166534] text-white rounded-2xl py-5 font-bold text-lg shadow-xl shadow-green-900/30 hover:bg-green-800 active:scale-95 transition-all mb-6 flex items-center justify-center gap-3"
      >
        <span className="text-2xl">+</span>
        Log New Set
      </button>

      {/* Today's sets */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Today&apos;s Submitted Sets</h3>
        {todaySets.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">No sets yet today — go knock!</div>
        ) : (
          <div className="space-y-2">
            {todaySets.map(s => (
              <div key={s.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{s.homeownerName}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[180px]">{s.address}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {s.badges.number && <span title="Number" className="text-sm">📱</span>}
                    {s.badges.gps && <span title="GPS" className="text-sm">📍</span>}
                    {s.badges.recording && <span title="Recording" className="text-sm">🎙️</span>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    s.status === "Verified" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
