"use client";

import { Button } from "@/components/ui/button";

export type RoleOption = {
  id: string;
  code: string;
  label: string;
};

export function RoleChoice({
  options,
  value,
  onChange,
}: {
  options: RoleOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((option) => (
        <Button
          key={option.id}
          variant={value === option.id ? "selected" : "ghost"}
          className="h-auto flex-col items-start px-3 py-3 text-left"
          onClick={() => onChange(option.id)}
        >
          <span className="font-mono text-[10px] font-semibold">{option.code}</span>
          {option.label}
        </Button>
      ))}
    </div>
  );
}
