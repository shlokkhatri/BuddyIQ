interface MCQQuestionProps {
  questionId: number;
  options: string[];
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  disabled?: boolean;
}

export default function MCQQuestion({
  questionId,
  options,
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
}: MCQQuestionProps) {
  // Generate letters A, B, C, D
  const getLetter = (index: number) => String.fromCharCode(65 + index);

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const letter = getLetter(index);
        const isSelected = Boolean(
          selectedAnswer === option ||
            selectedAnswer === letter ||
            (selectedAnswer && option.startsWith(`${selectedAnswer}.`))
        );

        return (
          <label
            key={index}
            className={`
              group flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all duration-150 select-none
              ${
                isSelected
                  ? "border-blue-500 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }
              ${disabled ? "pointer-events-none opacity-60" : ""}
            `}
            onClick={() => !disabled && onSelectAnswer(option)}
          >
            {/* Option letter badge */}
            <div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors
                ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                }
              `}
            >
              {letter}
            </div>

            <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug">
              {option}
            </div>

            <div className="shrink-0 flex items-center">
              <input
                type="radio"
                name={`question-${questionId}`}
                value={option}
                checked={isSelected}
                onChange={() => onSelectAnswer(option)}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 accent-blue-600 focus:ring-blue-500"
              />
            </div>
          </label>
        );
      })}
    </div>
  );
}
