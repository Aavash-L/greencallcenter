"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { SetRecord } from "./types";
import { SEED_SETS } from "./seedData";

interface StoreCtx {
  sets: SetRecord[];
  addSet: (s: SetRecord) => void;
  toggleFlag: (id: string) => void;
  resetSets: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [sets, setSets] = useState<SetRecord[]>(SEED_SETS);

  const addSet = (s: SetRecord) => setSets((prev) => [s, ...prev]);

  const toggleFlag = (id: string) =>
    setSets((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nowFlagged = s.status !== "Flagged";
        return {
          ...s,
          status: nowFlagged ? "Flagged" : "Verified",
          gpsMismatch: nowFlagged,
          badges: nowFlagged ? { ...s.badges, gps: false } : { ...s.badges, gps: true },
        };
      })
    );

  const resetSets = () => setSets(SEED_SETS);

  return <Ctx.Provider value={{ sets, addSet, toggleFlag, resetSets }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
