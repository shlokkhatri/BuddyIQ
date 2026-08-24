import api from "./client";
import type {
  QuizRequest,
  QuizResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  Chapter,
} from "../types";

// ===============================
// Backend Health Check
// ===============================
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await api.get("/standards", { timeout: 4000 });
    return res.status === 200;
  } catch {
    return false;
  }
};

// ===============================
// Get Standards (e.g. XI, XII)
// ===============================
export const getStandards = async (): Promise<string[]> => {
  const res = await api.get("/standards");
  return res.data.standards || [];
};

// ===============================
// Get Subjects for a Standard
// ===============================
export const getSubjects = async (standard: string): Promise<string[]> => {
  const res = await api.get(`/standards/${encodeURIComponent(standard)}/subjects`);
  return res.data.subjects || [];
};

// ===============================
// Get Chapters for a Subject
// ===============================
export const getChapters = async (
  standard: string,
  subject: string
): Promise<Chapter[]> => {
  const res = await api.get(
    `/standards/${encodeURIComponent(standard)}/subjects/${encodeURIComponent(subject)}/chapters`
  );
  return res.data.chapters || [];
};

// ===============================
// Generate Quiz via Quiz Generator Agent
// ===============================
export const createQuiz = async (body: QuizRequest): Promise<QuizResponse> => {
  const res = await api.post("/quiz", body);
  return res.data;
};

// ===============================
// Analyze Quiz via Evaluator, Resource Finder, & Cheatsheet Agents
// ===============================
export const analyzeQuiz = async (body: AnalyzeRequest): Promise<AnalyzeResponse> => {
  const res = await api.post("/analyze", body);
  return res.data;
};