"use client";

import { useParams } from "next/navigation";
import { ReportScreen } from "@/components/report-screen";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  return <ReportScreen id={params.id} />;
}
