import MCQQuestion from "./MCQQuestion";
import FillBlank from "./FillBlank";
import ShortAnswer from "./ShortAnswer";
import type { QuizQuestion as QuizQuestionType } from "../../types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  index: number;
  totalQuestions: number;
  answer: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
}

export default function QuizQuestion({
  question,
  index,
  totalQuestions,
  answer,
  onAnswerChange,
  disabled = false,
}: QuizQuestionProps) {
  const getTypeBadge = () => {
    switch (question.type) {
      case "MCQ":
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Multiple Choice
          </span>
        );
      case "fill_blank":
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Fill in the Blank
          </span>
        );
      case "short_answer":
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Short Answer
          </span>
        );
      default:
        return null;
    }
  };

  const isAnswered = answer && answer.trim().length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-black/30 p-6 sm:p-8 space-y-6 transition-all duration-200">
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-500/20">
            {index + 1}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Question {index + 1} of {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {getTypeBadge()}
          {isAnswered && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ✓ Answered
            </span>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Question Inputs according to type */}
      <div className="pt-2">
        {question.type === "MCQ" && question.options && (
          <MCQQuestion
            questionId={question.id}
            options={question.options}
            selectedAnswer={answer}
            onSelectAnswer={onAnswerChange}
            disabled={disabled}
          />
        )}

        {question.type === "fill_blank" && (
          <FillBlank
            question={question.question}
            answer={answer}
            onAnswerChange={onAnswerChange}
            disabled={disabled}
          />
        )}

        {question.type === "short_answer" && (
          <ShortAnswer
            answer={answer}
            onAnswerChange={onAnswerChange}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}