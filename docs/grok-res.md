Hey , so I have a problem statement which I want to build today. So basically, a lot of students who are preparing for their interview, they face a lot of, you know, issues while prepping live. They don't have the mentor they want. They don't have the course they want on the time. Maybe some of the students are learning during the night if they want any senior or a friend is not available. So I want to make their journey a little more engaging. So I am thinking of building an AI interview coach slash buddy who will help them with the preparation. So while they can select a topic and they can start. Maybe we can generate certain MCP questions, maybe code editor coding problem, or maybe DSA or HLD or LLD kind of a problem. And this I don't want to limit to tech. I also want maybe if someone is preparing for a product manager role, or someone is preparing for a project manager role, or someone wants to prepare for a marketing role. So we have to consider all personas, okay? So it's not only targeted to engineering students, it's also targeted to different streams: B.Com, M.Com, MBA, BBA, etc. Okay? So this is the problem statement. What I want you to do is I want you to do some market research about existing tools out there, understand their pain points, okay? What these tools are not solving, and can you quickly give me an understanding that what are the pain points in my product I can solve, which existing product don't solve, okay? I want you to go through Reddit post or Twitter post where people are talking about this. I want you to analyze about the pain points and bring me, and I want you to do it a bit quicker.

Love this idea. I'm starting the research now, digging through Reddit and X for what students say existing interview prep tools get wrong, and I'll come back with a quick pain-point summary.

I'll be back in about 10 minutes with the competitor landscape, the real complaints people post with their sources, and the gaps you could own.

The biggest gap is that no tool covers every stream and role in one place, especially for Indian placements. Existing tools are either for software engineers only (LeetCode, Interviewing.io), aimed at US PM and engineering interviews (Exponent), only coach your speaking (Yoodli), or are just test banks (PrepInsta). B.Com, BBA and MBA students preparing for finance, marketing or HR roles are mostly left out.

What students complain about on Reddit and X:

Expert mock interviews cost too much. Exponent's $144 a year was called "near 12k rupees for indians" (
r/leetcode), and Prepfully sessions run $130–160 each.
Peer mocks are hard to schedule and hit or miss. One student "had one guy who just stared at me for 5 mins" (
r/AIToolsAndTips).
AI mocks feel like "qna with a chatbot." They don't ask follow-ups based on what you actually said.
Speech coaching doesn't fix weak content. A PM candidate said the real problem was "product thinking and structure, not just speaking style" (
r/ProductManagement_IN).
Scores come with no explanation. "74/100 is almost useless if nobody can explain why" (
X post).
Prep for non-tech roles is missing. One student was "rejected due to Excel formulas & business concepts, not coding" (
r/PlacementsPrep).
Tools don't remember you, so students end up juggling 3–4 of them.
What I'd build into the MVP to stand out:

A picker for stream, role and interview round. Each session runs from MCQs to a coding, case or design question, then a voice mock where the AI asks follow-ups on your answers.
Feedback scored against a clear rubric, quoting your own words as evidence and showing a stronger model answer.
One workspace with a code editor, a whiteboard for design questions, and Excel or estimation tasks.
A group discussion simulator where AI candidates debate a topic and you join by voice. Nobody offers this, and it matters a lot for MBA and campus placements.
Memory of each student's weak spots, used to build short daily drills, at a student-friendly price of roughly ₹199–499 a month.
A few caveats: every quote is real, but the Reddit ones come from search previews rather than full threads. Most competitor prices are rough and worth checking; only the Exponent and Prepfully prices came from Reddit posts. Also, the X post about tools forgetting users is from a competitor's marketing account, not a student. I've attached the full report with the competitor table.


interview-coach-research
.md
8.1kB



No file chosen
AI Interview Coach for All Streams: Quick Market Research (Oct 10, 2026)
(a) Competitors
Prices are approximate, from memory or community posts. Check them before using.

