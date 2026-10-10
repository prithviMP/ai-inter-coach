import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldClass =
  "w-full border-2 border-ink bg-paper p-3 font-headline text-lg font-bold text-ink outline-none focus:shadow-[4px_4px_0_0_#0055ff]";

type Shared = {
  label: string;
  hint?: string;
  id: string;
};

type InputProps = Shared &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & { multiline?: false };

type AreaProps = Shared &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & { multiline: true };

export function TextField(props: InputProps | AreaProps) {
  const { label, hint, id } = props;
  return (
    <label className="block space-y-2" htmlFor={id}>
      <span className="font-headline text-xs font-bold uppercase tracking-wider">{label}</span>
      {props.multiline ? <Area {...props} /> : <Field {...props} />}
      {hint ? <span className="block font-mono text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

function Field({
  label: _label,
  hint: _hint,
  multiline: _multiline,
  className,
  ...input
}: InputProps) {
  return <input className={cn(fieldClass, className)} {...input} />;
}

function Area({
  label: _label,
  hint: _hint,
  multiline: _multiline,
  className,
  ...area
}: AreaProps) {
  return (
    <textarea
      className={cn(fieldClass, "min-h-32 font-body text-base font-medium", className)}
      {...area}
    />
  );
}
