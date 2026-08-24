import type { Chapter } from "../../types";

interface ChapterSelectorProps {
  chapters: Chapter[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ChapterSelector({
  chapters,
  value,
  onChange,
  disabled = false,
}: ChapterSelectorProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
        Chapter
      </label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
      >
        <option value="">Select Chapter...</option>
        {chapters.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label || c.title}
          </option>
        ))}
      </select>
    </div>
  );
}