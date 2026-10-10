import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  paper: "bg-paper text-ink",
  ink: "bg-ink text-paper",
  yellow: "bg-yellow text-ink",
};

const offsets = {
  ink: "shadow-[6px_6px_0_0_#1a1a1a]",
  yellow: "shadow-[6px_6px_0_0_#ffcc00]",
  red: "shadow-[6px_6px_0_0_#e63b2e]",
};

export function Panel({
  children,
  className,
  tone = "paper",
  offset = "ink",
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof tones;
  offset?: keyof typeof offsets;
}) {
  return (
    <section className={cn("border-2 border-ink p-6", tones[tone], offsets[offset], className)}>
      {children}
    </section>
  );
}
