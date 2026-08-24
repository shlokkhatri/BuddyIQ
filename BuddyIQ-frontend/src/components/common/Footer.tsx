import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>BuddyIQ Multi-Agent Study Assistant</span>
        </div>
        <p className="flex items-center gap-1">
          Powered by CrewAI agents & FastAPI
        </p>
      </div>
    </footer>
  );
}
