import { AlertTriangle, CheckCircle, Sparkles } from "lucide-react";

interface WeakTopicsProps {
  topics: string[];
}

export default function WeakTopics({ topics }: WeakTopicsProps) {
  if (!topics || topics.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 shadow-md p-6 sm:p-8 flex items-center gap-4 transition-colors duration-200">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Flawless Performance! <Sparkles className="w-4 h-4 text-emerald-500" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            No weak topics detected. You answered all evaluated concepts accurately.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/40 dark:shadow-black/40 p-6 sm:p-8 space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Identified Weak Concepts ({topics.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Targeted concepts identified by the Answer Evaluator Agent for revision.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-2">
        {topics.map((topic, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-semibold shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
