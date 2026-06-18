"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface PhotonFeature {
  properties: {
    name?: string;
    housenumber?: string;
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    type?: string;
  };
}

function formatAddress(f: PhotonFeature): string {
  const p = f.properties;
  const parts: string[] = [];
  if (p.housenumber && p.street) parts.push(`${p.housenumber} ${p.street}`);
  else if (p.street) parts.push(p.street);
  else if (p.name) parts.push(p.name);
  if (p.city) parts.push(p.city);
  if (p.state) parts.push(p.state);
  if (p.postcode) parts.push(p.postcode);
  return parts.join(", ");
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

// NJ/PA bounding box: lon_min, lat_min, lon_max, lat_max
const BBOX = "-76.5,38.8,-73.8,41.5";

export default function AddressAutocomplete({ value, onChange, required }: Props) {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lang=en&bbox=${BBOX}&layer=house&layer=street`;
      const res = await fetch(url);
      const data = await res.json();
      const addresses: string[] = (data.features as PhotonFeature[])
        .map(formatAddress)
        .filter(Boolean)
        .filter((a, i, arr) => arr.indexOf(a) === i); // dedupe
      setResults(addresses);
      setOpen(addresses.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  }

  useEffect(() => {
    setHighlighted(0);
  }, [results]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKey(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === "Enter")     { e.preventDefault(); onChange(results[highlighted]); setOpen(false); }
    if (e.key === "Escape")    { setOpen(false); }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          required={required}
          value={value}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Start typing an address…"
          autoComplete="off"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#166534] transition-colors pr-8"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-[#166534] rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {results.map((s, i) => {
            const comma = s.indexOf(",");
            const street = comma !== -1 ? s.slice(0, comma) : s;
            const rest   = comma !== -1 ? s.slice(comma + 1).trim() : "";
            return (
              <li
                key={s}
                onMouseDown={() => { onChange(s); setOpen(false); }}
                onMouseEnter={() => setHighlighted(i)}
                className={`flex items-start gap-2 px-3 py-2.5 cursor-pointer text-sm transition-colors ${i === highlighted ? "bg-green-50" : "hover:bg-gray-50"}`}
              >
                <span className="text-[#166534] mt-0.5 shrink-0">📍</span>
                <span>
                  <span className="font-medium text-gray-800">{street}</span>
                  {rest && <span className="text-gray-400">, {rest}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
