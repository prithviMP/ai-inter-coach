import Link from "next/link";

export function AppHeader({ meta }: { meta?: string }) {
  return (
    <header className="border-b-2 border-ink bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-headline text-lg font-bold uppercase tracking-wider">
            Beat / Coach
          </Link>
          {meta ? (
            <span className="hidden border border-ink px-2 py-1 font-headline text-xs font-bold uppercase sm:inline">
              {meta}
            </span>
          ) : null}
        </div>
        <nav className="flex items-center gap-4 font-headline text-xs font-bold uppercase">
          <Link href="/">New session</Link>
          <Link href="/ledger">Ledger</Link>
        </nav>
      </div>
    </header>
  );
}
