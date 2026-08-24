import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme, type Theme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System Default", icon: Monitor },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        title={`Theme: ${theme === "system" ? "System Default" : theme}`}
        className="
          flex items-center justify-center
          w-9 h-9 rounded-xl
          border border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-900
          text-slate-600 dark:text-slate-300
          hover:bg-slate-50 dark:hover:bg-slate-800
          hover:text-slate-900 dark:hover:text-white
          transition-all cursor-pointer shadow-xs
        "
      >
        {theme === "system" ? (
          <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        ) : isDark ? (
          <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-44
            rounded-2xl border border-slate-200 dark:border-slate-800
            bg-white dark:bg-slate-900
            p-1.5 shadow-xl shadow-slate-900/10 dark:shadow-black/40
            z-50 animate-in fade-in zoom-in duration-150
          "
        >
          <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Theme Preference
          </div>

          <div className="space-y-0.5">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer
                    ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <span>{opt.label}</span>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
