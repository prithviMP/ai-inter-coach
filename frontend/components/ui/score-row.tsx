export function ScoreRow({
  index,
  name,
  score,
  maxScore,
  quote,
  missing,
  stronger,
}: {
  index: number;
  name: string;
  score: number;
  maxScore: number;
  quote: string;
  missing: string;
  stronger: string;
}) {
  const width = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
  const weak = score <= maxScore / 2;
  return (
    <article className="flex flex-col border-2 border-ink bg-paper shadow-[4px_4px_0_0_#1a1a1a]">
      <header
        className={`flex items-center justify-between gap-3 border-b-2 border-ink p-4 ${weak ? "bg-red/10" : "bg-paper"}`}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Dimension {String(index).padStart(2, "0")}
          </p>
          <h2 className="font-headline text-lg font-bold uppercase">{name}</h2>
        </div>
        <p
          className={`border border-ink px-2 py-1 font-headline text-sm font-bold ${weak ? "bg-red text-paper" : "bg-ink text-paper"}`}
        >
          {score} / {maxScore}
        </p>
      </header>
      <div className="h-3 border-b-2 border-ink bg-paper">
        <div className={`h-full ${weak ? "bg-red" : "bg-ink"}`} style={{ width: `${width}%` }} />
      </div>
      <div className="space-y-3 p-4 text-sm">
        <p>
          <span className="mb-1 block font-headline text-[10px] font-bold uppercase tracking-wider">
            Quote
          </span>
          <span className="block border border-ink bg-paper p-2 italic">“{quote}”</span>
        </p>
        {missing ? (
          <p>
            <span className="mb-1 block font-headline text-[10px] font-bold uppercase tracking-wider">
              Missing
            </span>
            {missing}
          </p>
        ) : null}
        {stronger ? (
          <p>
            <span className="mb-1 block font-headline text-[10px] font-bold uppercase tracking-wider">
              Stronger
            </span>
            {stronger}
          </p>
        ) : null}
      </div>
    </article>
  );
}
