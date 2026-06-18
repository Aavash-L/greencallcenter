"use client";
import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  // NJ - Bergen County
  "14 Maple Ave, Hackensack, NJ 07601",
  "88 River Rd, Hackensack, NJ 07601",
  "231 Main St, Hackensack, NJ 07601",
  "5 Oak St, Teaneck, NJ 07666",
  "120 Cedar Ln, Teaneck, NJ 07666",
  "67 Palisade Ave, Teaneck, NJ 07666",
  "9 Birch Rd, Paramus, NJ 07652",
  "402 Forest Ave, Paramus, NJ 07652",
  "18 Spring Valley Rd, Paramus, NJ 07652",
  "33 Washington Ave, Fort Lee, NJ 07024",
  "77 Lemoine Ave, Fort Lee, NJ 07024",
  "204 Center Ave, Westwood, NJ 07675",
  "55 Chestnut St, Westwood, NJ 07675",
  "12 Elm St, Ridgewood, NJ 07450",
  "340 Franklin Tpke, Ridgewood, NJ 07450",
  "88 Maple Ave, Ridgewood, NJ 07450",
  "22 Orchard Rd, Lyndhurst, NJ 07071",
  "84 Maple Ave, Rutherford, NJ 07070",
  "17 Cedar Ct, Hasbrouck Heights, NJ 07604",
  "6 Union Ave, Rutherford, NJ 07070",
  "143 Park Ave, Rutherford, NJ 07070",
  "29 Kipp Ave, Hasbrouck Heights, NJ 07604",
  "51 Boulevard, Hasbrouck Heights, NJ 07604",
  "100 Terrace Ave, Hasbrouck Heights, NJ 07604",
  // NJ - Essex County
  "45 Grove St, Montclair, NJ 07042",
  "280 Bloomfield Ave, Montclair, NJ 07042",
  "19 Highland Ave, Montclair, NJ 07042",
  "312 Park St, Upper Montclair, NJ 07043",
  "7 Elm Rd, West Orange, NJ 07052",
  "159 Eagle Rock Ave, West Orange, NJ 07052",
  "88 Prospect Ave, West Orange, NJ 07052",
  "23 Valley Rd, Verona, NJ 07044",
  "67 Pompton Ave, Verona, NJ 07044",
  "14 Fairview Ave, Caldwell, NJ 07006",
  "320 Bloomfield Ave, Caldwell, NJ 07006",
  // NJ - Hudson County
  "50 Journal Square, Jersey City, NJ 07306",
  "118 Garfield Ave, Jersey City, NJ 07305",
  "77 Central Ave, Jersey City, NJ 07307",
  "203 Summit Ave, Jersey City, NJ 07304",
  "15 Palisade Ave, Cliffside Park, NJ 07010",
  "88 Anderson Ave, Fairview, NJ 07022",
  "32 Main St, Kearny, NJ 07032",
  "9 Birch Lane, Kearny, NJ 07032",
  "200 Harrison Ave, Harrison, NJ 07029",
  // NJ - Passaic County
  "55 Oak Blvd, Clifton, NJ 07011",
  "18 Allwood Rd, Clifton, NJ 07012",
  "331 Elm St, Garfield, NJ 07026",
  "100 Lanza Ave, Garfield, NJ 07026",
  "250 Market St, Paterson, NJ 07501",
  "77 Broadway, Paterson, NJ 07505",
  "42 Pine St, Hawthorne, NJ 07506",
  "85 Lafayette Ave, Hawthorne, NJ 07506",
  "9 Lincoln Ave, Pompton Lakes, NJ 07442",
  // NJ - Union County
  "36 North Ave, Westfield, NJ 07090",
  "199 Central Ave, Westfield, NJ 07090",
  "12 Elm St, Cranford, NJ 07016",
  "88 Springfield Ave, Springfield, NJ 07081",
  "40 Millburn Ave, Millburn, NJ 07041",
  "310 Main St, Chatham, NJ 07928",
  // NJ - Morris County
  "1 South St, Morristown, NJ 07960",
  "47 Madison Ave, Morristown, NJ 07960",
  "88 Ridgedale Ave, Florham Park, NJ 07932",
  "20 Columbia Tpke, Florham Park, NJ 07932",
  "55 Jefferson Rd, Parsippany, NJ 07054",
  "120 Route 46, Parsippany, NJ 07054",
  "14 Green Village Rd, Madison, NJ 07940",
  "33 Kings Rd, Madison, NJ 07940",
  // NJ - Middlesex County
  "100 Raritan Ave, Highland Park, NJ 08904",
  "50 Livingston Ave, New Brunswick, NJ 08901",
  "22 French St, New Brunswick, NJ 08901",
  "77 Washington Ave, Piscataway, NJ 08854",
  "15 Stelton Rd, Piscataway, NJ 08854",
  "300 US-9, Woodbridge, NJ 07095",
  "40 Main St, Woodbridge, NJ 07095",
  // NJ - Camden/Burlington (South NJ)
  "11 Haddon Ave, Haddonfield, NJ 08033",
  "55 Kings Hwy, Haddonfield, NJ 08033",
  "88 Marlton Pike, Cherry Hill, NJ 08034",
  "200 Route 38, Cherry Hill, NJ 08002",
  "14 Larchmont Blvd, Cherry Hill, NJ 08003",
  // PA - Philadelphia area
  "220 S Broad St, Philadelphia, PA 19102",
  "1500 Market St, Philadelphia, PA 19102",
  "88 Germantown Ave, Philadelphia, PA 19144",
  "350 E Girard Ave, Philadelphia, PA 19125",
  "44 Cricket Ave, Ardmore, PA 19003",
  "100 E Lancaster Ave, Wayne, PA 19087",
  "55 W Lancaster Ave, Ardmore, PA 19003",
  "18 S Wayne Ave, Wayne, PA 19087",
  "77 N Highland Ave, Lansdowne, PA 19050",
  // PA - Bucks County
  "212 N Main St, Doylestown, PA 18901",
  "88 Bridge St, New Hope, PA 18938",
  "40 N Main St, Newtown, PA 18940",
  "115 E Court St, Doylestown, PA 18901",
  // PA - Montgomery County
  "50 E Swede Rd, Norristown, PA 19401",
  "120 W Main St, Lansdale, PA 19446",
  "33 DeKalb Pike, Norristown, PA 19401",
  "77 Skippack Pike, Blue Bell, PA 19422",
  "22 Butler Pike, Ambler, PA 19002",
];

interface Props {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

export default function AddressAutocomplete({ value, onChange, required }: Props) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const matches = value.length >= 2
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    setHighlighted(0);
  }, [value]);

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
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, matches.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === "Enter")     { e.preventDefault(); onChange(matches[highlighted]); setOpen(false); }
    if (e.key === "Escape")    { setOpen(false); }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        required={required}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKey}
        placeholder="Start typing an address…"
        autoComplete="off"
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#166534] transition-colors"
      />

      {open && matches.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {matches.map((s, i) => {
            const [street, rest] = s.split(", ").reduce<[string, string]>(
              (acc, part, idx) => idx === 0 ? [part, ""] : [acc[0], acc[1] ? acc[1] + ", " + part : part],
              ["", ""]
            );
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
                  <span className="text-gray-400">, {rest}</span>
                </span>
              </li>
            );
          })}
          <li className="px-3 py-1.5 text-xs text-gray-400 border-t border-gray-100 bg-gray-50">
            NJ / PA service area
          </li>
        </ul>
      )}
    </div>
  );
}
