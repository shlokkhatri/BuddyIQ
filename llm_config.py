import os
from dotenv import load_dotenv
from crewai import LLM

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.getenv("GROQ_API_KEY")

def get_llm():
    return LLM(
        model="openai/llama-3.3-70b-versatile",
        base_url="https://api.groq.com/openai/v1",
        api_key=os.getenv("GROQ_API_KEY"),
    )