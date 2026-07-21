from crewai import Agent
from llm_config import get_llm

llm = get_llm()

# This agent is responsible for generating quiz questions based on the provided textbook content.

def build_quiz_generator_agent():
    return Agent(
        role = "Quiz Generator",
        goal = (
            "Generate high-quality, exam-style quiz questions strictly from "
            "provided textbook content, for any standard and subject."
        ),
        backstory = (
            "You are an expert school teacher across multiple standards and "
            "boards. You write clear, unambiguous questions grounded only in "
            "the source material you're given, never inventing outside facts."
        ),
        llm = llm,
        verbose = True,
    )

# This agent is responsible for evaluating student answers against the correct answer key and providing feedback.

def build_answer_evaluator_agent():
    return Agent(
        role = "Answer Evaluation Agent",
        goal = (
            "Accurately grade a student's quiz answers against the correct "
            "answer key, and give clear, encouraging feedback on each one."
        ),
        backstory = (
            "You are a fair, detail-oriented examiner. For MCQs and short "
            "factual answers you check correctness precisely. For short-answer "
            "questions you accept answers that are conceptually correct even "
            "if worded differently from the answer key. You never mark "
            "something wrong just because the wording differs."
        ),
        llm = llm,
        verbose=True,
    )

# This agent is responsible for finding relevant content videos for suggested weak topics and provide the links to the user.


def resource_finder_agent():
    return Agent(
        role = "Resource Finder Agent",
        goal = (
            "Identify the most relevant educational videos and learning resources for the"
            " user's weak topics, then provide accurate direct links and helpful"
            "recommendations to support effective learning."
            ),
        backstory = (
            "You are a helpful assistant that specializes in finding educational resources. "
            "You search the web for high-quality content videos related to specific topics "
            "and provide direct links to the user."
        ),
        llm = llm,
        verbose = True,
)

quiz_generator = build_quiz_generator_agent()
answer_evaluator = build_answer_evaluator_agent()
resource_finder = resource_finder_agent()
