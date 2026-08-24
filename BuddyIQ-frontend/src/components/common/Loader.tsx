import { Loader2, Brain, Sparkles } from "lucide-react";

interface LoaderProps {
  message?: string;
  subMessage?: string;
  variant?: "spinner" | "agent";
}

export default function Loader({
  message = "Loading...",
  subMessage,
  variant = "spinner",
}: LoaderProps) {
  if (variant === "agent") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-pulse">
            <Brain className="w-8 h-8" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 shadow animate-bounce">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">{message}</h3>
        {subMessage && (
          <p className="text-sm text-slate-500 max-w-sm">{subMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <span className="text-sm font-medium text-slate-600">{message}</span>
    </div>
  );
}
