"use client";

import { useState } from "react";
import type { HeroStats } from "@/types/dota";

interface Props {
  heroes: HeroStats[];
  selected: [number | null, number | null];
  onChange: (selected: [number | null, number | null]) => void;
  label: string;
}

export const HeroPicker = ({ heroes, selected, onChange, label }: Props) => {
  const [query, setQuery] = useState("");
  const [slot, setSlot] = useState<0 | 1>(0);

  const filtered = query.trim()
    ? heroes.filter((h) =>
        h.localized_name.toLowerCase().includes(query.toLowerCase()),
      )
    : heroes;

  const pick = (id: number) => {
    const next: [number | null, number | null] = [...selected] as [
      number | null,
      number | null,
    ];
    next[slot] = id;
    onChange(next);
    setQuery("");
    if (slot === 0 && next[1] === null) setSlot(1);
  };

  const clear = (s: 0 | 1) => {
    const next: [number | null, number | null] = [...selected] as [
      number | null,
      number | null,
    ];
    next[s] = null;
    onChange(next);
    setSlot(s);
  };

  const heroById = (id: number | null) =>
    id !== null ? heroes.find((h) => h.id === id) ?? null : null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </h2>

      <div className="flex gap-2">
        {([0, 1] as const).map((s) => {
          const hero = heroById(selected[s]);
          return (
            <div
              key={s}
              className={`flex flex-1 items-center rounded border transition-colors ${
                slot === s
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 bg-gray-800"
              }`}
            >
              <button
                type="button"
                onClick={() => setSlot(s)}
                className="flex flex-1 items-center gap-2 px-2 py-2 text-sm text-left"
              >
                {hero ? (
                  <>
                    <img
                      src={hero.icon}
                      alt={hero.localized_name}
                      width={24}
                      height={24}
                      className="rounded-sm [image-rendering:pixelated]"
                    />
                    <span className={slot === s ? "text-blue-300" : "text-gray-300"}>
                      {hero.localized_name}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">
                    Pick {s === 0 ? "carry" : "support"}
                  </span>
                )}
              </button>
              {selected[s] !== null && (
                <button
                  type="button"
                  aria-label="Clear"
                  className="px-2 py-2 text-gray-500 hover:text-gray-200"
                  onClick={() => clear(s)}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      <input
        type="text"
        placeholder="Search heroes…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500"
      />

      <div className="flex flex-wrap gap-1 rounded border border-gray-700 bg-gray-900 p-2 max-h-64 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="p-2 text-sm text-gray-500">No heroes found</p>
        ) : (
          filtered.map((h) => {
            const isSelected = selected.includes(h.id);
            return (
              <button
                key={h.id}
                type="button"
                disabled={isSelected}
                title={h.localized_name}
                onClick={() => pick(h.id)}
                className={`rounded transition-opacity ${
                  isSelected
                    ? "opacity-25 cursor-default"
                    : "hover:ring-2 hover:ring-blue-400 cursor-pointer"
                }`}
              >
                <img
                  src={h.icon}
                  alt={h.localized_name}
                  width={32}
                  height={32}
                  className="rounded [image-rendering:pixelated]"
                />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
