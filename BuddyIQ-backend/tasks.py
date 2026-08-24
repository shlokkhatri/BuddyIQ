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

def build_resource_task(subject:str, weak_topics:list, agent):
    topics_str = ", ".join(weak_topics)
    return Task(
        description = (
            f"""The student is studying '{subject}' and struggled with the 
            following topics : '{topics_str}' . For each weak topic, search
            the web and find the single best educational video or artical
            that explain that exact concept ; prefer reputable source(Khan 
            academy, university course pages, well-regarded educational 
            channels, official docs for technical subjects).  Don't just 
            link generic search results page. Return only valid JSON (No 
            markdown, No commentary) in this exact shape :
            {{"resources": [{{"topic": "...", "title": "...", "url": "...", 
            "type": "video"}}]}}
            valid "type" values: "vedio", "artical". One entry per weak topic .
            """
        ),
    expected_output = "A single valid JSON object matching the specified shape, nothinng else. ",
    agent = agent
    )

def build_cheatsheet_task(subject:str, weak_topics:list, resource_json:str, agent):
    return Task(
        description =  (
            f"""The student is studing '{subject}' and struggled with these
            cocepts : {', '.join(weak_topics)}. --- RESOURCES FOUNDED FOR THISS TOPICS ---\n
            {resource_json}\n\nCompile a condensed cheat sheet : for EACH weak topic, give one
            tight (1-2 sentences). Order topics from highest risk(most fundaamental / most 
            likely to reappear) to lowest.\n\nReturn ONLY valid JSON (No markdown, No commmentay)
            in thisexact shape : \n{{"items": [{{"topic": "...", "rule": "...", "risk": "high"}}]}}\n
            Valid "risk" values: "high", "medium", "low".
            """
        ),
        expected_output = "A single valid JSON object matching the specified shape, nothing else. ",
        agent = agent
    )