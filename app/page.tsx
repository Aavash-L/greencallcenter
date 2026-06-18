"use client";
import { useState } from "react";
import RepView from "./components/RepView";
import DispatchDashboard from "./components/DispatchDashboard";
import { useStore } from "./store";

export default function Home() {
  const [view, setView] = useState<"rep" | "dispatch">("rep");
  const { resetSets } = useStore();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#166534] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#166534] font-black text-sm">SP</span>
            </div>
            <div>
              <div className="font-bold text-base leading-tight">SetProof</div>
              <div className="text-green-200 text-xs">Green Star Exteriors</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetSets}
              className="text-xs text-green-200 border border-green-600 px-2 py-1 rounded hover:bg-green-700 transition-colors"
            >
              Reset Demo
            </button>
            <div className="bg-green-700 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setView("rep")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === "rep" ? "bg-white text-[#166534]" : "text-green-100 hover:text-white"
                }`}
              >
                📱 Rep
              </button>
              <button
                onClick={() => setView("dispatch")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === "dispatch" ? "bg-white text-[#166534]" : "text-green-100 hover:text-white"
                }`}
              >
                🖥 Dispatch
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {view === "rep" ? <RepView /> : <DispatchDashboard />}
      </main>

      <footer className="text-center py-3 text-xs text-gray-400 border-t border-gray-100">
        Powered by ClearForge Labs
      </footer>
    </div>
  );
}
