import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  RotateCcw,
  PlusCircle,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  AlertTriangle,
} from "lucide-react";
import ScoreCard from "../components/result/ScoreCard";
import WeakTopics from "../components/result/WeakTopics";
import ResourceCard from "../components/result/ResourceCard";
import CheatSheetCard from "../components/result/CheatSheetCard";
import Button from "../components/common/Button";
import type {
  AnalyzeResponse,
  QuizResponse,
  ResourceItem,
  CheatSheetItem,
  QuestionEvaluationResult,
} from "../types";

export default function Result() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"questions" | "weak_topics" | "resources" | "cheatsheet">("questions");
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const analysisStr = sessionStorage.getItem("analysis");
    const quizStr = sessionStorage.getItem("quiz");

    if (!analysisStr) {
      toast.warning("No analysis results found. Please complete a quiz first.");
      navigate("/");
      return;
    }

    try {
      const parsedAnalysis: AnalyzeResponse = JSON.parse(analysisStr);
      setAnalysis(parsedAnalysis);

      if (quizStr) {
        setQuiz(JSON.parse(quizStr));
      }
    } catch (err) {
      console.error("Failed to parse results:", err);
      toast.error("Failed to load quiz results.");
      navigate("/");
    }
  }, [navigate]);

  if (!analysis) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading results...</p>
      </div>
    );
  }

  // Normalize resources array
  let resourcesList: ResourceItem[] = [];
  if (Array.isArray(analysis.resources)) {
    resourcesList = analysis.resources;
  } else if (
    analysis.resources &&
    typeof analysis.resources === "object" &&
    Array.isArray((analysis.resources as any).resources)
  ) {
    resourcesList = (analysis.resources as any).resources;
  }

  // Normalize cheatsheet items
  let cheatsheetList: CheatSheetItem[] = [];
  if (Array.isArray(analysis.cheatsheet)) {
    cheatsheetList = analysis.cheatsheet;
  } else if (
    analysis.cheatsheet &&
    typeof analysis.cheatsheet === "object" &&
    Array.isArray((analysis.cheatsheet as any).items)
  ) {
    cheatsheetList = (analysis.cheatsheet as any).items;
  }

  // Evaluation results
  const evaluation = analysis.evaluation;
  const evaluationResults: QuestionEvaluationResult[] = evaluation.results || [];
  const weakTopics = evaluation.weak_topics || [];

  const totalQuestions =
    quiz?.quiz?.questions?.length || evaluationResults.length || 1;
  const correctCount =
    evaluationResults.filter((r) => r.correct).length;
  const incorrectCount = totalQuestions - correctCount;

  const toggleExpand = (id: number) => {
    setExpandedQuestionIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRetakeQuiz = () => {
    sessionStorage.removeItem("analysis");
    sessionStorage.removeItem("student_answers");
    sessionStorage.removeItem("draft_answers");
    sessionStorage.removeItem("draft_answers_quiz_id");
    sessionStorage.setItem("current_quiz_id", `quiz_retake_${Date.now()}`);
    navigate("/quiz");
  };

  const handleNewQuiz = () => {
    sessionStorage.removeItem("quiz");
    sessionStorage.removeItem("current_quiz_id");
    sessionStorage.removeItem("draft_answers");
    sessionStorage.removeItem("draft_answers_quiz_id");
    sessionStorage.removeItem("student_answers");
    sessionStorage.removeItem("analysis");
    navigate("/");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Evaluation Complete</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Quiz Performance Report
          </h1>
          {quiz && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Subject: <strong className="text-slate-700 dark:text-slate-300">{quiz.subject}</strong> •
              Chapter: <strong className="text-slate-700 dark:text-slate-300">{quiz.chapter}</strong>
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleNewQuiz}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Quiz
          </Button>
        </div>
      </div>

      {/* Score Overview Card */}
      <ScoreCard
        scoreString={evaluation.score}
        totalQuestions={totalQuestions}
        correctAnswers={correctCount}
        incorrectAnswers={incorrectCount}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("questions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "questions"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Question Review ({evaluationResults.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("weak_topics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "weak_topics"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Weak Concepts ({weakTopics.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "resources"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Recommended Resources ({resourcesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("cheatsheet")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "cheatsheet"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>AI Cheat Sheet ({cheatsheetList.length})</span>
        </button>
      </div>

      {/* Tab 1: Detailed Question Review */}
      {activeTab === "questions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Detailed Examiner Feedback
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Click any question to view full reasoning & explanations
            </span>
          </div>

          {evaluationResults.length === 0 && quiz?.quiz?.questions ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Grading breakdown summary unavailable.
            </p>
          ) : (
            <div className="space-y-3">
              {evaluationResults.map((result, idx) => {
                const originalQ = quiz?.quiz?.questions.find(
                  (q) => q.id === result.id || q.id === idx + 1
                );
                const isExpanded = expandedQuestionIds[result.id] ?? true;

                return (
                  <div
                    key={result.id || idx}
                    className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 ${
                      result.correct
                        ? "border-emerald-200/80 dark:border-emerald-900/60 shadow-xs"
                        : "border-rose-200/80 dark:border-rose-900/60 shadow-xs"
                    }`}
                  >
                    {/* Collapsible Header */}
                    <div
                      onClick={() => toggleExpand(result.id)}
                      className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            result.correct
                              ? "bg-emerald-600 text-white"
                              : "bg-rose-600 text-white"
                          }`}
                        >
                          {result.correct ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                            Question {result.id || idx + 1}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                            {originalQ?.question || `Question #${result.id}`}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            result.correct
                              ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          }`}
                        >
                          {result.correct ? "Correct" : "Incorrect"}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Student Answer */}
                          <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                            <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block text-[10px]">
                              Your Submitted Answer
                            </span>
                            <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                              {result.student_answer || "(No answer submitted)"}
                            </p>
                          </div>

                          {/* Correct Answer */}
                          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-900/60">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block text-[10px]">
                              Correct Textbook Answer
                            </span>
                            <p className="mt-1 font-medium text-emerald-900 dark:text-emerald-200">
                              {result.correct_answer ||
                                originalQ?.correct_answer ||
                                "See feedback"}
                            </p>
                          </div>
                        </div>

                        {/* Evaluator Agent Feedback */}
                        {result.feedback && (
                          <div className="bg-blue-50/60 dark:bg-blue-950/40 rounded-xl p-3.5 border border-blue-200/60 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                            <span className="font-bold flex items-center gap-1 text-blue-800 dark:text-blue-300">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              Examiner Feedback
                            </span>
                            <p className="leading-relaxed">{result.feedback}</p>
                          </div>
                        )}

                        {/* Textbook Explanation */}
                        {originalQ?.explanation && (
                          <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl">
                            <strong className="text-slate-700 dark:text-slate-300">Explanation: </strong>
                            {originalQ.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Weak Topics */}
      {activeTab === "weak_topics" && (
        <div className="space-y-6">
          <WeakTopics topics={weakTopics} />
        </div>
      )}

      {/* Tab 3: Recommended Resources */}
      {activeTab === "resources" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Curated Educational Resources
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct links discovered by the Resource Finder Agent for your weak areas.
            </p>
          </div>

          {resourcesList.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
              <p>No specific resources needed for this quiz session!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resourcesList.map((res, i) => (
                <ResourceCard key={i} resource={res} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: AI Cheat Sheet */}
      {activeTab === "cheatsheet" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              High-Yield Revision Cheat Sheet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Key formulas and rules synthesized by the Cheat Sheet Agent, ranked by exam risk.
            </p>
          </div>

          {cheatsheetList.length > 0 ? (
            <div className="space-y-3">
              {cheatsheetList.map((item, i) => (
                <CheatSheetCard key={i} item={item} index={i} />
              ))}
            </div>
          ) : typeof analysis.cheatsheet === "string" ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {analysis.cheatsheet}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
              <p>No cheat sheet items generated for this session.</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleRetakeQuiz}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Retake This Quiz
        </Button>

        <Button
          variant="primary"
          onClick={handleNewQuiz}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Take Another Subject / Chapter Quiz
        </Button>
      </div>
    </div>
  );
}