# BuddyIQ 🧠

> AI-Powered Study Assistant for Personalized Quiz-Based Learning

BuddyIQ is an AI-powered study assistant designed to help students learn from their study material through automatically generated quizzes, answer evaluation, weak-topic detection, learning resources, and AI-generated revision material.

The project uses a multi-agent architecture where different AI agents are responsible for different stages of the learning workflow.

---

## 📌 What is BuddyIQ?

Studying alone can make it difficult for students to identify what they actually understand and where they need improvement.

BuddyIQ solves this problem by creating a personalized learning workflow:

1. Student selects their standard.
2. Student selects a subject.
3. Student selects a chapter.
4. Student chooses quiz difficulty.
5. Student chooses the number of questions.
6. BuddyIQ reads the selected chapter from the available study material.
7. The Quiz Generator Agent creates a quiz.
8. Student attempts the quiz.
9. Student answers are evaluated by an AI evaluation agent.
10. Weak topics are identified.
11. Learning resources are searched for weak topics.
12. A personalized cheat sheet is generated for revision.

The goal is to move from:

**Study → Guess what you don't know**

to:

**Study → Test → Identify weaknesses → Learn → Revise**

---

# ✨ Features

## 📚 Study Material Based Quizzes

BuddyIQ generates quizzes from the chapter material available in the `NOTEBOOKS` directory.

The system supports:

- Multiple Choice Questions (MCQ)
- Fill in the Blank
- Short Answer

---

## 🎯 Difficulty Selection

Students can choose between:

- Easy
- Medium
- Hard
- Mixed

---

## 🔢 Custom Question Count

Students can select the number of questions:

- 5
- 10
- 15
- 20

---

## 🤖 AI Quiz Generation

The Quiz Generator Agent analyzes the selected chapter content and generates questions based on:

- Subject
- Chapter
- Difficulty
- Number of questions
- Chapter source material

---

## 🧠 AI Answer Evaluation

After completing the quiz, the student's answers are sent to the evaluation agent.

The evaluator analyzes the student's performance and identifies:

- Correct answers
- Incorrect answers
- Weak topics
- Performance information

---

## 🔎 Weak Topic Detection

BuddyIQ focuses on identifying topics that the student struggles with rather than simply providing a score.

This allows the system to personalize the student's next learning steps.

---

## 🌐 Learning Resources

For identified weak topics, BuddyIQ can search for useful learning resources.

The goal is to help students learn the topics they struggled with instead of simply showing them their mistakes.

---

## 📖 AI Generated Cheat Sheet

BuddyIQ generates a concise revision cheat sheet based on the student's weak topics.

The cheat sheet can contain important concepts and revision points that help the student quickly review difficult areas.

---

##How to Run the Project
You need to run the backend and frontend separately.


Run Backend

Open PowerShell / Terminal.
Navigate to:

```bash
cd BuddyIQ-backend
```
Create Virtual Environment
If you haven't created one:
```bash
python -m venv .venv
```

Activate Virtual Environment On Windows PowerShell:
```bash
.\.venv\Scripts\Activate.ps1
```
You should see at the beginning of your terminal:
*(.venv)*


#Install Backend Dependencies
```bash
pip install -r requirements.txt
```
Environment Variables ,Create a .env file inside:
BuddyIQ-backend

Add the required API keys used by your AI configuration.
For example:
OPENAI_API_KEY=your_api_key_here

##Start FastAPI

Run:
```bash
uvicorn app:app --reload
```
If everything is working correctly, you should see something similar to:
INFO:     Uvicorn running on http://127.0.0.1:8000

The backend will then be available at:
http://127.0.0.1:8000



##Run Frontend

Open a second terminal and Navigate to:
```bash
cd BuddyIQ-frontend
```
Install frontend dependencies:
```bash
npm install
```
Then start the Vite development server:
```bash
npm run dev
```
You should see something similar to:
Local: http://localhost:5173/
Open:
http://localhost:5173
