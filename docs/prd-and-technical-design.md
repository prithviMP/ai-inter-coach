# AI Interview Coach — Product Requirements and Technical Design

Date: 10 October 2026
Status: Ready to build the one-hour MVP
Sources: [chatgpt-research.md](chatgpt-research.md), [claude-res.md](claude-res.md), [gemini-res.md](gemini-res.md), [grok-res.md](grok-res.md)

## 1. Problem

Students preparing for placements and job interviews get stuck at the moment they are practising. A senior, a friend, or a course is often unavailable, especially late at night. The tools they already use each cover one slice of the job:

- Coding banks such as LeetCode and HackerRank give problems and an editor, and stop at the final answer.
- Speech coaches such as Yoodli and Huru score pace and filler words, and leave the content of the answer ungraded.
- Human and peer mocks (Interviewing.io, Pramp, Exponent, Prepfully, InterviewBuddy) are realistic and expensive or hard to schedule. Community posts put Exponent near $144 a year and Prepfully near $130–160 a session.
- Generic AI mocks (Final Round AI, ChatGPT, Gemini) ask questions and return encouragement or a bare score. They rarely probe what the student actually said, and they forget the student when the chat ends.

The same notes describe a second gap: non-engineering streams are thin. B.Com, M.Com, BBA, and MBA candidates preparing for finance, marketing, HR, or operations mostly receive generic behavioural questions. Campus tools that do exist in India skew toward B.Tech drives.

Complaints that show up in more than one research note:

- Feedback is generic, or it is a number with no explanation and no quote from the student's own words.
- The interviewer does not follow up on the answer that was just given.
- Practice does not compound. The next session starts from zero.
- A student stitches together three or four tools to cover questions, a workspace, and feedback.
- Good human practice is priced for a market many Indian students cannot pay.

## 2. Problem statement

A student with a target role cannot, at the moment they are practising, get a realistic interviewer, a clear explanation of what was weak in their own answer, and one concrete next drill. The tools they use do not share a memory of that session.

## 3. Solution

Build one interview buddy: a shared coaching engine with a different rubric for each role.

The student picks a stream and a role, answers in a short live session, and is probed on what they just said. Feedback lists each rubric dimension with a short score, a quote from their answer, what is missing, and a stronger version of that beat, plus a single next drill. Later sessions reuse the recorded weakness.

The loop the product owns is: assess, practise, diagnose, coach, retry, measure.

Voice, a code editor, whiteboards, spreadsheets, and group-discussion simulators stay out of the first build. The long-term product can cover engineering, product, marketing, finance, HR, and project management through the same engine. The first version proves the loop on three presets.

Product promise:

> Practise any time, get challenged on what you actually said, see exactly where the answer was weak, and leave with one drill to do next.

## 4. Users and non-goals

### Primary user

A student or fresher preparing for a placement or an early-career interview, often in India, practising alone and on a short timeline.

### First three roles

| Preset | What the session asks | Rubric dimensions |
| --- | --- | --- |
| SDE | Explain an approach out loud. No code runner in the MVP. | Problem framing, approach, complexity, edge cases, explanation |
| Product manager | One product-sense case | Problem definition, user, prioritisation, metrics, trade-offs, structure |
| B.Com / finance analyst | Interpret a tiny set of figures | Calculation, concept, interpretation, structure |

These three styles are different enough to test whether one engine works. Marketing, HR, consulting cases, and project-management scenarios are the same pattern added later.

### Non-goals for the first build

- Accounts, login, and payments.
- Voice, video, and speech metrics.
- An in-browser code editor, whiteboard, spreadsheet, or group discussion.
- Resume or job-description upload.
- A prediction of whether the student will be hired.
- Hinglish, regional languages, and a college dashboard.

## 5. One-hour MVP

Goal: one real user finishes a text mock and can say whether the feedback was useful.

### In scope

- The three presets above. One chat screen and one API for all of them. Only the prompt and the rubric change.
- Setup: display name, role, optional target company.
- Session shape: one opening question, one answer, one follow-up that refers to that answer, a second answer, then feedback.
- Feedback: four to six rubric rows. Each row has a short score, a quote from the answer, what is missing, and one rewritten stronger beat. One next-drill sentence sits under the rows.
- Persistence: the session, the messages, and the evaluation are stored in SQLite. The same display name can reopen the last result.
- Local only. Next.js on port 3000. FastAPI on port 8000. SQLite file on disk.

### Out of this hour

Skill graph, spaced repetition, GD and WAT, Hinglish, company-specific question banks, and code execution.

### Screen flow

