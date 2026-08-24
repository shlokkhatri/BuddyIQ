import { Sparkles, Brain, BookOpen, Search, FileText } from "lucide-react";
import QuizSetup from "../components/quiz/QuizSetup";

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: "100% Grounded in Textbooks",
      desc: "Questions are extracted directly from your school curriculum PDFs, ensuring authentic exam prep without hallucinations.",
      color: "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    {
      icon: Brain,
      title: "Multi-Agent AI Evaluation",
      desc: "CrewAI examiner agents evaluate reasoning, understand alternate wordings, and pinpoint exact weak conceptual topics.",
      color: "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    },
    {
      icon: Search,
      title: "Targeted Learning Resources",
      desc: "For every weak concept detected, our Resource Finder agent curates the best verified videos and educational articles.",
      color: "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
    {
      icon: FileText,
      title: "Smart AI Cheat Sheets",
      desc: "Get condensed 1-2 sentence rules organized by exam risk (High, Medium, Low) for rapid pre-exam revision.",
      color: "bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Next-Gen Agentic Study Companion</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Master Any Subject with{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Autonomous AI
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Select your standard, subject, and chapter. BuddyIQ reads the textbook PDF, generates personalized quizzes, diagnoses weaknesses, and creates instant cheat sheets.
        </p>
      </div>

      {/* Quiz Setup Form */}
      <div className="max-w-3xl mx-auto">
        <QuizSetup />
      </div>

      {/* Feature Grid */}
      <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800">
        <div className="text-center mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            How BuddyIQ Works
          </h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Autonomous Multi-Agent Architecture
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${f.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{f.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}