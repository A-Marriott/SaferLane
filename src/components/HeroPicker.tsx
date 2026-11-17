import type { HeroStats } from "@/types/dota";

interface Props {
  heroes: HeroStats[];
  selected: [number | null, number | null];
  label: string;
  slots: [string, string];
  activeSlot: 0 | 1 | null;
  variant: "radiant" | "dire";
  onSlotClick: (slot: 0 | 1) => void;
  onClear: (slot: 0 | 1) => void;
}

const variantStyles = {
  radiant: {
    label: "text-emerald-500",
    activeSlot: "border-emerald-500 bg-emerald-500/10",
    activeText: "text-emerald-300",
  },
  dire: {
    label: "text-red-500",
    activeSlot: "border-red-500 bg-red-500/10",
    activeText: "text-red-300",
  },
};

export const HeroPicker = ({
  heroes,
  selected,
  label,
  slots,
  activeSlot,
  variant,
  onSlotClick,
  onClear,
}: Props) => {
  const heroById = (id: number | null) =>
    id !== null ? (heroes.find((h) => h.id === id) ?? null) : null;

  const styles = variantStyles[variant];

  return (
    <div className="flex flex-col gap-2">
      <h2
        className={`text-sm font-semibold uppercase tracking-wider ${styles.label}`}
      >
        {label}
      </h2>

      <div className="flex gap-2">
        {([0, 1] as const).map((s) => {
          const hero = heroById(selected[s]);
          return (
            <div
              key={s}
              className={`flex flex-1 items-center rounded border transition-colors ${
                activeSlot === s
                  ? styles.activeSlot
                  : "border-gray-600 bg-gray-800"
              }`}
            >
              <button
                type="button"
                aria-label={`${label} ${slots[s]}${hero ? `: ${hero.localized_name}` : ""}`}
                aria-pressed={activeSlot === s}
                onClick={() => onSlotClick(s)}
                className="flex flex-1 items-center gap-2 px-2 py-2 text-sm text-left"
              >
                {hero ? (
                  <>
                    {/* biome-ignore lint/performance/noImgElement: image-rendering:pixelated doesn't work reliably with next/image optimization */}
                    <img
                      src={hero.icon}
                      alt={hero.localized_name}
                      width={24}
                      height={24}
                      className="rounded-sm [image-rendering:pixelated]"
                    />
                    <span
                      className={
                        activeSlot === s ? styles.activeText : "text-gray-300"
                      }
                    >
                      {hero.localized_name}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">{slots[s]}</span>
                )}
              </button>
              {selected[s] !== null && (
                <button
                  type="button"
                  aria-label={`Clear ${label} ${slots[s]}`}
                  className="px-2 py-2 text-gray-500 hover:text-gray-200"
                  onClick={() => onClear(s)}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