1. The student enters a name, picks one of the three roles, and may type a company.
2. The coach asks the opening question for that role.
3. The student types an answer and sends it.
4. The coach asks one follow-up tied to something in that answer.
5. The student answers the follow-up.
6. The student ends the session and reads the rubric.
7. If they return with the same name, they can open the saved result.

### User test (about 10 minutes)

Sit with one person who is actually preparing for one of the three roles.

1. They pick the matching preset and complete both answers without help from you.
2. They read the feedback out loud.
3. Ask only these three questions:
   - Was the follow-up about what you said, or could it have been asked of anyone?
   - Was at least one quote actually in your answer?
   - Would you do the next drill before your interview?

Write down the answers. That is the whole validation for this build.

## 6. Product requirements beyond the hour

These are sequenced. Each phase starts only after the previous one has been used by a real student.

### Phase 1 — the hour above

Role selection, a two-turn text interview, evidence-linked feedback, and a saved session.

### Phase 2 — after the first user says the feedback is specific

- Voice mocks on the same rubric.
- A code editor with execution for the SDE preset.
- A small case or spreadsheet task for PM and finance.
- Retry on the weakest dimension inside the same session.

### Phase 3 — after a student comes back

- A weakness record across sessions.
- The next session opens on the last weak dimension.
- A short daily drill generated from that record.
- Difficulty that moves when the same dimension improves.

### Phase 4 — after repeat use on more than one role

- Questions shaped by a resume or a job description.
- More roles on the same engine: marketing, HR, consulting, project management.
- An AI group-discussion round for MBA and campus placements.
- A placement-cell view of cohort practice, and student pricing in the range the research suggested (about ₹199–499 a month) only after willingness to pay is observed.

### Requirements that apply to every phase

- Every score names the criterion, quotes the student, and says what is missing.
- The product reports proficiency on its own rubric. It does not claim a hiring outcome.
- A new role is a prompt and a rubric, not a new application.

## 7. Technical design

### Architecture

```
Browser (Next.js, port 3000)
        |  JSON over HTTP
        v
FastAPI (port 8000)
        |                |
        v                v
   SQLite file      LLM adapter
 backend/data/     OpenAI-compatible
 coach.db          chat API
```

The browser never calls the model. The API key stays on the server.

### Frontend

- Next.js with the App Router and TypeScript.
- One page. It contains the role picker, the transcript, the answer box, and the feedback panel.
- The page calls the API with `fetch`.
- `NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000`.

States the page must show:

- Choosing a role.
- Waiting for the opening question.
- Waiting for the follow-up.
- Waiting for the rubric.
- Showing the rubric and the next drill.
- Showing a clear message when the coach is not configured (missing API key).

### Backend

- Python and FastAPI.
- CORS allows `http://localhost:3000`.
- Prompts and rubrics live in code, one module per role.
- A thin LLM adapter reads `LLM_API_KEY`, `LLM_BASE_URL`, and `LLM_MODEL` from the environment. Any OpenAI-compatible chat endpoint can be used. The rest of the app depends only on this adapter.

Turn behaviour:

1. Append the student's message.
2. Send the role system prompt and the transcript to the model.
3. Store the interviewer reply and return it.

Finish behaviour:

1. Ask the model for JSON that matches the rubric schema below.
2. Store the evaluation and return it.
3. If `LLM_API_KEY` is missing, return a clear error and do not write a fake score. The UI tells the student the coach is not configured.

### Rubric JSON

```json
{
  "summary": "Two sentences on the session.",
  "next_drill": "One specific exercise.",
  "dimensions": [
    {
      "name": "Trade-offs",
      "score": 2,
      "max_score": 4,
      "quote": "A short span copied from the student's answer.",
      "missing": "What the answer did not cover.",
      "stronger": "One rewritten beat in plain language."
    }
  ]
}
```

Scores are integers from 0 to `max_score`. `quote` must be taken from the stored transcript. The summary must not say the student will or will not be hired.

### Database

SQLite file: `backend/data/coach.db`. Create the file and the tables on startup.

`sessions`

| Column | Type | Notes |
| --- | --- | --- |
| id | text primary key | UUID |
| display_name | text | Used to reopen a result. Not an account. |
| role_id | text | `sde`, `pm`, or `finance` |
| company | text | Optional |
| status | text | `active` or `finished` |
| created_at | text | ISO timestamp |

`messages`

| Column | Type | Notes |
| --- | --- | --- |
| id | integer primary key | Autoincrement |
| session_id | text | Foreign key to sessions |
| speaker | text | `interviewer` or `student` |
| content | text | |
| created_at | text | ISO timestamp |

`evaluations`

