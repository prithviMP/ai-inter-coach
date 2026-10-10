import type {
  Evaluation,
  Role,
  Session,
  SessionDetail,
  SessionListItem,
} from "@/lib/types";

const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await response.json().catch(() => ({}))) as {
    detail?: string;
  };
  if (!response.ok) {
    throw new ApiError(
      response.status,
      typeof data.detail === "string" ? data.detail : "Request failed.",
    );
  }
  return data as T;
}

export function getRoles() {
  return request<{ roles: Role[] }>("/roles");
}

export function createSession(body: {
  display_name: string;
  role_id: string;
  company?: string;
}) {
  return request<{ session: Session; messages: SessionDetail["messages"] }>(
    "/sessions",
    { method: "POST", body: JSON.stringify(body) },
  );
}

export function getSession(id: string) {
  return request<SessionDetail>(`/sessions/${id}`);
}

export function sendTurn(id: string, answer: string) {
  return request<{ session: Session; messages: SessionDetail["messages"] }>(
    `/sessions/${id}/turns`,
    { method: "POST", body: JSON.stringify({ answer }) },
  );
}

export function finishSession(id: string) {
  return request<{ session: Session; evaluation: Evaluation }>(
    `/sessions/${id}/finish`,
    { method: "POST" },
  );
}

export function findSessions(name: string) {
  const query = new URLSearchParams({ name });
  return request<{ sessions: SessionListItem[] }>(`/sessions?${query}`);
}
