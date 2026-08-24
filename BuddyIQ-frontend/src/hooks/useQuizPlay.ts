import { useState } from "react";

export function useQuizPlay() {
  const quizData = JSON.parse(sessionStorage.getItem("quiz") || "{}");

  const questions = quizData.quiz?.questions || [];

  const [answers, setAnswers] = useState<Record<string, string>>({});

  function updateAnswer(id: number, answer: string) {
    setAnswers((prev) => ({
      ...prev,
      [String(id)]: answer,
    }));
  }

  return {
    quizData,
    questions,
    answers,
    updateAnswer,
  };
}