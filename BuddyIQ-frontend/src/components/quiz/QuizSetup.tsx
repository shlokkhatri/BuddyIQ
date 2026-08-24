import { Sparkles, BookOpen, Layers, GraduationCap, AlertCircle, RefreshCw } from "lucide-react";
import Select from "../common/SelectField";
import DifficultySelector from "./DifficultySelector";
import QuestionCount from "./QuestionCount";
import Button from "../common/Button";
import { useQuiz } from "../../hooks/useQuiz";

export default function QuizSetup() {
  const {
    standard,
    setStandard,
    subject,
    setSubject,
    chapter,
    setChapter,
    difficulty,
    setDifficulty,
    questionCount,
    setQuestionCount,
    standards,
    subjects,
    chapters,
    loadingStandards,
    loadingSubjects,
    loadingChapters,
    creatingQuiz,
    error,
    fetchStandards,
    createQuiz,
  } = useQuiz();

  const isFormValid = standard && subject && chapter && !creatingQuiz;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-6 sm:p-10 space-y-7 transition-all duration-200">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Configure Your Quiz
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select your textbook curriculum and let our AI agents tailor your practice session.
        </p>
      </div>

      {/* Backend Connection Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-amber-800 dark:text-amber-300">
            <p className="font-semibold text-sm">Backend connection required</p>
            <p className="mt-0.5">{error}</p>
            <p className="mt-2 font-medium">
              Start your backend server with: <code className="bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-200 font-mono">uvicorn app:app --reload</code>
            </p>
          </div>
          <button
            onClick={fetchStandards}
            className="px-3 py-1.5 rounded-lg bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Standard Selector */}
        <Select
          label="Standard / Grade"
          icon={<GraduationCap className="w-4 h-4" />}
          value={standard}
          placeholder="Choose Grade / Standard..."
          loading={loadingStandards}
          options={standards.map((s) => ({
            label: `Standard ${s}`,
            value: s,
          }))}
          onChange={setStandard}
          helperText="Available school grades detected in your textbooks."
        />

        {/* Subject Selector */}
        <Select
          label="Subject"
          icon={<BookOpen className="w-4 h-4" />}
          value={subject}
          disabled={!standard || subjects.length === 0}
          placeholder={!standard ? "First select a standard" : "Choose Subject..."}
          loading={loadingSubjects}
          options={subjects.map((s) => ({
            label: s,
            value: s,
          }))}
          onChange={setSubject}
          helperText="Curriculum subjects available for this grade."
        />
      </div>

      {/* Chapter Selector */}
      <Select
        label="Chapter / Topic"
        icon={<Layers className="w-4 h-4" />}
        value={chapter}
        disabled={!subject || chapters.length === 0}
        placeholder={!subject ? "First select a subject" : "Choose Chapter..."}
        loading={loadingChapters}
        options={chapters.map((c) => ({
          label: c.label,
          value: c.id,
        }))}
        onChange={setChapter}
        helperText="Select the specific chapter you want to be quizzed on."
      />

      {/* Difficulty & Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
        <DifficultySelector
          value={difficulty}
          onChange={setDifficulty}
          disabled={creatingQuiz}
        />

        <QuestionCount
          value={questionCount}
          onChange={setQuestionCount}
          disabled={creatingQuiz}
        />
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <Button
          size="lg"
          className="w-full text-base font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all"
          disabled={!isFormValid}
          loading={creatingQuiz}
          onClick={createQuiz}
          rightIcon={<Sparkles className="w-5 h-5" />}
        >
          {creatingQuiz ? "AI Agent is Reading PDF & Generating Quiz..." : "Generate AI Quiz →"}
        </Button>

        {creatingQuiz && (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3 animate-pulse">
            Extracting textbook context and invoking CrewAI Quiz Generator...
          </p>
        )}
      </div>
    </div>
  );
}
