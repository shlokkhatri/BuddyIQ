import json
from crewai import Crew, Process
from agents import quiz_generator,answer_evaluator,resource_finder,cheatsheet
from tasks import build_cheatsheet_task,build_evaluation_task,build_quiz_task,build_resource_task


async def run_quiz_stage(subject, chapter, difficulty, num_questions, source_text):
    task = build_quiz_task(subject, chapter, difficulty, num_questions, source_text, quiz_generator)
    crew = Crew(agents=[quiz_generator], tasks=[task], process=Process.sequential, verbose=True)
    result = await crew.kickoff_async()
    return _safe_json(str(result))

 
def run_evaluation_stage(quiz_json, student_answers):
    task = build_evaluation_task(quiz_json, student_answers, answer_evaluator)
    crew = Crew(agents=[answer_evaluator], tasks = [task], process=Process.sequential, verbose=True)
    result = crew.kickoff()
    return _safe_json(str(result))


async def run_resource_stage(subject, weak_topics):
    task = build_resource_task(subject, weak_topics, resource_finder)
    crew = Crew(agents=[resource_finder], tasks=[task], process=Process.sequential, verbose=True)
    result = await crew.kickoff_async()
    return _safe_json(str(result))


async def run_cheatsheet_stage(subject, weak_topics, resource_json):
    task = build_cheatsheet_task(subject, weak_topics, resource_json, cheatsheet)
    crew= Crew(agents = [cheatsheet], tasks= [task], process= Process.sequential, verbose= True)
    result = await crew.kickoff_async()
    return _safe_json(str(result))


def _safe_json(text, retries = 1):
    """Strip stray markdown fences and parse. Raise if the agent still didn't return valid JSON."""
    cleaned = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Agent did not return valid JSON: {e}\nRaw Output:\n{text}")