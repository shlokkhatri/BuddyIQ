import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { analyzeQuiz as analyzeQuizApi } from "../api/quiz";
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  AgentStep,
} from "../types";

export function useAnalyze() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialSteps: AgentStep[] = [
    {
      id: "manager",
      name: "CrewAI Manager",
      role: "Orchestration & Workflow Coordination",
      description: "Coordinating multi-agent evaluation pipeline",
      status: "waiting",
      detail: "Initializing agents...",
    },
    {
      id: "evaluator",
      name: "Answer Evaluation Agent",
      role: "Examiner & Grader",
      description: "Grading each answer, providing constructive feedback & identifying conceptual weak topics",
      status: "waiting",
      detail: "Evaluating answers against textbook ground truth...",
    },
    {
      id: "resource_finder",
      name: "Resource Finder Agent",
      role: "Curator & Educational Researcher",
      description: "Searching for high-quality educational videos and articles tailored to weak topics",
      status: "waiting",
      detail: "Discovering curated video explanations...",
    },
    {
      id: "cheatsheet",
      name: "Cheat Sheet Agent",
      role: "Instructional Synthesizer",
      description: "Compiling condensed high-yield rules ranked by risk level (High/Medium/Low)",
      status: "waiting",
      detail: "Drafting revision cheat sheet...",
    },
  ];

  const [agentSteps, setAgentSteps] = useState<AgentStep[]>(initialSteps);

  const updateStepStatus = (id: string, status: AgentStep["status"], detail?: string) => {
    setAgentSteps((prev) =>
      prev.map((step) =>
        step.id === id
          ? { ...step, status, ...(detail !== undefined ? { detail } : {}) }
          : step
      )
    );
  };

  const startAnalysis = useCallback(
    async (requestData: AnalyzeRequest) => {
      try {
        setAnalyzing(true);
        setError(null);

        // Step 1: Manager starts
        updateStepStatus("manager", "running", "Delegating task to Answer Evaluation Agent...");

        // Simulate smooth agent pipeline visualization while awaiting backend CrewAI
        setTimeout(() => {
          updateStepStatus("manager", "completed", "Workflow initiated.");
          updateStepStatus("evaluator", "running", "Grading student answers and detecting weak concepts...");
        }, 1200);

        setTimeout(() => {
          updateStepStatus("evaluator", "completed", "Score computed & weak topics identified.");
          updateStepStatus("resource_finder", "running", "Searching for verified Khan Academy & YouTube resources...");
        }, 4500);

        setTimeout(() => {
          updateStepStatus("resource_finder", "completed", "Resources curated.");
          updateStepStatus("cheatsheet", "running", "Synthesizing high-yield risk-ranked revision rules...");
        }, 7500);

        // Make the real backend API call
        const result: AnalyzeResponse = await analyzeQuizApi(requestData);

        // Complete all steps
        setAgentSteps((prev) =>
          prev.map((step) => ({
            ...step,
            status: "completed",
            detail: "Finished successfully.",
          }))
        );

        // Save result in session storage
        sessionStorage.setItem("analysis", JSON.stringify(result));
        toast.success("Analysis complete! Review your results.");

        // Brief delay so user sees all agents completed
        setTimeout(() => {
          navigate("/result");
        }, 1000);

        return result;
      } catch (err: any) {
        console.error("Failed to analyze quiz:", err);
        setError(err.message || "Failed to analyze quiz. Check backend logs.");
        setAgentSteps((prev) =>
          prev.map((step) =>
            step.status === "running"
              ? { ...step, status: "error", detail: err.message || "Failed" }
              : step
          )
        );
        toast.error(err.message || "Evaluation failed. Make sure backend is running.");
        throw err;
      } finally {
        setAnalyzing(false);
      }
    },
    [navigate]
  );

  return {
    analyzing,
    agentSteps,
    error,
    startAnalysis,
  };
}
