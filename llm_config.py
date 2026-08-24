import os
import litellm
from dotenv import load_dotenv
from crewai import LLM

load_dotenv()

# Drop any unsupported provider params automatically
litellm.drop_params = True

# Patch litellm completion to strip prompt caching keys (cache_breakpoint, cache_control)
# which Groq API rejects with 400 Bad Request.
def _clean_message_dicts(messages):
    if isinstance(messages, list):
        for msg in messages:
            if isinstance(msg, dict):
                msg.pop("cache_breakpoint", None)
                msg.pop("cache_control", None)

_orig_completion = litellm.completion
def _patched_completion(*args, **kwargs):
    if "messages" in kwargs:
        _clean_message_dicts(kwargs["messages"])
    return _orig_completion(*args, **kwargs)

litellm.completion = _patched_completion

_orig_acompletion = litellm.acompletion
async def _patched_acompletion(*args, **kwargs):
    if "messages" in kwargs:
        _clean_message_dicts(kwargs["messages"])
    return await _orig_acompletion(*args, **kwargs)

litellm.acompletion = _patched_acompletion


def get_llm():
    return LLM(
        model="groq/openai/gpt-oss-120b",
        api_key=os.getenv("GROQ_API_KEY"),
    )