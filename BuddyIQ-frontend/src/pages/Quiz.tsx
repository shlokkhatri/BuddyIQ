import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  BookOpen,
  AlertCircle,
  List,
  RotateCcw,
} from "lucide-react";
import QuizQuestion from "../components/quiz/QuizQuestion";
import ProgressBar from "../components/common/ProgressBar";
import Button from "../components/common/Button";
import type { QuizResponse, StudentAnswers } from "../types";

export default function Quiz() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [answers, setAnswers] = useState<StudentAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"stepper" | "all">("stepper");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("quiz");

    if (!data) {
      toast.warning("No active quiz found. Please create a quiz first.");
      navigate("/");
      return;
    }

    try {
      const parsed: QuizResponse = JSON.parse(data);
      if (!parsed.quiz || !parsed.quiz.questions || parsed.quiz.questions.length === 0) {
        throw new Error("Invalid quiz data structure");
      }
      setQuiz(parsed);

      // Verify that any saved draft answers belong strictly to the current active quiz ID
      const currentQuizId = sessionStorage.getItem("current_quiz_id");
      const savedAnswersQuizId = sessionStorage.getItem("draft_answers_quiz_id");
      const savedAnswers = sessionStorage.getItem("draft_answers");

      if (
        savedAnswers &&
        currentQuizId &&
        savedAnswersQuizId &&
        currentQuizId === savedAnswersQuizId
      ) {
        try {
          setAnswers(JSON.parse(savedAnswers));
        } catch {
          setAnswers({});
        }
      } else {
        // Fresh quiz: clear stale answers from previous quizzes
        setAnswers({});
        sessionStorage.removeItem("draft_answers");
        sessionStorage.removeItem("draft_answers_quiz_id");
      }
    } catch (error) {
      console.error("Invalid quiz data in session:", error);
      toast.error("Failed to load active quiz.");
      navigate("/");
    }
  }, [navigate]);

  const updateAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [String(questionId)]: answer,
      };
      const currentQuizId = sessionStorage.getItem("current_quiz_id") || "default";
      sessionStorage.setItem("draft_answers", JSON.stringify(updated));
      sessionStorage.setItem("draft_answers_quiz_id", currentQuizId);
      return updated;
    });
  };

  const handleResetAnswers = () => {
    setAnswers({});
    sessionStorage.removeItem("draft_answers");
    sessionStorage.removeItem("draft_answers_quiz_id");
    sessionStorage.removeItem("student_answers");
    setShowResetModal(false);
    setCurrentIndex(0);
    toast.info("All answers cleared for this quiz.");
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentIndex < quiz.quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    if (!quiz) return;

    const totalQuestions = quiz.quiz.questions.length;
    const answeredCount = Object.keys(answers).filter(
      (k) => answers[k] && answers[k].trim().length > 0
    ).length;

    if (answeredCount < totalQuestions) {
      setShowConfirmModal(true);
      return;
    }

    proceedToProcessing();
  };

  const proceedToProcessing = () => {
    if (!quiz) return;

    // Save final answers for analysis
    sessionStorage.setItem("student_answers", JSON.stringify(answers));
    navigate("/processing");
  };

  if (!quiz) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading quiz...</p>
      </div>
    );
  }

  const questions = quiz.quiz.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] && answers[k].trim().length > 0
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header & Meta */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-4 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                {quiz.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {quiz.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {quiz.chapter}
            </h1>
          </div>

          {/* View Mode Toggle & Reset Option */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {answeredCount > 0 && (
              <button
                onClick={() => setShowResetModal(true)}
                title="Clear all answers and restart"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Answers</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("stepper")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === "stepper"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                One-by-One
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === "all"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                All Questions
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar & Question Jump Grid */}
        <div className="space-y-3">
          <ProgressBar
            current={answeredCount}
            total={totalQuestions}
            label={`Answered ${answeredCount} of ${totalQuestions} questions`}
          />

          {/* Question Nav Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {questions.map((q, idx) => {
              const isAnswered = answers[String(q.id)] && answers[String(q.id)].trim().length > 0;
              const isCurrent = idx === currentIndex && viewMode === "stepper";

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    if (viewMode === "all") {
                      const el = document.getElementById(`question-card-${q.id}`);
                      el?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`
                    w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition cursor-pointer
                    ${
                      isCurrent
                        ? "bg-blue-600 text-white ring-2 ring-blue-500/30 shadow-xs"
                        : isAnswered
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Questions View */}
      {viewMode === "stepper" ? (
        <div className="space-y-6">
          <QuizQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            index={currentIndex}
            totalQuestions={totalQuestions}
            answer={answers[String(currentQuestion.id)] || ""}
            onAnswerChange={(ans) => updateAnswer(currentQuestion.id, ans)}
          />

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <Button
              variant="outline"
              size="lg"
              disabled={currentIndex === 0}
              onClick={handlePrevious}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            {currentIndex < totalQuestions - 1 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Quiz →
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} id={`question-card-${q.id}`}>
              <QuizQuestion
                question={q}
                index={idx}
                totalQuestions={totalQuestions}
                answer={answers[String(q.id)] || ""}
                onAnswerChange={(ans) => updateAnswer(q.id, ans)}
              />
            </div>
          ))}

          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-base"
              onClick={handleSubmit}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Submit Quiz ({answeredCount}/{totalQuestions} Answered) →
            </Button>
          </div>
        </div>
      )}

      {/* Incomplete Warning Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Unanswered Questions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You have answered <strong>{answeredCount}</strong> out of{" "}
                <strong>{totalQuestions}</strong> questions. Unanswered questions
                will be marked as incorrect by the evaluation agent.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmModal(false)}
              >
                Review Quiz
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  setShowConfirmModal(false);
                  proceedToProcessing();
                }}
              >
                Submit Anyway
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Answers Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Reset All Answers?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This will clear all your currently selected answers for this quiz so you can start fresh.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleResetAnswers}
              >
                Clear Answers
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}