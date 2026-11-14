"use client";

import { useState } from "react";
import { AnalysisResult } from "@/components/AnalysisResult";
import { HeroPicker } from "@/components/HeroPicker";
import type { HeroStats, LaneAnalysis } from "@/types/dota";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: LaneAnalysis };

type ActiveSlot = { team: 1 | 2; slot: 0 | 1 };

interface Props {
  heroes: HeroStats[];
}

export const MatchupForm = ({ heroes }: Props) => {
  const [team1, setTeam1] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [team2, setTeam2] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [active, setActive] = useState<ActiveSlot>({ team: 1, slot: 0 });
  const [query, setQuery] = useState("");
  const [state, setState] = useState<FetchState>({ status: "idle" });
  const [view, setView] = useState<"picker" | "analysis">("picker");

  const ready =
    team1[0] !== null &&
    team1[1] !== null &&
    team2[0] !== null &&
    team2[1] !== null;

  const allPicked = new Set(
    [...team1, ...team2].filter((id): id is number => id !== null),
  );

  // Advance to next unfilled slot after a pick
  const nextSlot = (
    t1: [number | null, number | null],
    t2: [number | null, number | null],
  ): ActiveSlot | null => {
    const slots: ActiveSlot[] = [
      { team: 1, slot: 0 },
      { team: 1, slot: 1 },
      { team: 2, slot: 0 },
      { team: 2, slot: 1 },
    ];
    for (const s of slots) {
      const val = s.team === 1 ? t1[s.slot] : t2[s.slot];
      if (val === null) return s;
    }
    return null;
  };

  const pick = (id: number) => {
    const setTeam = active.team === 1 ? setTeam1 : setTeam2;
    const current = active.team === 1 ? team1 : team2;
    const next: [number | null, number | null] = [...current] as [
      number | null,
      number | null,
    ];
    next[active.slot] = id;
    setTeam(next);
    setQuery("");
    const newT1 = active.team === 1 ? next : team1;
    const newT2 = active.team === 2 ? next : team2;
    const advance = nextSlot(newT1, newT2);
    if (advance) setActive(advance);
  };

  const clear = (team: 1 | 2, slot: 0 | 1) => {
    const setTeam = team === 1 ? setTeam1 : setTeam2;
    const current = team === 1 ? team1 : team2;
    const next: [number | null, number | null] = [...current] as [
      number | null,
      number | null,
    ];
    next[slot] = null;
    setTeam(next);
    setActive({ team, slot });
  };

  const filtered = query.trim()
    ? heroes.filter((h) =>
        h.localized_name.toLowerCase().includes(query.toLowerCase()),
      )
    : heroes;

  const analyse = async () => {
    if (!ready) return;
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team1, team2 }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setState({
          status: "error",
          message: (body as { error?: string }).error ?? `HTTP ${res.status}`,
        });
        return;
      }
      const data = await res.json();
      setState({ status: "success", data: data as LaneAnalysis });
      setView("analysis");
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  if (view === "analysis" && state.status === "success") {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <button
            type="button"
            onClick={() => setView("picker")}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to picker
          </button>
        </div>
        <AnalysisResult result={state.data} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end min-h-[1.5rem]">
        {state.status === "success" && (
          <button
            type="button"
            onClick={() => setView("analysis")}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            View analysis →
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <HeroPicker
          heroes={heroes}
          selected={team1}
          label="Safelane"
          slots={["Carry", "Support"]}
          activeSlot={active.team === 1 ? active.slot : null}
          onSlotClick={(slot) => setActive({ team: 1, slot })}
          onClear={(slot) => clear(1, slot)}
        />
        <HeroPicker
          heroes={heroes}
          selected={team2}
          label="Offlane"
          slots={["Offlane", "Support"]}
          activeSlot={active.team === 2 ? active.slot : null}
          onSlotClick={(slot) => setActive({ team: 2, slot })}
          onClear={(slot) => clear(2, slot)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          id="hero-search"
          aria-label="Search heroes"
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
              const isPicked = allPicked.has(h.id);
              return (
                <button
                  key={h.id}
                  type="button"
                  disabled={isPicked}
                  title={h.localized_name}
                  onClick={() => pick(h.id)}
                  className={`rounded transition-opacity ${
                    isPicked
                      ? "opacity-25 cursor-default"
                      : "hover:ring-2 hover:ring-blue-400 cursor-pointer"
                  }`}
                >
                  {/* biome-ignore lint/performance/noImgElement: image-rendering:pixelated doesn't work reliably with next/image optimization */}
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

      <button
        onClick={analyse}
        disabled={!ready || state.status === "loading"}
        type="button"
        className="rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state.status === "loading" ? "Analysing…" : "Analyse matchup"}
      </button>

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-300"
        >
          {state.message}
        </p>
      )}
    </div>
  );
};
