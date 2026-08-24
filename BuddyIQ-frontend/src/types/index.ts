// ===============================
// Standard / Subject / Chapter
// ===============================

export interface StandardsResponse {
  standards: string[];
}

export interface SubjectsResponse {
  subjects: string[];
}

export interface Chapter {
  id: string;
  label: string;
  title: string;
  path: string;
}

export interface ChaptersResponse {
  chapters: Chapter[];
}

// ===============================
// Quiz Setup Request & Question
// ===============================

export type DifficultyLevel = "Easy" | "Medium" | "Hard" | "Mixed";

export interface QuizRequest {
  standard: string;
  subject: string;
  chapter_id: string;
  difficulty: string;
  num_questions: number;
}

export type QuestionType = "MCQ" | "fill_blank" | "short_answer";

export interface QuizQuestion {
  id: number;
  question: string;
  type: QuestionType;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface QuizResponse {
  subject: string;
  chapter: string;
  difficulty: string;
  num_questions: number;
  quiz: QuizData;
}

// ===============================
// Student Answers
// ===============================

export interface StudentAnswers {
  [questionId: string]: string;
}

// ===============================
// Evaluation & Analysis
// ===============================

export interface QuestionEvaluationResult {
  id: number;
  correct: boolean;
  student_answer?: string;
  correct_answer?: string;
  feedback: string;
}

export interface EvaluationData {
  score: string | number;
  results?: QuestionEvaluationResult[];
  weak_topics: string[];
  total_questions?: number;
  correct_answers?: number;
  incorrect_answers?: number;
  [key: string]: unknown;
}

export interface ResourceItem {
  topic: string;
  title: string;
  url: string;
  type?: "video" | "article" | "vedio" | "artical" | string;
  description?: string;
}

export interface ResourcePayload {
  resources?: ResourceItem[];
  [key: string]: unknown;
}

export interface CheatSheetItem {
  topic: string;
  rule: string;
  risk?: "high" | "medium" | "low" | string;
}

export interface CheatSheetPayload {
  items?: CheatSheetItem[];
  [key: string]: unknown;
}

export interface AnalyzeRequest {
  subject: string;
  quiz: QuizData;
  student_answers: StudentAnswers;
}

export interface AnalyzeResponse {
  evaluation: EvaluationData;
  resources: ResourcePayload | ResourceItem[] | unknown;
  cheatsheet: CheatSheetPayload | CheatSheetItem[] | string | unknown;
}

// ===============================
// Agent Status for Processing
// ===============================

export type AgentStepStatus = "waiting" | "running" | "completed" | "error";

export interface AgentStep {
  id: string;
  name: string;
  role: string;
  description: string;
  status: AgentStepStatus;
  detail?: string;
}