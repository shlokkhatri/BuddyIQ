interface FillBlankProps {
  question: string;
  answer: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
}

export default function FillBlank({
  answer,
  onAnswerChange,
  disabled = false,
}: FillBlankProps) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Your Answer (Fill in the Blank)
      </label>
      <input
        type="text"
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={disabled}
        placeholder="Type the missing word or phrase..."
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
          px-4
          py-3.5
          text-sm
          text-slate-800
          dark:text-slate-100
          font-medium
          outline-none
          transition-all
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
