"use client";

import type { HeroStats, LaneAnalysis } from "@/types/dota";

interface Props {
  result: LaneAnalysis;
  teamAHeroes: HeroStats[];
  teamBHeroes: HeroStats[];
}

const winnerStyles = {
  "Team A": { text: "text-emerald-400", label: "Safelane" },
  "Team B": { text: "text-red-400", label: "Offlane" },
  Even: { text: "text-yellow-400", label: "Even" },
};

const confidenceStyles = {
  slight:
    "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30",
  moderate:
    "text-orange-400 bg-orange-400/10 border border-orange-400/30",
  strong:
    "text-red-400 bg-red-400/10 border border-red-400/30",
};

const HeroPortraits = ({ heroes }: { heroes: HeroStats[] }) => (
  <div className="flex items-center gap-3">
    {heroes.map((h) => (
      <div key={h.id} className="flex items-center gap-1.5">
        {/* biome-ignore lint/performance/noImgElement: image-rendering:pixelated doesn't work reliably with next/image optimization */}
        <img
          src={h.icon}
          alt={h.localized_name}
          width={20}
          height={20}
          className="rounded-sm [image-rendering:pixelated]"
        />
        <span className="text-xs text-gray-400">{h.localized_name}</span>
      </div>
    ))}
  </div>
);

export const AnalysisResult = ({ result, teamAHeroes, teamBHeroes }: Props) => {
  const winner = winnerStyles[result.predicted_winner];

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-gray-700 bg-gray-900 p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className={`text-4xl font-bold ${winner.text}`}>
            {winner.label} wins
          </span>
          <span
            className={`rounded px-2 py-0.5 text-xs font-semibold ${confidenceStyles[result.confidence]}`}
          >
            {result.confidence}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Safelane
            </span>
            <HeroPortraits heroes={teamAHeroes} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
              Offlane
            </span>
            <HeroPortraits heroes={teamBHeroes} />
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-gray-300">{result.reasoning}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ComboList
          label="Safelane combos"
          combos={result.team_a_combos}
          borderColour="border-emerald-800"
        />
        <ComboList
          label="Offlane combos"
          combos={result.team_b_combos}
          borderColour="border-red-900"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdviceBlock
          label="Safelane strategy"
          text={result.strategic_advice.team_a}
          borderColour="border-emerald-800"
        />
        <AdviceBlock
          label="Offlane strategy"
          text={result.strategic_advice.team_b}
          borderColour="border-red-900"
        />
      </div>

      <div className="rounded border border-gray-700 bg-gray-800 p-3">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Key timings
        </h3>
        <p className="text-sm text-gray-300">{result.key_timings}</p>
      </div>
    </div>
  );
};

const ComboList = ({
  label,
  combos,
  borderColour,
}: {
  label: string;
  combos: { name: string; description: string }[];
  borderColour: string;
}) => (
  <div className={`border-l-2 pl-3 ${borderColour}`}>
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
      {label}
    </h3>
    {combos.length === 0 ? (
      <p className="text-sm text-gray-500">None</p>
    ) : (
      <ul className="flex flex-col gap-2">
        {combos.map((c) => (
          <li key={c.name} className="text-sm">
            <span className="font-medium text-gray-200">{c.name}</span>
            <span className="text-gray-400"> — {c.description}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AdviceBlock = ({
  label,
  text,
  borderColour,
}: {
  label: string;
  text: string;
  borderColour: string;
}) => (
  <div className={`border-l-2 pl-3 ${borderColour}`}>
    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
      {label}
    </h3>
    <p className="text-sm leading-relaxed text-gray-300">{text}</p>
  </div>
);