Tool	What it does	Price (approx.)
Pramp / Exponent	Peer-to-peer mocks (SWE, PM, behavioral) plus Exponent's courses for PM, SWE and system design	Pramp: free monthly credits. Exponent: about $144/yr ("~12k rupees") or about $17/mo, both per Reddit posts
Interviewing.io	Anonymous mocks with senior FAANG engineers. SWE only	About $100–250 per paid session. Some free peer mocks
LeetCode	DSA problem bank, editor, contests, company tags. No interviewer	Free, or Premium about $35/mo or $159/yr
Final Round AI	AI mock interviews plus a real-time "copilot" that helps during live interviews	About $90+/mo. Reddit calls it "overpriced"
Google Interview Warmup	Free voice practice for a few certificate roles, with keyword insights	Free
Yoodli	Speech coach covering filler words, pace and monologue length	Free tier, Pro about $10–20/mo
Big Interview	Video answer practice plus a curriculum, mostly sold to universities	About $39–79/mo, or bought by the college
InterviewBuddy (India)	Live mock interviews with human experts, HR plus domain	About ₹1–3k per session
Huru	Mobile AI mock interviews with feedback on answers and body language	Freemium, about $10–20/mo
Interviewer.AI	Recruiter-side async video screening. Hiring tool, not prep	B2B
Unstop	Indian competitions, hackathons, case contests and jobs, plus some mentor mocks	Mostly free, paid mentor sessions
PrepInsta	Indian placement prep: aptitude, company test papers (TCS, Infosys and others), coding	About ₹1–3k/yr Prime
Careerflow	Job-search copilot with unlimited AI mocks across roles	Freemium
Prepfully	Paid 1:1 mocks with people from big companies	About $130–160 per session (Reddit)
ChatGPT / Gemini	Do-it-yourself roleplay mocks and question generation	Free or $20/mo. No structure, editor, rubric or progress tracking
(b) Top pain points (real quotes)
Human or expert mocks cost too much, especially in India.
"Now I see that it charges (144$ per year) which is near 12k rupees for indians" — https://www.reddit.com/r/leetcode/comments/1inzaqv/alternative_to_prampcomexponent_for_praticing/
"$17*12 is too much at the moment." — https://www.reddit.com/r/ProductManagement_IN/comments/1u9z4b2/is_exponent_worth_it_for_pm_interview_prep/
Mocks are hard to schedule, and slots are limited.
"The only downside is matching the time with the person." — https://www.reddit.com/r/AIToolsAndTips/comments/1u2ti3s/read_this_before_paying_for_an_ai_interview_prep/
"one of my sessions got canceled the night before and rescheduling took a few days" (Prepfully) — https://www.reddit.com/r/interviews/comments/1kb1kow/best_ai_tools_for_mock_interviews_with_my_honest/
Peer mock quality is a lottery.
"Some sessions are fantastic, some are a waste of time." / "had one guy who just stared at me for 5 mins" — r/AIToolsAndTips thread above
"Peer mocks are a mixed bag because your peers are also your competition, and they are not trained interviewers." — https://www.reddit.com/r/MBA/comments/1tpace1/wharton_moelis_peer_mock_interview/
AI mocks feel robotic and scripted.
"your mock interviews can feel like you doing qna with a chatbot" — r/AIToolsAndTips thread above
"final round AI - overpriced. real-time AI overlay is gimmicky." — https://www.reddit.com/r/interviews/comments/1syq0in/best_ai_mock_interview_tools_in_2026/
Speech-delivery tools don't fix weak content or structure. This hits PM and MBA candidates hardest.
"my issue is also around product thinking and structure, not just speaking style." — r/ProductManagement_IN thread above
"yoodli - best for filler word + pacing analysis. weak on questions." — r/interviews 2026 thread above
No adaptive follow-up questions. Real interviewers probe your answers.
"Questions are generally asked on your answers." (IIM PI, B.Com student) — https://www.reddit.com/r/CATpreparation/comments/1im7cli/iim_raipur_transcript_mumbai_bcom/
"provide feedbacks based on your actual answers, and drill you based on what you said." — r/interviews 2026 thread above
Scores come without explanation, rubric or answer structure.
"A mock interview score like 74/100 is almost useless if nobody can explain why it is 74." — https://x.com/TheLetsDecodeAI/status/2098336185571799426
"most tools on this list optimize for fluency ... or question variety, but not answer structure." — r/interviews 2026 thread above
Generic prep doesn't match the real format or domain (school, company, case style, industry).
"practice each format saperately rather than doing generic mocks" — https://www.reddit.com/r/PlanYourFuture/comments/1w1sihe/i_could_use_some_support_with_my_interview/
"If ... are in marketing, use AI interviewer built for marketing industry interviews." — r/interviews 2026 thread above
Non-tech and commerce students are underserved. They fail on business or Excel questions, not code.
"Business Analyst role. Got rejected due to Excel formulas & business concepts, not coding." — https://www.reddit.com/r/PlacementsPrep/comments/1q59uvx/my_campus_placement_experience_10_interviews_1/
"the common perception is that campus placements are mostly for engineering and B.Tech students" — https://www.reddit.com/r/CUETards/comments/1vgb5eb/is_campus_placement_possible_after_bcombcom_hons/
Tools don't remember you, and the market is fragmented.
"generic question banks that forget who you are between sessions. $300/hr coaching no new grad can afford." — https://x.com/Qcardai/status/2102054057451905425 (a competitor's marketing post)
"What a mentor/course can help you with would be Mock interviews" (everything else is self-prep with ChatGPT) — https://www.reddit.com/r/CATpreparation/comments/1pmkeyd/how_do_i_start_gdpi_prep/
(c) Gaps no single tool owns
One place for every Indian stream and role. Tools today are either SWE-only (LeetCode, Interviewing.io), PM or SWE from the US (Exponent), speech-only (Yoodli) or test-paper banks (PrepInsta). No tool covers B.Com, M.Com, BBA and MBA (finance, accounting, marketing, HR) alongside SDE and PM.
The full loop in one session: MCQ, then coding in an editor or a case/design question, then a live voice mock with follow-ups, then a rubric. Today students stitch together 3–4 tools.
Indian placement formats: GD, PI, WAT, HR "why MBA" questions, academics viva (elasticity, accounting, tax), aptitude, and company-specific campus rounds.
Pricing for Indian students: unlimited AI practice for about ₹199–499/mo, compared with ₹12k/yr or $100+ per session.
Coaching that remembers you: a memory of weak spots across sessions that adapts the next drill.
(d) MVP differentiators to build now
Stream × role × round picker. For example: "MBA-Finance → Bank PO/Analyst → PI" or "B.Tech → SDE → LLD". It generates MCQs, then a case, coding or design question, then an adaptive voice mock that probes what you actually said.
Transparent rubric feedback. Each dimension gets a score with the evidence quoted from your answer and a rewritten "model answer in your words". Covers structure (STAR, case frameworks, PM flows) as well as delivery.
One workspace with an in-browser editor and whiteboard. DSA with test cases, LLD/HLD diagram prompts, Excel or financial-statement mini-tasks, and estimation questions, all with an interviewer talking you through them.
AI group discussion and WAT simulator. Multiple AI "candidates" debate a current-affairs topic while you join in by voice and get scored on initiation, content and summarizing. Nobody else has this, and it matters a lot for MBA and Indian placements.
Weak-spot memory, plus a JD or résumé mode for later. Persistent skill graph, daily 15-minute drills, India-first pricing with a college or TPO dashboard as the B2B wedge.