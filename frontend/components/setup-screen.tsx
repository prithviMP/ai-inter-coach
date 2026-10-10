"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { RoleChoice } from "@/components/ui/role-choice";
import { TextField } from "@/components/ui/text-field";
import { ApiError, createSession, getRoles } from "@/lib/api";
import type { Role } from "@/lib/types";

const codes: Record<string, string> = {
  sde: "01/A",
  pm: "01/B",
  finance: "01/C",
};

const labels: Record<string, string> = {
  sde: "SDE",
  pm: "Product",
  finance: "Finance",
};

export function SetupScreen() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("Meera Shah");
  const [company, setCompany] = useState("Horizon Bank");
  const [roleId, setRoleId] = useState("finance");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRoles()
      .then((data) => setRoles(data.roles))
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "The coach is not reachable.");
      });
  }, []);

  const selected = roles.find((role) => role.id === roleId);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const created = await createSession({
        display_name: name.trim(),
        role_id: roleId,
        company: company.trim(),
      });
      router.push(`/session/${created.session.id}`);
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Could not start the session.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader meta="Session setup" />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8">
        <Panel tone="ink" offset="yellow" className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-1 font-headline text-xs font-bold uppercase tracking-widest text-yellow">
              Interview prep rig
            </p>
            <h1 className="font-headline text-4xl font-bold uppercase leading-none md:text-5xl">
              Start drill / session 01
            </h1>
          </div>
          <p className="border-2 border-ink bg-paper px-3 py-2 font-headline text-xs font-bold text-ink">
            11:30 pm · four days out
          </p>
        </Panel>
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <form onSubmit={onSubmit} className="lg:col-span-7">
            <Panel className="space-y-6">
              <TextField
                id="full-name"
                label="01. Candidate identifier"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Candidate name"
                required
              />
              <div className="space-y-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-headline text-xs font-bold uppercase tracking-wider">
                    02. Drill specification track
                  </span>
                  <span className="font-mono text-xs font-bold uppercase text-red">Strict rubric</span>
                </div>
                <RoleChoice
                  value={roleId}
                  onChange={setRoleId}
                  options={(roles.length ? roles : [{ id: "finance", title: "Finance", blurb: "" }]).map(
                    (role) => ({
                      id: role.id,
                      code: codes[role.id] ?? role.id,
                      label: labels[role.id] ?? role.title,
                    }),
                  )}
                />
                {selected ? (
                  <p className="border border-ink bg-yellow/40 px-2 py-2 font-mono text-xs font-semibold">
                    {selected.blurb}
                  </p>
                ) : null}
              </div>
              <TextField
                id="company"
                label="03. Target institution"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                hint="Optional. Used on the session and the ledger."
              />
              {error ? <p className="font-headline text-sm font-bold text-red">{error}</p> : null}
              <Button type="submit" loading={loading} className="w-full">
                Start practice session →
              </Button>
            </Panel>
          </form>
          <Panel tone="yellow" className="lg:col-span-5">
            <p className="mb-3 font-mono text-xs font-bold uppercase">Protocol spec</p>
            <h2 className="mb-3 font-headline text-2xl font-bold uppercase">Targeted drill</h2>
            <p className="font-body text-sm leading-relaxed">
              One opening question, one follow-up on your exact words, then a rubric that quotes you. No second interview in this session.
            </p>
          </Panel>
        </div>
      </main>
    </div>
  );
}
