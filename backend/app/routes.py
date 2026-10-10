import json
import sqlite3
import uuid
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app import db
from app.llm import (
    CoachNotConfigured,
    complete,
    follow_up_messages,
    parse_rubric,
    rubric_messages,
)
from app.roles import ROLES, get_role

router = APIRouter()


class CreateSession(BaseModel):
    display_name: str = Field(min_length=1)
    role_id: str
    company: str | None = None


class TurnBody(BaseModel):
    answer: str = Field(min_length=1)


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def session_or_404(connection: sqlite3.Connection, session_id: str) -> sqlite3.Row:
    row = connection.execute(
        "SELECT * FROM sessions WHERE id = ?",
        (session_id,),
    ).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Session not found.")
    return row


def messages_for(connection: sqlite3.Connection, session_id: str) -> list[dict]:
    rows = connection.execute(
        """
        SELECT id, speaker, content, created_at
        FROM messages
        WHERE session_id = ?
        ORDER BY id
        """,
        (session_id,),
    ).fetchall()
    return [dict(row) for row in rows]


def evaluation_for(connection: sqlite3.Connection, session_id: str) -> dict | None:
    row = connection.execute(
        """
        SELECT rubric_json, summary, next_drill, created_at
        FROM evaluations
        WHERE session_id = ?
        """,
        (session_id,),
    ).fetchone()
    if row is None:
        return None
    return {
        "summary": row["summary"],
        "next_drill": row["next_drill"],
        "rubric": json.loads(row["rubric_json"]),
        "created_at": row["created_at"],
    }


def public_session(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "display_name": row["display_name"],
        "role_id": row["role_id"],
        "company": row["company"],
        "status": row["status"],
        "created_at": row["created_at"],
    }


def student_messages(messages: list[dict]) -> list[dict]:
    return [message for message in messages if message["speaker"] == "student"]


@router.get("/roles")
def list_roles() -> dict:
    return {
        "roles": [
            {"id": role.id, "title": role.title, "blurb": role.blurb}
            for role in ROLES.values()
        ]
    }


@router.post("/sessions", status_code=201)
def create_session(body: CreateSession) -> dict:
    role = get_role(body.role_id)
    if role is None:
        raise HTTPException(status_code=400, detail="Unknown role.")
    name = body.display_name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Name is required.")
    company = (body.company or "").strip() or None
    session_id = str(uuid.uuid4())
    created_at = now()
    with db.connect() as connection:
        connection.execute(
            """
            INSERT INTO sessions (id, display_name, role_id, company, status, created_at)
            VALUES (?, ?, ?, ?, 'active', ?)
            """,
            (session_id, name, role.id, company, created_at),
        )
        connection.execute(
            """
            INSERT INTO messages (session_id, speaker, content, created_at)
            VALUES (?, 'interviewer', ?, ?)
            """,
            (session_id, role.opening_question, created_at),
        )
        row = session_or_404(connection, session_id)
        messages = messages_for(connection, session_id)
    return {"session": public_session(row), "messages": messages}


@router.post("/sessions/{session_id}/turns")
async def add_turn(session_id: str, body: TurnBody) -> dict:
    answer = body.answer.strip()
    if not answer:
        raise HTTPException(status_code=400, detail="Answer is required.")

    with db.connect() as connection:
        row = session_or_404(connection, session_id)
        if row["status"] == "finished":
            raise HTTPException(status_code=409, detail="This session is finished.")
        messages = messages_for(connection, session_id)
        answered = student_messages(messages)
        role = get_role(row["role_id"])
        if role is None:
            raise HTTPException(status_code=400, detail="Unknown role.")

        if len(answered) >= 2:
            raise HTTPException(
                status_code=409,
                detail="This session already has its follow-up answer.",
            )

        created_at = now()
        if len(answered) == 1:
            connection.execute(
                """
                INSERT INTO messages (session_id, speaker, content, created_at)
                VALUES (?, 'student', ?, ?)
                """,
                (session_id, answer, created_at),
            )
            added = messages_for(connection, session_id)[-1:]
            fresh = session_or_404(connection, session_id)
            return {"session": public_session(fresh), "messages": added}

        pending = messages + [
            {
                "speaker": "student",
                "content": answer,
                "created_at": created_at,
            }
        ]

    try:
        follow_up = await complete(follow_up_messages(role, pending))
    except CoachNotConfigured as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except (RuntimeError, httpx.HTTPError) as exc:
        raise HTTPException(status_code=502, detail="The coach could not ask a follow-up.") from exc

    with db.connect() as connection:
        row = session_or_404(connection, session_id)
        if row["status"] == "finished":
            raise HTTPException(status_code=409, detail="This session is finished.")
        current = student_messages(messages_for(connection, session_id))
        if len(current) != 0:
            raise HTTPException(
                status_code=409,
                detail="This session already has its follow-up answer.",
            )
        stamped = now()
        connection.execute(
            """
            INSERT INTO messages (session_id, speaker, content, created_at)
            VALUES (?, 'student', ?, ?)
            """,
            (session_id, answer, stamped),
        )
        connection.execute(
            """
            INSERT INTO messages (session_id, speaker, content, created_at)
            VALUES (?, 'interviewer', ?, ?)
            """,
            (session_id, follow_up, stamped),
        )
        added = messages_for(connection, session_id)[-2:]
        fresh = session_or_404(connection, session_id)
    return {"session": public_session(fresh), "messages": added}


