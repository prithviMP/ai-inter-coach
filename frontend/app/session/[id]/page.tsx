"use client";

import { useParams } from "next/navigation";
import { TranscriptScreen } from "@/components/transcript-screen";

export default function SessionPage() {
  const params = useParams<{ id: string }>();
  return <TranscriptScreen id={params.id} />;
}
