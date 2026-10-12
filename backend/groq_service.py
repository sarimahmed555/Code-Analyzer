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

# Explanation-language profiles. The three primary languages first,
# then a mapping for other global languages.
PRIMARY_LANGUAGE_INSTRUCTIONS = {
    "ur-hi": (
        "Write every explanation field (summary, critical_bugs, security_vulnerabilities, "
        "performance_issues) in professional Roman Urdu/Hindi text - clear, simple Urdu/Hindi "
        "written with English (Roman) letters, in a confident senior-engineer tone. Use natural "
        "phrases like 'Yahan SQL injection ka risk hai kyunki...'."
    ),
    "hi": (
        "Write every explanation field (summary, critical_bugs, security_vulnerabilities, "
        "performance_issues) in standard, professional Hindi using Devanagari script (e.g., "
        "'यहाँ SQL injection का जोखिम है क्योंकि...')."
    ),
    "en": "Write every explanation field (summary, critical_bugs, security_vulnerabilities, performance_issues) in professional English.",
}

GLOBAL_LANGUAGE_NAMES = {
    "ar": "Arabic",
    "bn": "Bengali",
    "zh": "Chinese (Simplified)",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "pt": "Portuguese",
    "es": "Spanish",
    "tr": "Turkish",
    "ur": "Urdu",
}

CODE_RULE = (
    "Keep all code, variable names, keywords, and programming terminology strictly in English. "
    "refactored_code must always be valid, production-ready code in the analyzed language's syntax."
)

REQUIRED_KEYS = (
    "summary",
    "critical_bugs",
    "security_vulnerabilities",
    "performance_issues",
    "refactored_code",
)


class GroqAnalysisError(Exception):
    pass


def _build_system_prompt(explain_language: str) -> str:
    explain_language = (explain_language or "en").lower()

    if explain_language in PRIMARY_LANGUAGE_INSTRUCTIONS:
        language_rule = PRIMARY_LANGUAGE_INSTRUCTIONS[explain_language]
    elif explain_language in GLOBAL_LANGUAGE_NAMES:
        name = GLOBAL_LANGUAGE_NAMES[explain_language]
        language_rule = (
            f"Write every explanation field (summary, critical_bugs, security_vulnerabilities, "
            f"performance_issues) in professional {name}."
        )
    else:
        language_rule = PRIMARY_LANGUAGE_INSTRUCTIONS["en"]

    return f"""
You are a deterministic, high-precision Senior Code Auditor.

GLOBAL RULES:
1. Return ONLY a valid JSON object. No markdown, no introductory or concluding text, no wrappers like ```json.
2. Be strict, technical, and accurate.
3. If there are no issues in a category, return an empty array for that field.

RESPONSE LANGUAGE RULE:
{language_rule}
{CODE_RULE}

JSON SCHEMA REQUIREMENT (key names must remain EXACTLY as shown):
{{
  "summary": "overall quality verdict in the specified explanation language",
  "critical_bugs": ["bug description 1", "bug description 2"],
  "security_vulnerabilities": ["vulnerability 1"],
  "performance_issues": ["issue 1"],
  "refactored_code": "Complete, production-ready corrected code string, always valid code"
}}
"""


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


def analyze_code_with_groq(code_content: str, language: str = "javascript", explain_language: str = "en"):
    user_prompt = f"Language: {language}\n\nAnalyze this code strictly:\n```\n{code_content}\n```"
    system_prompt = _build_system_prompt(explain_language)

    models = [DEFAULT_MODEL] + [m for m in FALLBACK_MODELS if m != DEFAULT_MODEL]
    errors = []

    for model in models:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.0,
                max_tokens=4000,
                response_format={"type": "json_object"},
            )
            content = response.choices[0].message.content
            return _normalize(json.loads(content))
        except json.JSONDecodeError:
            errors.append(f"{model}: returned invalid JSON")
        except Exception as e:
            errors.append(f"{model}: {type(e).__name__}: {e}")

    raise GroqAnalysisError(" | ".join(errors) or "No models available.")