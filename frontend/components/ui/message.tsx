import { cn } from "@/lib/cn";

export function Message({
  speaker,
  content,
}: {
  speaker: "interviewer" | "student";
  content: string;
}) {
  const coach = speaker === "interviewer";
  return (
    <article
      className={cn(
        "max-w-3xl border-2 border-ink p-4",
        coach ? "bg-paper shadow-[4px_4px_0_0_#1a1a1a]" : "ml-auto bg-yellow",
      )}
    >
      <p className="mb-2 font-headline text-[11px] font-bold uppercase tracking-widest">
        {coach ? "Coach" : "You"}
      </p>
      <p className="font-body text-sm leading-relaxed">{content}</p>
    </article>
  );
}
