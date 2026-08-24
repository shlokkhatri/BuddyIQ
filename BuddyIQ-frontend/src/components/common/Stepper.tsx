import { Check } from "lucide-react";

interface Step {
  id: string | number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
}

export default function Stepper({
  steps,
  currentStepIndex,
  onStepClick,
}: StepperProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.id}
              className="flex-1 flex items-center group relative"
            >
              {/* Step indicator node */}
              <div
                onClick={() => onStepClick && isCompleted && onStepClick(index)}
                className={`flex items-center gap-2.5 ${
                  onStepClick && isCompleted ? "cursor-pointer" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCompleted
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
                      : isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm shadow-blue-500/30"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <div className="hidden sm:block text-left">
                  <p
                    className={`text-xs font-semibold leading-tight ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-[10px] text-slate-400">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors duration-200 ${
                    index < currentStepIndex
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
