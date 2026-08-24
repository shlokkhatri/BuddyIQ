import { useState } from "react";
import { Copy, Check, ShieldAlert, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { CheatSheetItem } from "../../types";

interface CheatSheetCardProps {
  item: CheatSheetItem;
  index: number;
}

export default function CheatSheetCard({ item, index }: CheatSheetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${item.topic}: ${item.rule}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success(`Copied rule for "${item.topic}"`);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskBadge = () => {
    const risk = item.risk?.toLowerCase() || "medium";
    if (risk === "high") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <ShieldAlert className="w-3 h-3" />
          High Risk / Essential
        </span>
      );
    }
    if (risk === "medium") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-3 h-3" />
          Medium Priority
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        <Shield className="w-3 h-3" />
        Low Priority
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-5 shadow-sm space-y-3 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.topic}</h4>
        </div>

        <div className="flex items-center gap-2">
          {getRiskBadge()}
          <button
            onClick={handleCopy}
            title="Copy rule to clipboard"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Core Rule / Memory Trigger */}
      <div className="bg-slate-50/80 dark:bg-slate-950/70 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        {item.rule}
      </div>
    </div>
  );
}
