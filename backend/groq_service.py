import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Preferred model, overridable via GROQ_MODEL in .env.
# llama-3.1-8b-instant etc. are NOT available on this account; these are.
DEFAULT_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")
FALLBACK_MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
]

SYSTEM_PROMPT = """
You are a deterministic, high-precision Senior Code Auditor.

STRICT RULES:
1. Return ONLY a valid JSON object. No markdown, no introductory or concluding text, no wrappers like ```json.
2. Be strict, technical, and accurate.
3. If there are no bugs in a category, return an empty array for that field.

JSON SCHEMA REQUIREMENT:
{
  "summary": "1-2 sentence overall quality verdict",
  "critical_bugs": ["Bug description 1", "Bug description 2"],
  "security_vulnerabilities": ["Vulnerability 1"],
  "performance_issues": ["Issue 1"],
  "refactored_code": "Complete, production-ready corrected code string"
}
"""

REQUIRED_KEYS = (
    "summary",
    "critical_bugs",
    "security_vulnerabilities",
    "performance_issues",
    "refactored_code",
)


class GroqAnalysisError(Exception):
    pass


def _normalize(data):
    if not isinstance(data, dict):
        raise GroqAnalysisError("AI response was not a JSON object.")

    result = {key: data.get(key) for key in REQUIRED_KEYS}

    list_keys = ("critical_bugs", "security_vulnerabilities", "performance_issues")
    for key in list_keys:
        if not isinstance(result[key], list):
            result[key] = []
        result[key] = [str(item) for item in result[key]]

    result["summary"] = str(result.get("summary") or "")
    result["refactored_code"] = str(result.get("refactored_code") or "")
    return result


def analyze_code_with_groq(code_content: str, language: str = "javascript"):
    user_prompt = f"Language: {language}\n\nAnalyze this code strictly:\n```\n{code_content}\n```"

    models = [DEFAULT_MODEL] + [m for m in FALLBACK_MODELS if m != DEFAULT_MODEL]
    errors = []

    for model in models:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.0,
                max_tokens=1000,
                response_format={"type": "json_object"},
            )
            content = response.choices[0].message.content
            return _normalize(json.loads(content))
        except json.JSONDecodeError:
            errors.append(f"{model}: returned invalid JSON")
        except Exception as e:
            errors.append(f"{model}: {type(e).__name__}: {e}")

    raise GroqAnalysisError(" | ".join(errors) or "No models available.")