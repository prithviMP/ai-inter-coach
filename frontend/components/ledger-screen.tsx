"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ScoreRow } from "@/components/ui/score-row";
import { TextField } from "@/components/ui/text-field";
import { ApiError, findSessions, getSession } from "@/lib/api";
import type { SessionDetail, SessionListItem } from "@/lib/types";

export function LedgerScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("name") ?? "";
  const [name, setName] = useState(initial);
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [selected, setSelected] = useState<SessionDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function load(target: string) {
    const trimmed = target.trim();
    if (!trimmed) return;
    setError("");
    setLoading(true);
    setCopied(false);
    try {
      const data = await findSessions(trimmed);
      setSessions(data.sessions);
      const first = data.sessions[0];
      if (first) {
        setSelected(await getSession(first.id));
      } else {
        setSelected(null);
        setError("No saved session for that name.");
      }
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Could not open the ledger.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initial) {
      void load(initial);
    }
    // Load once from the query string.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  async function open(id: string) {
    setSelected(await getSession(id));
    setCopied(false);
  }

  async function copyDrill() {
    const drill = selected?.evaluation?.next_drill;
    if (!drill) return;
    try {
      await navigator.clipboard.writeText(drill);
      setCopied(true);
      setError("");
    } catch {
      setCopied(false);
      setError("Copy needs the page in focus. Select the drill text and copy it.");
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader meta="Saved sessions" />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8">
        <Panel className="space-y-4">
          <h1 className="font-headline text-4xl font-bold uppercase md:text-5xl">
            {selected?.session.display_name ?? "Performance ledger"}
          </h1>
          <form
            className="flex flex-col gap-3 md:flex-row md:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              void load(name);
            }}
          >
            <div className="flex-1">
              <TextField
                id="ledger-name"
                label="Same name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Meera Shah"
              />
            </div>
            <Button type="submit" loading={loading}>
              Find sessions
            </Button>
          </form>
          {error ? <p className="font-headline text-sm font-bold text-red">{error}</p> : null}
        </Panel>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-4">
            {sessions.map((session) => (
              <Button
                key={session.id}
                variant={selected?.session.id === session.id ? "selected" : "ghost"}
                className="h-auto w-full flex-col items-start"
                onClick={() => void open(session.id)}
              >
                <span className="font-headline text-sm font-bold uppercase">{session.role_id}</span>
                <span className="text-sm normal-case tracking-normal">{session.company ?? "No company"}</span>
                <span className="font-mono text-xs">{session.status}</span>
              </Button>
            ))}
          </div>
          {selected?.evaluation ? (
            <div className="space-y-4 lg:col-span-8">
              <Panel tone="ink" offset="yellow">
                <p className="font-mono text-[11px] uppercase tracking-widest text-yellow">Next drill</p>
                <p className="mt-2 font-headline text-2xl font-bold">{selected.evaluation.next_drill}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="yellow" onClick={() => void copyDrill()}>
                    {copied ? "Copied" : "Copy drill"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/session/${selected.session.id}/report`)}
                  >
                    Open full report
                  </Button>
                </div>
              </Panel>
              <div className="grid gap-4 md:grid-cols-2">
                {selected.evaluation.rubric.dimensions.map((row, index) => (
                  <ScoreRow
                    key={row.name}
                    index={index + 1}
                    name={row.name}
                    score={row.score}
                    maxScore={row.max_score}
                    quote={row.quote}
                    missing={row.missing}
                    stronger={row.stronger}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
