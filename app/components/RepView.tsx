"use client";
import { useState } from "react";
import { useStore } from "../store";
import { SetRecord, Product } from "../types";
import VerificationFlow from "./VerificationFlow";
import AddressAutocomplete from "./AddressAutocomplete";

type Screen = "home" | "form" | "verifying" | "done";

const PRODUCTS: Product[] = ["Roof", "Siding", "Windows", "Doors"];
const PRODUCT_ICONS: Record<Product, string> = { Roof: "🏠", Siding: "🧱", Windows: "🪟", Doors: "🚪" };

const INPUT =
  "w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]/20 transition-colors bg-white";

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
        <div className="max-w-lg mx-auto px-4 pt-10 text-center text-gray-400 text-sm">
          Verification in progress…
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
      <div className="max-w-lg mx-auto px-4 pt-8 pb-12 animate-fade-in">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✅</div>
          <h2 className="text-2xl font-bold text-gray-800">Set Sent to Dispatch</h2>
          <p className="text-gray-400 mt-1">All verifications complete</p>
        </div>

        {/* Receipt card */}
        <div className="bg-white border-2 border-green-200 rounded-2xl overflow-hidden shadow-sm mb-5">
          {/* Card header */}
          <div className="px-5 py-4 flex items-start justify-between border-b border-gray-100">
            <div>
              <div className="font-bold text-gray-800 text-base">{lastSet.homeownerName}</div>
              <div className="text-sm text-gray-400 mt-0.5">{lastSet.address}</div>
            </div>
            <div className="bg-[#166534] text-white text-xs px-2.5 py-1 rounded-lg font-medium shrink-0 ml-3">
              {lastSet.id}
            </div>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { icon: "📱", label: "Number", active: lastSet.badges.number },
              { icon: "📍", label: "GPS", active: lastSet.badges.gps },
              { icon: "🎙️", label: "Recording", active: lastSet.badges.recording },
            ].map(b => (
              <div key={b.label} className="flex flex-col items-center py-4 gap-1">
                <span className={`text-2xl ${b.active ? "" : "grayscale opacity-30"}`}>{b.icon}</span>
                <span className={`text-xs font-semibold ${b.active ? "text-green-700" : "text-gray-400"}`}>
                  {b.active ? "✓" : "✗"} {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="px-5 pb-4 pt-1 space-y-2.5">
            {[
              { label: "Rep", value: "Aavash" },
              { label: "Product", value: `${PRODUCT_ICONS[lastSet.product]} ${lastSet.product}` },
              { label: "Appointment", value: `${lastSet.apptDate} · ${lastSet.apptTime}` },
              { label: "Submitted", value: formatTime(lastSet.submittedAt) },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{r.label}</span>
                <span className="text-sm font-medium text-gray-700">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setScreen("home")}
          className="w-full bg-[#166534] text-white rounded-2xl py-4 font-semibold text-base hover:bg-green-800 active:scale-[0.98] transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (screen === "form") {
    return (
      <div className="max-w-lg mx-auto px-4 pt-4 pb-12 animate-fade-in">
        {/* Back nav */}
        <button
          onClick={() => setScreen("home")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-5 -ml-1 py-2 px-1"
        >
          <span className="text-xl leading-none">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">Log New Set</h2>

        <form onSubmit={handleSubmitForm} className="space-y-5">
          <Field label="Homeowner Name">
            <input
              required
              value={form.homeownerName}
              onChange={e => setForm(f => ({ ...f, homeownerName: e.target.value }))}
              placeholder="Full name"
              className={INPUT}
            />
          </Field>

          <Field label="Phone Number">
            <input
              required
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                const formatted =
                  digits.length <= 3 ? digits :
                  digits.length <= 6 ? `${digits.slice(0,3)}-${digits.slice(3)}` :
                  `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
                setForm(f => ({ ...f, phone: formatted }));
              }}
              placeholder="111-123-3456"
              maxLength={12}
              className={INPUT}
            />
          </Field>

          <Field label="Address">
            <AddressAutocomplete
              required
              value={form.address}
              onChange={val => setForm(f => ({ ...f, address: val }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Appt Date">
              <input
                required
                type="date"
                value={form.apptDate}
                onChange={e => setForm(f => ({ ...f, apptDate: e.target.value }))}
                className={INPUT}
              />
            </Field>
            <Field label="Appt Time">
              <input
                required
                type="time"
                value={form.apptTime}
                onChange={e => setForm(f => ({ ...f, apptTime: e.target.value }))}
                className={INPUT}
              />
            </Field>
          </div>

          <Field label="Product Interest">
            <div className="grid grid-cols-4 gap-2">
              {PRODUCTS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, product: p }))}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold transition-all active:scale-95 ${
                    form.product === p
                      ? "border-[#166534] bg-green-50 text-[#166534]"
                      : "border-gray-200 text-gray-500 bg-white"
                  }`}
                >
                  <span className="text-xl">{PRODUCT_ICONS[p]}</span>
                  {p}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any relevant details…"
              rows={3}
              className={`${INPUT} resize-none`}
            />
          </Field>

          <button
            type="submit"
            className="w-full bg-[#166534] text-white rounded-2xl py-4 font-bold text-base hover:bg-green-800 active:scale-[0.98] transition-all shadow-lg shadow-green-900/20 mt-2"
          >
            Verify & Submit Set →
          </button>
        </form>
      </div>
    );
  }

  // Home screen
  return (
    <div className="max-w-lg mx-auto px-4 pt-7 pb-12">
      {/* Greeting */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-[#166534] rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0">
          A
        </div>
        <div>
          <div className="font-bold text-gray-800 text-xl">Hey, Aavash 👋</div>
          <div className="text-gray-400 text-sm mt-0.5">
            {todaySets.length === 0 ? "No sets yet today" : `${todaySets.length} set${todaySets.length > 1 ? "s" : ""} today`}
          </div>
        </div>
      </div>

      {/* Big CTA */}
      <button
        onClick={() => setScreen("form")}
        className="w-full bg-[#166534] text-white rounded-2xl py-5 font-bold text-lg shadow-xl shadow-green-900/25 hover:bg-green-800 active:scale-[0.98] transition-all mb-8 flex items-center justify-center gap-3"
      >
        <span className="text-2xl font-light">+</span>
        Log New Set
      </button>

      {/* Today's sets */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Today&apos;s Submitted Sets
        </h3>
        {todaySets.length === 0 ? (
          <div className="text-center text-gray-300 text-sm py-12 border-2 border-dashed border-gray-200 rounded-2xl">
            No sets yet — go knock! 🚪
          </div>
        ) : (
          <div className="space-y-2.5">
            {todaySets.map(s => (
              <div
                key={s.id}
                className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-sm"
              >
                <div className="min-w-0 mr-3">
                  <div className="font-semibold text-gray-800">{s.homeownerName}</div>
                  <div className="text-sm text-gray-400 truncate mt-0.5">{s.address}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex gap-1">
                    {s.badges.number && <span className="text-base">📱</span>}
                    {s.badges.gps && <span className="text-base">📍</span>}
                    {s.badges.recording && <span className="text-base">🎙️</span>}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
