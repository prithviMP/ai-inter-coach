"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ScoreRow } from "@/components/ui/score-row";
import { getSession } from "@/lib/api";
import type { SessionDetail } from "@/lib/types";

export function ReportScreen({ id }: { id: string }) {
  const router = useRouter();
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [copyNote, setCopyNote] = useState("");

  useEffect(() => {
    getSession(id)
      .then(setDetail)
      .catch(() => setError("Session not found."));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-6 py-10">
          <Panel>
            <p className="font-headline font-bold uppercase">{error}</p>
          </Panel>
        </main>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="px-6 py-10 font-headline uppercase">Loading report</main>
      </div>
    );
  }

  const evaluation = detail.evaluation;
  if (!evaluation) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-6 py-10">
          <Panel className="space-y-4">
            <p className="font-headline text-xl font-bold uppercase">This session has no rubric yet.</p>
            <Link href={`/session/${id}`} className="font-headline text-sm font-bold uppercase underline">
              Back to the transcript
            </Link>
          </Panel>
        </main>
      </div>
    );
  }

  const dimensions = evaluation.rubric.dimensions;
  const total = dimensions.reduce((sum, row) => sum + row.score, 0);
  const max = dimensions.reduce((sum, row) => sum + row.max_score, 0);

  async function copyDrill() {
    try {
      await navigator.clipboard.writeText(evaluation?.next_drill ?? "");
      setCopied(true);
      setCopyNote("");
    } catch {
      setCopied(false);
      setCopyNote("Copy needs the page in focus. Select the drill text and copy it.");
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader meta={detail.session.display_name} />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-headline text-xs font-bold uppercase tracking-widest">Drill report</p>
            <h1 className="font-headline text-4xl font-bold uppercase leading-none">
              {detail.session.role_id} evaluation
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted">{evaluation.summary}</p>
          </div>
          <Panel offset="yellow" className="px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest">Composite</p>
            <p className="font-headline text-3xl font-bold">
              {total}
              <span className="text-lg">/{max}</span>
            </p>
          </Panel>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {dimensions.map((row, index) => (
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
        <Panel tone="yellow">
          <p className="font-headline text-xs font-bold uppercase">Next drill</p>
          <p className="mt-2 font-headline text-2xl font-bold">{evaluation.next_drill}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="ghost" onClick={copyDrill}>
              {copied ? "Copied" : "Copy drill"}
            </Button>
            {copyNote ? <p className="w-full font-headline text-sm font-bold">{copyNote}</p> : null}
            <Button
              variant="yellow"
              onClick={() =>
                router.push(`/ledger?name=${encodeURIComponent(detail.session.display_name)}`)
              }
            >
              Open ledger
            </Button>
          </div>
        </Panel>
      </main>
    </div>
  );
}
