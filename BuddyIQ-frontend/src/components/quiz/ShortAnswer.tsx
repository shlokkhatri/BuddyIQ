interface ShortAnswerProps {
  answer: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
}

export default function ShortAnswer({
  answer,
  onAnswerChange,
  disabled = false,
}: ShortAnswerProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Your Explanation / Answer
        </label>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {answer.length} characters
        </span>
      </div>
      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={disabled}
        rows={4}
        placeholder="Explain your answer clearly in your own words..."
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
          p-4
          text-sm
          text-slate-800
          dark:text-slate-100
          font-normal
          outline-none
          transition-all
          resize-y
          focus:border-blue-500
          dark:focus:border-blue-400
          focus:ring-3
          focus:ring-blue-100
          dark:focus:ring-blue-950
          disabled:bg-slate-100
          dark:disabled:bg-slate-800/50
          disabled:text-slate-400
          dark:disabled:text-slate-600
        "
      />
    </div>
  );
}
