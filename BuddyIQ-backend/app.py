# app.py

import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from notebook_loader import get_notebook_index, extract_chapter_text
from tasks import build_quiz_task, build_evaluation_task
from agents import quiz_generator, answer_evaluator
from crewai import Crew, Process
from crew import run_resource_stage, run_cheatsheet_stage


app = FastAPI(title="Study Buddy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React dev server address
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- helper ----------

def parse_json_output(raw_output: str) -> dict:
    text = str(raw_output).strip()
    if text.startswith("```"):
        text = text.strip("`")
        text = text.replace("json\n", "", 1)
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"Agent returned malformed JSON: {e}")


def sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


# ---------- browse endpoints (fill the dropdowns) ----------


@app.get("/api/standards")
def list_standards():
    index = get_notebook_index()

    return {
        "standards": list(index.keys())
    }


@app.get("/api/standards/{standard}/subjects")
def list_subjects(standard: str):

    index = get_notebook_index()

    if standard not in index:
        raise HTTPException(404, "Standard not found")

    return {
        "subjects": list(index[standard].keys())
    }


@app.get("/api/standards/{standard}/subjects/{subject}/chapters")
def list_chapters(standard: str, subject: str):

    index = get_notebook_index()

    if standard not in index:
        raise HTTPException(404, "Standard not found")

    if subject not in index[standard]:
        raise HTTPException(404, "Subject not found")

    return {
        "chapters": [
            {
                "id": f"{c['part']}-{c['chapter_num']}",
                "label": f"Part {c['part']}, Ch {c['chapter_num']}: {c['title']}",
                "title": c["title"],
                "path": c["path"],
            }
            for c in index[standard][subject]
        ]
    }


# ---------- stage 1: quiz generation ----------

class QuizRequest(BaseModel):
    standard: str
    subject: str
    chapter_id: str
    difficulty: str
    num_questions: int


@app.post("/api/quiz")
async def create_quiz(req: QuizRequest):

    print("1. Request received")

    index = get_notebook_index()

    print("2. Index loaded")

    chapter = next(
        (
            c
            for c in index[req.standard][req.subject]
            if f"{c['part']}-{c['chapter_num']}" == req.chapter_id
        ),
        None,
    )

    print("3. Chapter found:", chapter)

    source_text = extract_chapter_text(chapter["path"], max_chars=6000)

    print("4. PDF extracted")

    task = build_quiz_task(
        subject=req.subject,
        chapter=chapter["title"],
        difficulty=req.difficulty,
        num_questions=req.num_questions,
        source_text=source_text,
        agent=quiz_generator,
    )

    print("5. Task created")

    crew = Crew(
        agents=[quiz_generator],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )

    print("6. Running Crew")

    result = await crew.kickoff_async()

    print("7. Crew finished")

    print(result.raw)

    quiz = parse_json_output(result.raw)

    print("8. JSON parsed")

    response = {
        "subject": req.subject,
        "chapter": chapter["title"],
        "difficulty": req.difficulty,
        "num_questions": req.num_questions,
        "quiz": quiz,
    }

    print("9. Returning response")

    return response


# ---------- stage 2-4: evaluate -> resources -> cheat sheet, streamed live ----------

class AnalyzeRequest(BaseModel):
    subject: str
    quiz: dict
    student_answers: dict  # e.g. { "1": "A", "2": "some text answer" }


# @app.post("/api/analyze")
# async def analyze(req: AnalyzeRequest):
#     print("Analyze API called")

#     async def stream():

#         try:
#             print("===== ANALYZE START =====")

#             yield sse("status", {
#                 "agent": "manager",
#                 "status": "running",
#                 "task": "Assigning work..."
#             })

#             print("Manager sent")

#             await asyncio.sleep(0.3)

#             print("Creating evaluation task")

#             eval_task = build_evaluation_task(
#                 quiz_json=json.dumps(req.quiz),
#                 student_answers=req.student_answers,
#                 agent=answer_evaluator,
#             )

#             print("Creating Crew")

#             eval_crew = Crew(
#                 agents=[answer_evaluator],
#                 tasks=[eval_task],
#                 process=Process.sequential,
#                 verbose=True,
#             )

#             print("Running Crew")

#             eval_result = await eval_crew.kickoff_async()

#             print("Crew Finished")

#             print(eval_result.raw)

#             eval_data = parse_json_output(eval_result.raw)

#             print("JSON Parsed")

#             yield sse("evaluation", eval_data)

#             print("Evaluation sent")

#             yield sse("done", {})

#             print("Done sent")

#         except Exception as e:
#             import traceback

#             traceback.print_exc()

#             yield sse("error", {
#                 "message": str(e)
#             })

#     return StreamingResponse(
#         stream(),
#         media_type="text/event-stream",
#     )
@app.post("/api/analyze")
async def analyze(req: AnalyzeRequest):

    eval_task = build_evaluation_task(
        quiz_json=json.dumps(req.quiz),
        student_answers=req.student_answers,
        agent=answer_evaluator,
    )

    eval_crew = Crew(
        agents=[answer_evaluator],
        tasks=[eval_task],
        process=Process.sequential,
        verbose=True,
    )

    print("STEP 1")

    eval_result = await eval_crew.kickoff_async()

    print("STEP 2")

    eval_data = parse_json_output(eval_result.raw)

    print("STEP 3")

    weak_topics = eval_data.get("weak_topics", [])

    print("STEP 4")

    resources = await run_resource_stage(req.subject, weak_topics)

    print("STEP 5")

    cheatsheet = await run_cheatsheet_stage(
        req.subject,
        weak_topics,
        json.dumps(resources),
    )

    print("STEP 6")

    return {
        "evaluation": eval_data,
        "resources": resources,
        "cheatsheet": cheatsheet,
    }