"use client";

import type { LaneAnalysis } from "@/types/dota";

interface Props {
  result: LaneAnalysis;
}

const confidenceColour = {
  slight: "text-yellow-400",
  moderate: "text-orange-400",
  strong: "text-red-400",
};

export const AnalysisResult = ({ result }: Props) => (
  <div className="flex flex-col gap-6 rounded-lg border border-gray-700 bg-gray-900 p-6">
    <div className="flex items-baseline gap-3">
      <span className="text-2xl font-bold text-white">
        {result.predicted_winner}
      </span>
      <span
        className={`text-sm font-medium ${confidenceColour[result.confidence]}`}
      >
        {result.confidence} advantage
      </span>
    </div>

    <p className="text-sm leading-relaxed text-gray-300">{result.reasoning}</p>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ComboList label="Team A combos" combos={result.team_a_combos} />
      <ComboList label="Team B combos" combos={result.team_b_combos} />
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <AdviceBlock
        label="Team A strategy"
        text={result.strategic_advice.team_a}
      />
      <AdviceBlock
        label="Team B strategy"
        text={result.strategic_advice.team_b}
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

const ComboList = ({
  label,
  combos,
}: {
  label: string;
  combos: { name: string; description: string }[];
}) => (
  <div>
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

const AdviceBlock = ({ label, text }: { label: string; text: string }) => (
  <div>
    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
      {label}
    </h3>
    <p className="text-sm leading-relaxed text-gray-300">{text}</p>
  </div>
);
