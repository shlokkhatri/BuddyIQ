from crewai import Task


def build_quiz_task(subject: str, chapter: str, difficulty: str,
                     num_questions: int, source_text: str, agent):
    return Task(
        description=(
            f"Generate {num_questions} {difficulty}-difficulty quiz questions "
            f"for subject '{subject}', chapter '{chapter}', using ONLY the "
            f"textbook content below. Do not use outside knowledge.\n\n"
            f"--- TEXTBOOK CONTENT START ---\n{source_text}\n--- TEXTBOOK CONTENT END ---\n\n"
            f"Return ONLY valid JSON (no markdown, no commentary) in this exact shape:\n"
            f'{{"questions": [{{"id": 1, "question": "...", "type": "MCQ", '
            f'"options": ["A", "B", "C", "D"], "correct_answer": "...", '
            f'"explanation": "..."}}]}}\n'
            f'Valid "type" values: "MCQ", "fill_blank" (use "____" in the question '
            f'text for the blank), "short_answer". Omit "options" for non-MCQ types.'
        ),
        expected_output="A single valid JSON object matching the specified shape, nothing else.",
        agent=agent,
    )


def build_evaluation_task(quiz_json: str, student_answers: dict, agent):
    return Task(
        description=(
            f"You are given the original quiz (with correct answers) and the "
            f"student's submitted answers. Grade each question as correct or "
            f"incorrect, and provide brief feedback.\n\n"
            f"--- ORIGINAL QUIZ (with answer key) ---\n{quiz_json}\n\n"
            f"--- STUDENT ANSWERS ---\n{student_answers}\n\n"
            f'Return ONLY valid JSON in this shape:\n'
            f'{{"results": [{{"id": 1, "correct": true, "student_answer": "...", '
            f'"correct_answer": "...", "feedback": "..."}}], '
            f'"score": "X/Y", "weak_topics": ["topic1", "topic2"]}}\n'
            f'"weak_topics" should list specific concepts (not question numbers) '
            f'the student got wrong, e.g. "Kirchhoff\'s Laws" not "Question 3".'
        ),
        expected_output="A single valid JSON object matching the specified shape, nothing else.",
        agent=agent,
    )