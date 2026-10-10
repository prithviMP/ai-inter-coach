export type Role = {
  id: string;
  title: string;
  blurb: string;
};

export type Session = {
  id: string;
  display_name: string;
  role_id: string;
  company: string | null;
  status: "active" | "finished";
  created_at: string;
};

export type ChatMessage = {
  id: number;
  speaker: "interviewer" | "student";
  content: string;
  created_at: string;
};

export type Dimension = {
  name: string;
  score: number;
  max_score: number;
  quote: string;
  missing: string;
  stronger: string;
};

export type Rubric = {
  summary: string;
  next_drill: string;
  dimensions: Dimension[];
};

export type Evaluation = {
  summary: string;
  next_drill: string;
  rubric: Rubric;
  created_at: string;
};

export type SessionDetail = {
  session: Session;
  messages: ChatMessage[];
  evaluation: Evaluation | null;
};

export type SessionListItem = Session & {
  summary: string | null;
  next_drill: string | null;
};
