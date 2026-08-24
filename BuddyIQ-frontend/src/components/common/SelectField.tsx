import React from "react";
import { ChevronDown } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
}

export default function Select({
  label,
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
  loading = false,
  helperText,
  icon,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          {icon && <span className="text-blue-600 dark:text-blue-400">{icon}</span>}
          {label}
        </label>
        {loading && (
          <span className="text-[11px] text-blue-600 dark:text-blue-400 animate-pulse font-medium">
            Loading...
          </span>
        )}
      </div>

      <div className="relative">
        <select
          value={value}
          disabled={disabled || loading}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            appearance-none
            rounded-xl
            border
            border-slate-300
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            px-4
            py-3
            pr-10
            text-sm
            text-slate-800
            dark:text-slate-100
            font-medium
            outline-none
            transition-all
            duration-150
            hover:border-slate-400
            dark:hover:border-slate-600
            focus:border-blue-500
            dark:focus:border-blue-400
            focus:ring-3
            focus:ring-blue-100
            dark:focus:ring-blue-950
            disabled:bg-slate-100
            dark:disabled:bg-slate-800/50
            disabled:border-slate-200
            dark:disabled:border-slate-800
            disabled:text-slate-400
            dark:disabled:text-slate-600
            disabled:cursor-not-allowed
          "
        >
          <option value="" disabled className="dark:bg-slate-900 dark:text-slate-400">
            {loading ? "Loading options..." : placeholder}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="dark:bg-slate-900 dark:text-slate-100"
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500">{helperText}</p>
      )}
    </div>
  );
}