import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Brain, RefreshCw, AlertCircle } from "lucide-react";
import AgentTimeline from "../components/agent/AgentTimeline";
import Button from "../components/common/Button";
import { useAnalyze } from "../hooks/useAnalyze";
import type { QuizResponse, StudentAnswers } from "../types";

export default function Processing() {
  const navigate = useNavigate();
  const { analyzing, agentSteps, error, startAnalysis } = useAnalyze();
  const analysisTriggered = useRef(false);

  const runPipeline = () => {
    const quizDataStr = sessionStorage.getItem("quiz");
    const answersStr = sessionStorage.getItem("student_answers");

    if (!quizDataStr) {
      toast.warning("No quiz in session to analyze.");
      navigate("/");
      return;
    }

    try {
      const quiz: QuizResponse = JSON.parse(quizDataStr);
      const studentAnswers: StudentAnswers = answersStr
        ? JSON.parse(answersStr)
        : {};

      startAnalysis({
        subject: quiz.subject,
        quiz: quiz.quiz,
        student_answers: studentAnswers,
      });
    } catch (err) {
      console.error("Error reading quiz data for analysis:", err);
      toast.error("Failed to read quiz session data.");
      navigate("/");
    }
  };

  useEffect(() => {
    if (!analysisTriggered.current) {
      analysisTriggered.current = true;
      runPipeline();
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-blue-500/25 mb-2">
          <Brain className="w-8 h-8 animate-pulse" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Multi-Agent Analysis
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Our autonomous CrewAI agents are evaluating your answers, finding curated study resources, and synthesizing your personal cheat sheet.
        </p>
      </div>

      {/* Error Alert with Retry */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs text-red-800 dark:text-red-300">
              <p className="font-bold text-sm">Agent Pipeline Error</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/quiz")}
            >
              Back to Quiz
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                analysisTriggered.current = false;
                runPipeline();
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Retry Evaluation
            </Button>
          </div>
        </div>
      )}

      {/* Agent Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-6 sm:p-8 transition-colors duration-200">
        <AgentTimeline
          steps={agentSteps}
          title="Live Agent Pipeline Execution"
          subtitle="Watch CrewAI agents collaborate in real-time"
        />
      </div>

      {analyzing && (
        <div className="text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium animate-pulse">
            Please keep this page open while LLM agents evaluate and compile your results...
          </p>
        </div>
      )}
    </div>
  );
}