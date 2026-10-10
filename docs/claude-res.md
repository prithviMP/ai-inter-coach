Quick note: I'm Claude, not ChatGPT. Let me research the current landscape.I'm drawing on vendor roundups, review sites and a few Indian startup pages, so treat it as directional. Some of these sources are marketing, so validate the gaps with 15-20 student interviews before you commit.

## What exists today

The market splits into a few types:

- **General AI mock interviewers:** Final Round AI is the most visible. It has one of the largest mock interview question libraries, covering behavioral, technical and consulting formats, and bundles resume and application tools. It is also a real-interview copilot that feeds you live answer suggestions, which is a different category from practice. Others in this group are Big Interview, Mockmate and Huru.
- **Technical/coding specialists:** Interviewing.io offers technical mocks with humans, not AI, and Exponent covers PM and tech interview courses with video lessons and peer mocks. Interview Query focuses on data, AI/ML, analytics and technical product roles. Pramp and HackerRank also sit here.
- **Free or general-purpose options:** ChatGPT Advanced Voice Mode and Gemini Live have become free mock interview tools, though neither was designed for that. Google's Interview Warmup is free and aimed at beginners.
- **India campus-placement tools:** HireHelp targets students from NITs, VIT, SRM and Tier-2/3 colleges, with Indian-accent voice practice. InterviewPhodo is built for B.Tech students preparing for TCS, Infosys, Wipro and similar drives, including HR trap questions like bond clauses and CTC negotiation. Amrita has launched an AI mock interview platform for MBA admission interviews.

## Pain points in existing tools

- **Feedback is generic.** On G2, one Final Round AI reviewer listed generic feedback as a dislike, and a Trustpilot reviewer said the generated responses are generic content. An early-stage competitor's founder says most prep tools ask generic questions or give very little actionable feedback.
- **Feature bloat.** Many "AI interview tools" are resume builders or job application bots with a mock interview feature bolted on.
- **Free tiers are shrinking.** One review says the free tier on interview-prep tools quietly collapsed over the last twelve months. The same review lists Big Interview at $39/month or $299 lifetime. That is steep for Indian students.
- **Practice doesn't compound.** Practice without feedback tends to reinforce whatever habits you already have. The same source suggests keeping a manual log of your biggest weakness after each session. That is a job the product should do for the student.
- **Fragmented tooling.** A student currently needs one tool for coding, another for PM courses, another for behavioral, and another for speech delivery.

## Gaps you can own

These are my inferences from the above, not claims from the sources.

1. **Non-tech personas are underserved.** The deep products I found are built for engineers, data roles, PMs, or B.Tech placement drives. B.Com, M.Com, BBA, marketing and finance candidates mostly get generic behavioral Q&A. Role-specific content for them would be a real differentiator:
   - Finance and accounting: technical questions and Excel tests.
   - Marketing: campaign critiques and case rounds.
   - Project management: scenario and stakeholder questions.

2. **One workspace for every round type.** Voice interview, code editor, HLD/LLD whiteboard and case-study canvas in a single session, with one memory of the student. Today these are separate products.

3. **A "mentor at 2 AM" mode.** Existing tools mostly assess and score you. Few appear to teach when you're stuck. A Socratic hint ladder (nudge, then hint, then worked solution, then follow-up drill) directly addresses your "no mentor available" problem.

4. **Longitudinal coaching.** Cross-session memory, a skill graph, spaced repetition of weak areas, and a visible readiness score. InterviewPhodo mentions cross-session memory where questions never repeat and difficulty scales, but it is narrow in audience.

5. **Feedback anchored to real rubrics.** Score against explicit criteria (STAR structure, depth, trade-off reasoning) and show evidence from the student's own answer, instead of vague encouragement.

6. **India-first accessibility.** Pricing a student can afford, a generous free tier, Hinglish and regional-language support, and accent-tolerant speech recognition. The India tools I found are mostly aimed at B.Tech campus drives, not the wider set of streams.

7. **AI-aware interview formats.** 23% of companies already run interviews with AI, and interviewers in 2026 often expect candidates to work with AI assistants like GitHub Copilot. Practising both formats is an emerging need.

## Caution

- The space is crowded, and "AI mock interviews for everyone" is not a defensible pitch on its own.
- Covering every persona at launch will give you shallow content everywhere, which is exactly the generic-feedback complaint above. A stronger plan is to launch with 2-3 personas, for example software engineering, PM, and one commerce/MBA track. Then pair the unified workspace with the tutoring-plus-memory loop (gaps 2-4) as the core wedge.
- Content quality and evaluation accuracy are the hard parts. Without expert-reviewed rubrics per role, the feedback will be as generic as everyone else's.

I can turn this into an MVP scope with personas, core flows and a build plan if you'd like. Which personas would you pick first?