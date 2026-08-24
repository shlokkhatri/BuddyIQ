import { Zap, Sparkles, Flame, Shuffle } from "lucide-react";
import type { DifficultyLevel } from "../../types";

interface DifficultySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const difficultyOptions: {
  level: DifficultyLevel;
  label: string;
  icon: typeof Zap;
  color: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
}[] = [
  {
    level: "Easy",
    label: "Easy",
    icon: Sparkles,
    color: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-950/60",
    activeBorder: "border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20",
    activeText: "text-emerald-700 dark:text-emerald-300",
  },
  {
    level: "Medium",
    label: "Medium",
    icon: Zap,
    color: "text-blue-600 dark:text-blue-400",
    activeBg: "bg-blue-50 dark:bg-blue-950/60",
    activeBorder: "border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20",
    activeText: "text-blue-700 dark:text-blue-300",
  },
  {
    level: "Hard",
    label: "Hard",
    icon: Flame,
    color: "text-orange-600 dark:text-orange-400",
    activeBg: "bg-orange-50 dark:bg-orange-950/60",
    activeBorder: "border-orange-500 dark:border-orange-500 ring-2 ring-orange-500/20",
    activeText: "text-orange-700 dark:text-orange-300",
  },
  {
    level: "Mixed",
    label: "Mixed",
    icon: Shuffle,
    color: "text-purple-600 dark:text-purple-400",
    activeBg: "bg-purple-50 dark:bg-purple-950/60",
    activeBorder: "border-purple-500 dark:border-purple-500 ring-2 ring-purple-500/20",
    activeText: "text-purple-700 dark:text-purple-300",
  },
];

export default function DifficultySelector({
  value,
  onChange,
  disabled = false,
}: DifficultySelectorProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
        Difficulty Level
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {difficultyOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value.toLowerCase() === opt.level.toLowerCase();

          return (
            <button
              key={opt.level}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.level)}
              className={`
                flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                ${
                  isSelected
                    ? `${opt.activeBg} ${opt.activeBorder} ${opt.activeText} shadow-sm`
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isSelected ? opt.activeText : opt.color}`} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}