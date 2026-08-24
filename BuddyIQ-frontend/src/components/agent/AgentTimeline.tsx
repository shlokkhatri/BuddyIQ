import AgentStatus from "./AgentStatus";
import type { AgentStep } from "../../types";

interface AgentTimelineProps {
  steps: AgentStep[];
  title?: string;
  subtitle?: string;
}

export default function AgentTimeline({
  steps,
  title = "AI Multi-Agent Pipeline",
  subtitle = "Specialized AI agents working collaboratively on your quiz",
}: AgentTimelineProps) {
  return (
    <div className="w-full space-y-4">
      <div className="text-center sm:text-left mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <AgentStatus
            key={step.id}
            name={step.name}
            role={step.role}
            description={step.description}
            status={step.status}
            detail={step.detail}
            iconType={
              step.id.includes("eval")
                ? "evaluator"
                : step.id.includes("resource")
                ? "resource"
                : step.id.includes("cheat")
                ? "cheatsheet"
                : step.id.includes("quiz")
                ? "quiz"
                : "manager"
            }
          />
        ))}
      </div>
    </div>
  );
}
