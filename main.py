import json
from crewai import Crew, Process
from llm_config import get_llm
from agents import quiz_generator, answer_evaluator
from tasks import build_quiz_task, build_evaluation_task
from notebook_loader import get_notebook_index, extract_chapter_text


def choose_from_list(prompt, options):
    print(f"\n{prompt}")
    for i, opt in enumerate(options, start=1):
        print(f"  {i}. {opt}")
    while True:
        choice = input("Enter number: ").strip()
        if choice.isdigit() and 1 <= int(choice) <= len(options):
            return options[int(choice) - 1]
        print("Invalid choice, try again.")


def choose_question_count():
    presets = [5, 10, 15, 20, 25]
    choice = choose_from_list(
        "How many questions? (keep it modest on the free tier)",
        [str(n) for n in presets],
    )
    return int(choice)


def parse_json_output(raw_output: str) -> dict:
    text = str(raw_output).strip()
    if text.startswith("```"):
        text = text.strip("`")
        text = text.replace("json\n", "", 1)
    return json.loads(text)


def get_mcq_letters(options):
    """Returns ['A', 'B', 'C', 'D'] matching however many options exist."""
    return [chr(65 + i) for i in range(len(options))]


def ask_mcq_answer(options):
    letters = get_mcq_letters(options)
    valid_set = set(letters)
    while True:
        answer = input("Your answer (letter): ").strip().upper()
        if answer in valid_set:
            return answer
        print(f"  Invalid choice. Please enter one of: {', '.join(letters)}")


def ask_open_answer():
    while True:
        answer = input("Your answer: ").strip()
        if answer:
            return answer
        print("  Answer can't be empty. Please type something.")





index = get_notebook_index()
subject = choose_from_list("Select a subject:", list(index.keys()))

chapters = index[subject]
chapter_labels = [f"Part {c['part']}, Ch {c['chapter_num']}: {c['title']}" for c in chapters]
chosen_label = choose_from_list(f"Select a chapter in {subject}:", chapter_labels)
chosen_chapter = chapters[chapter_labels.index(chosen_label)]

difficulty = choose_from_list("Select difficulty:", ["Easy", "Medium", "Hard", "Mixed"])
num_questions = choose_question_count()




print(f"\nReading chapter PDF: {chosen_chapter['title']} ...")
source_text = extract_chapter_text(chosen_chapter["path"], max_chars=6000)

quiz_task = build_quiz_task(
    subject=subject,
    chapter=chosen_chapter["title"],
    difficulty=difficulty,
    num_questions=num_questions,    
    source_text=source_text,
    agent=quiz_generator,
)

quiz_crew = Crew(
    agents=[quiz_generator],
    tasks=[quiz_task],
    process=Process.sequential,  # single agent -> no Manager overhead / token doubling
    verbose=True,
)

quiz_result = quiz_crew.kickoff()
quiz_data = parse_json_output(quiz_result.raw)



print("\n\n=== QUIZ TIME ===\n")
student_answers = {}

for q in quiz_data["questions"]:
    qtype = q.get("type", "short_answer")
    print(f"\nQ{q['id']}. {q['question']}")

    if qtype == "MCQ" and q.get("options"):
        letters = get_mcq_letters(q["options"])
        for letter, opt in zip(letters, q["options"]):
            print(f"   {letter}. {opt}")
        student_answers[q["id"]] = ask_mcq_answer(q["options"])
    else:
        if qtype == "fill_blank":
            print("   (fill in the blank marked with ____ above)")
        student_answers[q["id"]] = ask_open_answer()




print("\nGrading your answers...\n")

eval_task = build_evaluation_task(
    quiz_json=json.dumps(quiz_data),
    student_answers=student_answers,
    agent=answer_evaluator,
)

eval_crew = Crew(
    agents=[answer_evaluator],
    tasks=[eval_task],
    process=Process.sequential,
    verbose=True,
)

eval_result = eval_crew.kickoff()
eval_data = parse_json_output(eval_result.raw)




print("\n\n=== RESULTS ===\n")
print(f"Score: {eval_data['score']}\n")
for r in eval_data["results"]:
    mark = "✅" if r["correct"] else "❌"
    print(f"{mark} Q{r['id']}: {r['feedback']}")

if eval_data.get("weak_topics"):
    print("\nWeak topics to review:")
    for topic in eval_data["weak_topics"]:
        print(f"  - {topic}")