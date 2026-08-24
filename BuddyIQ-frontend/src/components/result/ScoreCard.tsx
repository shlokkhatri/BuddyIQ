import { Award, CheckCircle2, XCircle } from "lucide-react";

interface ScoreCardProps {
  scoreString: string | number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export default function ScoreCard({
  scoreString,
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
}: ScoreCardProps) {
  // If score is a string like "4/5", parse it; otherwise use correct/total
  let scoreDisplay = String(scoreString);
  let correctCount = correctAnswers;
  let totalCount = totalQuestions;

  if (typeof scoreString === "string" && scoreString.includes("/")) {
    const parts = scoreString.split("/");
    const parsedCorrect = parseInt(parts[0], 10);
    const parsedTotal = parseInt(parts[1], 10);
    if (!isNaN(parsedCorrect)) correctCount = parsedCorrect;
    if (!isNaN(parsedTotal) && parsedTotal > 0) totalCount = parsedTotal;
  } else if (typeof scoreString === "number") {
    scoreDisplay = `${scoreString}/${totalCount || 10}`;
    correctCount = scoreString;
  }

  const percentage =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const getTier = () => {
    if (percentage >= 80) {
      return {
        label: "Mastery Level 🌟",
        desc: "Outstanding grasp of the concepts!",
        color: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
        ringColor: "stroke-emerald-500",
      };
    }
    if (percentage >= 50) {
      return {
        label: "Good Progress 👍",
        desc: "Solid understanding with a few areas to polish.",
        color: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
        ringColor: "stroke-blue-500",
      };
    }
    return {
      label: "Needs Review 📚",
      desc: "Review your weak topics with the cheat sheet and resources below.",
      color: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
      ringColor: "stroke-amber-500",
    };
  };

  const tier = getTier();

  // SVG circular gauge calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-6 sm:p-8 transition-colors duration-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Radial Score Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={`${tier.ringColor} transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                {percentage}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-1">
                Accuracy
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tier.color}`}
            >
              <Award className="w-3.5 h-3.5" />
              {tier.label}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Score: {scoreDisplay}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">{tier.desc}</p>
          </div>
        </div>

        {/* Right: Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Correct</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{correctCount}</p>
            </div>
          </div>

          <div className="bg-red-50/70 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/60 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-600/20">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-red-800 dark:text-red-300 font-semibold">Incorrect</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-400">{incorrectAnswers || (totalCount - correctCount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