| Column | Type | Notes |
| --- | --- | --- |
| id | integer primary key | Autoincrement |
| session_id | text | One evaluation per finished session |
| rubric_json | text | The JSON object above |
| summary | text | Copied out for easy listing |
| next_drill | text | Copied out for easy listing |
| created_at | text | ISO timestamp |

### Endpoints

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| GET | `/health` | | `{ "ok": true }` |
| GET | `/roles` | | The three presets: id, title, blurb |
| POST | `/sessions` | `{ "display_name", "role_id", "company"? }` | Creates the session, stores the opening question, returns the session and messages |
| POST | `/sessions/{id}/turns` | `{ "answer" }` | Stores the answer, stores the follow-up, returns the new messages. Rejected once the session is finished or already has its follow-up. |
| POST | `/sessions/{id}/finish` | | Stores the evaluation, marks the session finished, returns the rubric |
| GET | `/sessions/{id}` | | Session, messages, and evaluation if present |
| GET | `/sessions?name=` | | Sessions for that display name, newest first |

### Role content for the first build

Keep the question fixed per role so two students can be compared, and let only the follow-up vary.

- **sde.** Opening question: walk through how you would find two numbers in an unsorted list that add up to a target, and talk about time and space. Follow-up probes the approach they named (a missed edge case, a complexity claim, or a data structure they mentioned).
- **pm.** Opening question: a food-delivery app's orders are flat while restaurants are joining. What would you look at in the next two weeks? Follow-up challenges one metric or one user group they mentioned.
- **finance.** Opening question: revenue 100, cost of goods 60, operating expenses 30. What is the operating margin, and what does it tell you? Follow-up probes the interpretation they gave, or a number they skipped.

## 8. Step-by-step implementation plan

Build only the hour MVP. Stop after step 5 and run the user test before adding Phase 2.

1. **Scaffold both apps.** Create `backend/` with FastAPI, a `/health` route, CORS, and the SQLite schema created on startup. Create `frontend/` with Next.js, TypeScript, and a single page shell. Confirm both processes start.
2. **Seed the three roles.** Add the opening questions, system prompts, and rubric dimension names from section 7. `GET /roles` returns them.
3. **Implement the session API.** `POST /sessions` writes the row and the opening interviewer message. `POST /sessions/{id}/turns` accepts exactly one student answer before the follow-up and one after it. `POST /sessions/{id}/finish` requests the rubric JSON and stores it. Missing `LLM_API_KEY` returns an error and leaves the session unfinished.
4. **Build the page.** Wire the picker, the transcript, the answer box, and the feedback panel to those endpoints. Show the saved session when a name is entered that already has one.
5. **Run one scripted session, then the user test.** Complete one session yourself for each preset, check that the quote in the rubric appears in the transcript, then sit with one real user and ask the three questions in section 5.

Suggested split of the hour: step 1 about 10 minutes, step 2 about 15 minutes, step 3 about 15 minutes, step 4 about 15 minutes, step 5 the remaining time plus the 10-minute test.

### Local run shape

- Backend: Python environment, install FastAPI and Uvicorn, run Uvicorn on port 8000. Environment file holds `LLM_API_KEY`, `LLM_BASE_URL`, and `LLM_MODEL`. The environment file stays out of git.
- Frontend: `npm install`, then the Next.js dev server on port 3000.
- Database file: `backend/data/coach.db`, created automatically, also kept out of git.

## 9. Success criteria for the user test

The hour build is successful when all of the following are true:

- A student who has not seen the code finishes the two answers and reaches the rubric.
- The follow-up mentions something specific from their first answer.
- At least one rubric quote is a real span from their transcript.
- They can point at the next drill and say what they would practise.
- The session is still there after a refresh when they enter the same name.

If the follow-up could have been asked of anyone, or the quotes are invented, fix the prompts before adding any new feature.

## 10. Sources

This document condenses four research notes already in this folder. Treat competitor prices and quotes there as directional. Several notes say to validate with 15–20 students before widening the product. This MVP is the first of those conversations, with one student and a working session.

- [chatgpt-research.md](chatgpt-research.md) — coaching loop, three-track MVP, evidence-based rubric, and the warning against a hire-prediction score.
- [claude-res.md](claude-res.md) — competitor map, generic-feedback complaint, and the case for launching on a few personas.
- [gemini-res.md](gemini-res.md) — role workspaces, follow-ups, and the hint ladder. Workspaces wait until Phase 2.
- [grok-res.md](grok-res.md) — the original problem (no mentor at the moment of practice, all streams), Reddit and X pain points, and Indian placement formats. GD and WAT wait until Phase 4.