@router.post("/sessions/{session_id}/finish")
async def finish_session(session_id: str) -> dict:
    with db.connect() as connection:
        row = session_or_404(connection, session_id)
        if row["status"] == "finished":
            raise HTTPException(status_code=409, detail="This session is finished.")
        messages = messages_for(connection, session_id)
        if len(student_messages(messages)) < 2:
            raise HTTPException(
                status_code=409,
                detail="Finish the two answers before ending the session.",
            )
        role = get_role(row["role_id"])
        if role is None:
            raise HTTPException(status_code=400, detail="Unknown role.")

    try:
        raw = await complete(rubric_messages(role, messages))
        rubric = parse_rubric(raw, role)
    except CoachNotConfigured as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except (RuntimeError, ValueError, json.JSONDecodeError) as exc:
        raise HTTPException(
            status_code=502,
            detail="The coach could not score this session.",
        ) from exc
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail="The coach could not score this session.",
        ) from exc

    created_at = now()
    with db.connect() as connection:
        row = session_or_404(connection, session_id)
        if row["status"] == "finished":
            raise HTTPException(status_code=409, detail="This session is finished.")
        if len(student_messages(messages_for(connection, session_id))) < 2:
            raise HTTPException(
                status_code=409,
                detail="Finish the two answers before ending the session.",
            )
        try:
            connection.execute(
                """
                INSERT INTO evaluations (session_id, rubric_json, summary, next_drill, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    session_id,
                    json.dumps(rubric),
                    rubric["summary"],
                    rubric["next_drill"],
                    created_at,
                ),
            )
        except sqlite3.IntegrityError as exc:
            raise HTTPException(status_code=409, detail="This session is finished.") from exc
        connection.execute(
            "UPDATE sessions SET status = 'finished' WHERE id = ?",
            (session_id,),
        )
        fresh = session_or_404(connection, session_id)
        evaluation = evaluation_for(connection, session_id)
    return {"session": public_session(fresh), "evaluation": evaluation}


@router.get("/sessions/{session_id}")
def get_session(session_id: str) -> dict:
    with db.connect() as connection:
        row = session_or_404(connection, session_id)
        return {
            "session": public_session(row),
            "messages": messages_for(connection, session_id),
            "evaluation": evaluation_for(connection, session_id),
        }


@router.get("/sessions")
def list_sessions(name: str = "") -> dict:
    display_name = name.strip()
    if not display_name:
        raise HTTPException(status_code=400, detail="Name is required.")
    with db.connect() as connection:
        rows = connection.execute(
            """
            SELECT
                sessions.id,
                sessions.display_name,
                sessions.role_id,
                sessions.company,
                sessions.status,
                sessions.created_at,
                evaluations.summary,
                evaluations.next_drill
            FROM sessions
            LEFT JOIN evaluations ON evaluations.session_id = sessions.id
            WHERE sessions.display_name = ?
            ORDER BY sessions.created_at DESC
            """,
            (display_name,),
        ).fetchall()
    return {"sessions": [dict(row) for row in rows]}
