interface QuestionCountProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  options?: number[];
}

export default function QuestionCount({
  value,
  onChange,
  disabled = false,
  options = [5, 10, 15, 20],
}: QuestionCountProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          Number of Questions
        </label>
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          {value} questions
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {options.map((count) => {
          const isSelected = value === count;

          return (
            <button
              key={count}
              type="button"
              disabled={disabled}
              onClick={() => onChange(count)}
              className={`
                flex items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm ring-2 ring-blue-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }
              `}
            >
              {count}
            </button>
          );
        })}
      </div>
    </div>
  );
}