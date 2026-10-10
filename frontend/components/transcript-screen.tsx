"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/ui/message";
import { Panel } from "@/components/ui/panel";
import { TextField } from "@/components/ui/text-field";
import { ApiError, finishSession, getSession, sendTurn } from "@/lib/api";
import type { SessionDetail } from "@/lib/types";

export function TranscriptScreen({ id }: { id: string }) {
  const router = useRouter();
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    getSession(id)
      .then(setDetail)
      .catch((err: unknown) => {
        setMissing(true);
        setError(err instanceof ApiError ? err.message : "Session not found.");
      });
  }, [id]);

  if (missing) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-6 py-10">
          <Panel>
            <p className="font-headline text-xl font-bold uppercase">{error}</p>
          </Panel>
        </main>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="px-6 py-10 font-headline uppercase">Loading session</main>
      </div>
    );
  }

  const studentTurns = detail.messages.filter((message) => message.speaker === "student").length;
  const finished = detail.session.status === "finished";
  const readyToScore = studentTurns >= 2;

  async function onSend(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendTurn(id, answer.trim());
      setAnswer("");
      setDetail(await getSession(id));
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "The turn did not send.");
    } finally {
      setLoading(false);
    }
  }

  async function onFinish() {
    setError("");
    setLoading(true);
    try {
      await finishSession(id);
      router.push(`/session/${id}/report`);
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "The rubric did not generate.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader meta={detail.session.company ?? detail.session.role_id} />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <div>
          <p className="font-headline text-xs font-bold uppercase tracking-widest text-muted">
            {detail.session.display_name} · {detail.session.role_id}
          </p>
          <h1 className="font-headline text-3xl font-bold uppercase md:text-4xl">
            {finished ? "Session finished" : readyToScore ? "Turn 2 of 2" : `Turn ${studentTurns + 1} of 2`}
          </h1>
          <div className="mt-4 h-4 border-2 border-ink">
            <div
              className="h-full bg-ink"
              style={{ width: finished || readyToScore ? "100%" : studentTurns === 0 ? "35%" : "70%" }}
            />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-8">
            {detail.messages.map((message) => (
              <Message key={message.id} speaker={message.speaker} content={message.content} />
            ))}
            {finished ? (
              <Button onClick={() => router.push(`/session/${id}/report`)}>Open rubric →</Button>
            ) : readyToScore ? (
              <Panel className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <p className="font-headline text-sm font-bold uppercase">Both answers are in. Generate the rubric.</p>
                <Button variant="danger" loading={loading} onClick={onFinish}>
                  Complete and generate rubric →
                </Button>
              </Panel>
            ) : (
              <form onSubmit={onSend} className="space-y-3">
                <TextField
                  id="answer"
                  multiline
                  label={studentTurns === 0 ? "Your answer" : "Follow-up answer"}
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  required
                />
                <Button type="submit" loading={loading}>
                  Send answer
                </Button>
              </form>
            )}
            {error ? (
              <p className="border-2 border-ink bg-yellow px-3 py-2 font-headline text-sm font-bold">
                {error}
              </p>
            ) : null}
          </div>
          <Panel className="self-start lg:col-span-4">
            <p className="font-headline text-xs font-bold uppercase">Fail-safe</p>
            <p className="mt-2 font-body text-sm">
              If the coach is not configured, your draft stays in the box and no score is written.
            </p>
          </Panel>
        </div>
      </main>
    </div>
  );
}
