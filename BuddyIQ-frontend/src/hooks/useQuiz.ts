import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getStandards,
  getSubjects,
  getChapters,
  createQuiz as createQuizApi,
} from "../api/quiz";
import type {
  Chapter,
  QuizRequest,
  QuizResponse,
} from "../types";

export function useQuiz() {
  const navigate = useNavigate();

  // ===============================
  // Selection state
  // ===============================
  const [standard, setStandard] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);

  // ===============================
  // Dropdown data
  // ===============================
  const [standards, setStandards] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // ===============================
  // Loading & Error states
  // ===============================
  const [loadingStandards, setLoadingStandards] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===============================
  // Quiz result
  // ===============================
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);

  // ===============================
  // Load standards on mount
  // ===============================
  const fetchStandards = useCallback(async () => {
    try {
      setLoadingStandards(true);
      setError(null);
      const data = await getStandards();
      setStandards(data);

      // Auto select if only 1 standard exists (e.g. XII)
      if (data.length === 1) {
        setStandard(data[0]);
      }
    } catch (err: any) {
      console.error("Failed to load standards:", err);
      setError("Cannot reach backend server. Make sure the FastAPI app is running on port 8000.");
      toast.error("Could not connect to backend. Is the Python server running?");
    } finally {
      setLoadingStandards(false);
    }
  }, []);

  useEffect(() => {
    fetchStandards();
  }, [fetchStandards]);

  // ===============================
  // Load subjects when standard changes
  // ===============================
  const handleStandardChange = async (selectedStandard: string) => {
    setStandard(selectedStandard);
    setSubject("");
    setChapter("");
    setSubjects([]);
    setChapters([]);

    if (!selectedStandard) return;

    try {
      setLoadingSubjects(true);
      const data = await getSubjects(selectedStandard);
      setSubjects(data);
      if (data.length === 1) {
        handleSubjectChange(selectedStandard, data[0]);
      }
    } catch (err: any) {
      console.error("Failed to load subjects:", err);
      toast.error("Failed to load subjects for standard: " + selectedStandard);
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Trigger loading subjects if standard was auto-selected
  useEffect(() => {
    if (standard && subjects.length === 0 && !loadingSubjects) {
      getSubjects(standard)
        .then((data) => setSubjects(data))
        .catch((e) => console.error(e));
    }
  }, [standard, subjects.length, loadingSubjects]);

  // ===============================
  // Load chapters when subject changes
  // ===============================
  const handleSubjectChange = async (
    selectedStandard: string,
    selectedSubject: string
  ) => {
    setSubject(selectedSubject);
    setChapter("");
    setChapters([]);

    if (!selectedStandard || !selectedSubject) return;

    try {
      setLoadingChapters(true);
      const data = await getChapters(selectedStandard, selectedSubject);
      setChapters(data);
    } catch (err: any) {
      console.error("Failed to load chapters:", err);
      toast.error("Failed to load chapters for subject: " + selectedSubject);
    } finally {
      setLoadingChapters(false);
    }
  };

  // ===============================
  // Create quiz & Navigate
  // ===============================
  const createQuiz = async () => {
    if (!standard || !subject || !chapter) {
      toast.warning("Please select a standard, subject, and chapter first.");
      return;
    }

    try {
      setCreatingQuiz(true);
      toast.info("Invoking Quiz Generator Agent... This may take a few seconds.");

      const request: QuizRequest = {
        standard,
        subject,
        chapter_id: chapter,
        difficulty,
        num_questions: questionCount,
      };

      const result = await createQuizApi(request);

      if (!result || !result.quiz || !result.quiz.questions || result.quiz.questions.length === 0) {
        throw new Error("No quiz questions received from AI Agent.");
      }

      // Generate a unique session ID for this new quiz instance
      const newQuizSessionId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      setQuizData(result);
      sessionStorage.setItem("quiz", JSON.stringify(result));
      sessionStorage.setItem("current_quiz_id", newQuizSessionId);

      // Clean all previous answers and analyses completely!
      sessionStorage.removeItem("draft_answers");
      sessionStorage.removeItem("student_answers");
      sessionStorage.removeItem("analysis");

      toast.success(`Successfully generated ${result.quiz.questions.length} questions!`);
      navigate("/quiz");
    } catch (err: any) {
      console.error("Failed to create quiz:", err);
      toast.error(err.message || "Failed to generate quiz with AI agent. Please try again.");
    } finally {
      setCreatingQuiz(false);
    }
  };

  return {
    // Selection
    standard,
    setStandard: handleStandardChange,

    subject,
    setSubject: (sub: string) => handleSubjectChange(standard, sub),

    chapter,
    setChapter,

    difficulty,
    setDifficulty,

    questionCount,
    setQuestionCount,

    // Dropdown data
    standards,
    subjects,
    chapters,

    // Loading states
    loadingStandards,
    loadingSubjects,
    loadingChapters,
    creatingQuiz,
    error,

    // Actions
    fetchStandards,
    createQuiz,

    // Quiz data
    quizData,
    setQuizData,
  };
}