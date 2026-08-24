import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, AlertCircle, RefreshCw } from "lucide-react";
import { checkBackendHealth } from "../../api/quiz";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const location = useLocation();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const verifyHealth = async () => {
    setChecking(true);
    const isUp = await checkBackendHealth();
    setBackendOnline(isUp);
    setChecking(false);
  };

  useEffect(() => {
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Buddy<span className="text-blue-600 dark:text-blue-400">IQ</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 tracking-wide">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-none">
              Autonomous Study Companion
            </p>
          </div>
        </Link>

        {/* Navigation & Status & Theme */}
        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg transition ${
                location.pathname === "/"
                  ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              Quiz Generator
            </Link>
            {sessionStorage.getItem("quiz") && (
              <Link
                to="/quiz"
                className={`px-3 py-1.5 rounded-lg transition ${
                  location.pathname === "/quiz"
                    ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                Active Quiz
              </Link>
            )}
            {sessionStorage.getItem("analysis") && (
              <Link
                to="/result"
                className={`px-3 py-1.5 rounded-lg transition ${
                  location.pathname === "/result"
                    ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                Results
              </Link>
            )}
          </nav>

          {/* Backend Status indicator */}
          <div className="flex items-center">
            <button
              onClick={verifyHealth}
              title="Click to re-check backend connection"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                backendOnline === true
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                  : backendOnline === false
                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              {backendOnline === true ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">API Connected</span>
                  <span className="sm:hidden">Online</span>
                </>
              ) : backendOnline === false ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Backend Offline</span>
                  <span className="sm:hidden">Offline</span>
                  <RefreshCw className={`w-3 h-3 ml-0.5 ${checking ? "animate-spin" : ""}`} />
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
                  <span>Checking...</span>
                </>
              )}
            </button>
          </div>

          {/* Theme Toggle Component */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
