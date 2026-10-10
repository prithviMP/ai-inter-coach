import { Suspense } from "react";
import { LedgerScreen } from "@/components/ledger-screen";

export default function LedgerPage() {
  return (
    <Suspense fallback={<main className="px-6 py-10 font-headline uppercase">Loading ledger</main>}>
      <LedgerScreen />
    </Suspense>
  );
}
