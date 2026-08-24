import { Brain, Search, BookOpen, FileCheck, CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";
import type { AgentStepStatus } from "../../types";

interface AgentStatusProps {
  name: string;
  role: string;
  description: string;
  status: AgentStepStatus;
  detail?: string;
  iconType?: "evaluator" | "resource" | "cheatsheet" | "quiz" | "manager";
}

export default function AgentStatus({
  name,
  role,
  description,
  status,
  detail,
  iconType = "manager",
}: AgentStatusProps) {
  const getIcon = () => {
    switch (iconType) {
      case "quiz":
        return <Brain className="w-5 h-5" />;
      case "evaluator":
        return <FileCheck className="w-5 h-5" />;
      case "resource":
        return <Search className="w-5 h-5" />;
      case "cheatsheet":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Done
          </span>
        );
      case "running":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
            Active
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-3.5 h-3.5" />
            Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            Queued
          </span>
        );
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 ${
        status === "running"
          ? "bg-blue-50/60 dark:bg-blue-950/30 border-blue-300 dark:border-blue-600 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20"
          : status === "completed"
          ? "bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60 shadow-sm"
          : "bg-white/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              status === "running"
                ? "bg-blue-600 text-white animate-bounce"
                : status === "completed"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            }`}
          >
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h4>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                • {role}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{description}</p>
            {detail && status === "running" && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
                {detail}
              </p>
            )}
          </div>
        </div>

        <div>{getStatusBadge()}</div>
      </div>
    </div>
  );
}
