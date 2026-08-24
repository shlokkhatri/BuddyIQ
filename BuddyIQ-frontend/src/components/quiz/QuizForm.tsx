import { useState } from "react";
import type { QuizData, QuizQuestion } from "../../types";

interface QuizFormProps {
  quiz: QuizData;
  onSubmit: (answers: Record<string, string>) => void;
  loading?: boolean;
}

export default function QuizForm({
  quiz,
  onSubmit,
  loading = false,
}: QuizFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (
    questionId: number,
    answer: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [String(questionId)]: answer,
    }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="space-y-6">

      {quiz.questions.map((question: QuizQuestion, index) => (
        <div
          key={question.id}
          className="bg-white rounded-2xl shadow-md p-6 border border-slate-200"
        >
          {/* Question */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-blue-600 mb-2">
              Question {index + 1}
            </p>

            <h3 className="text-lg font-semibold text-slate-800">
              {question.question}
            </h3>
          </div>

          {/* MCQ */}
          {question.type === "MCQ" && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={
                      answers[String(question.id)] === option
                    }
                    onChange={() =>
                      handleAnswerChange(
                        question.id,
                        option
                      )
                    }
                    className="w-4 h-4"
                  />

                  <span className="text-slate-700">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Fill in the blank / Short answer */}
          {(question.type === "fill_blank" ||
            question.type === "short_answer") && (
            <textarea
              value={answers[String(question.id)] || ""}
              onChange={(e) =>
                handleAnswerChange(
                  question.id,
                  e.target.value
                )
              }
              placeholder="Enter your answer..."
              rows={4}
              className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
            />
          )}
        </div>
      ))}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-4 rounded-xl font-semibold transition"
      >
        {loading ? "Evaluating..." : "Submit Quiz →"}
      </button>
    </div>
  );
}