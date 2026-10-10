import json
import os
from typing import Any

import httpx

from app.roles import MAX_SCORE, Role


class CoachNotConfigured(Exception):
    """Raised when the server has no model key. Callers must not invent a score."""


def _api_key() -> str:
    key = os.environ.get("LLM_API_KEY", "").strip()
    if not key:
        raise CoachNotConfigured("The coach is not configured.")
    return key


def _base_url() -> str:
    return os.environ.get("LLM_BASE_URL", "https://api.openai.com/v1").strip().rstrip("/")


def _model() -> str:
    return os.environ.get("LLM_MODEL", "gpt-4o-mini").strip() or "gpt-4o-mini"


async def complete(messages: list[dict[str, str]]) -> str:
    payload = {
        "model": _model(),
        "messages": messages,
        "temperature": 0.4,
    }
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{_base_url()}/chat/completions",
            headers={"Authorization": f"Bearer {_api_key()}"},
            json=payload,
        )
    if response.status_code >= 400:
        raise RuntimeError("The coach could not complete that turn.")
    data = response.json()
    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError("The coach returned an empty reply.") from exc
    if not isinstance(content, str) or not content.strip():
        raise RuntimeError("The coach returned an empty reply.")
    return content.strip()


def follow_up_messages(role: Role, transcript: list[dict[str, str]]) -> list[dict[str, str]]:
    system = (
        f"You are the interviewer for a {role.title} practice session. "
        "Ask exactly one follow-up question. "
        f"{role.follow_up_hint} "
        "Refer to a specific phrase, number, or claim from the student's latest answer. "
        "Do not score the answer. Do not give a model answer. Reply with the question only."
    )
    chat = [{"role": "system", "content": system}]
    for message in transcript:
        speaker = "assistant" if message["speaker"] == "interviewer" else "user"
        chat.append({"role": speaker, "content": message["content"]})
    return chat


def rubric_messages(role: Role, transcript: list[dict[str, str]]) -> list[dict[str, str]]:
    names = ", ".join(role.dimensions)
    system = (
        "Score this practice interview. Reply with JSON only, no markdown. "
        "Shape: {\"summary\": string, \"next_drill\": string, \"dimensions\": ["
        "{\"name\": string, \"score\": integer, \"max_score\": "
        f"{MAX_SCORE}, \"quote\": string, \"missing\": string, \"stronger\": string}}]}}. "
        f"Use exactly these dimension names, in this order: {names}. "
        f"Each score is an integer from 0 to {MAX_SCORE}. "
        "Each quote must be copied from the student's own words in the transcript. "
        "summary is two sentences on what they demonstrated. "
        "next_drill is one specific exercise. "
        "Do not say whether the student will be hired."
    )
    lines = []
    for message in transcript:
        who = "Interviewer" if message["speaker"] == "interviewer" else "Student"
        lines.append(f"{who}: {message['content']}")
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": "\n\n".join(lines)},
    ]


def parse_rubric(raw: str, role: Role) -> dict[str, Any]:
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("The coach did not return a rubric.")
    payload = json.loads(text[start : end + 1])
    if not isinstance(payload, dict):
        raise ValueError("The coach did not return a rubric.")

    summary = str(payload.get("summary", "")).strip()
    next_drill = str(payload.get("next_drill", "")).strip()
    raw_dimensions = payload.get("dimensions")
    if not summary or not next_drill or not isinstance(raw_dimensions, list):
        raise ValueError("The coach did not return a rubric.")

    by_name: dict[str, dict[str, Any]] = {}
    for item in raw_dimensions:
        if not isinstance(item, dict):
            continue
        name = str(item.get("name", "")).strip()
        if name not in role.dimensions:
            continue
        try:
            score = int(item.get("score", 0))
        except (TypeError, ValueError):
            score = 0
        score = max(0, min(MAX_SCORE, score))
        by_name[name] = {
            "name": name,
            "score": score,
            "max_score": MAX_SCORE,
            "quote": str(item.get("quote", "")).strip(),
            "missing": str(item.get("missing", "")).strip(),
            "stronger": str(item.get("stronger", "")).strip(),
        }

    dimensions = []
    for name in role.dimensions:
        if name not in by_name:
            raise ValueError("The coach left out a rubric row.")
        dimensions.append(by_name[name])

    return {
        "summary": summary,
        "next_drill": next_drill,
        "dimensions": dimensions,
    }
