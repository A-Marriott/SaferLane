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
  const [state, setState] = useState<FetchState>({ status: "idle" });

  const ready =
    team1[0] !== null &&
    team1[1] !== null &&
    team2[0] !== null &&
    team2[1] !== null;

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
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <HeroPicker
          heroes={heroes}
          selected={team1}
          onChange={setTeam1}
          label="Team A"
        />
        <HeroPicker
          heroes={heroes}
          selected={team2}
          onChange={setTeam2}
          label="Team B"
        />
      </div>

      <button
        onClick={analyse}
        disabled={!ready || state.status === "loading"}
        type={"submit"}
        className="rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state.status === "loading" ? "Analysing…" : "Analyse matchup"}
      </button>

      {state.status === "error" && (
        <p className="rounded border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-300">
          {state.message}
        </p>
      )}

      {state.status === "success" && <AnalysisResult result={state.data} />}
    </div>
  );
};
