"use client";

import { motion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "yellow" | "danger" | "ghost" | "selected";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper shadow-[4px_4px_0_0_#1a1a1a] hover:bg-red",
  yellow: "bg-yellow text-ink shadow-[4px_4px_0_0_#1a1a1a] hover:bg-ink hover:text-paper",
  danger: "bg-red text-paper shadow-[4px_4px_0_0_#1a1a1a] hover:bg-ink",
  ghost: "bg-paper text-ink shadow-[4px_4px_0_0_#1a1a1a] hover:bg-ink hover:text-paper",
  selected: "bg-ink text-paper shadow-[4px_4px_0_0_#ffcc00]",
};

type ButtonProps = {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
};

export function Button({
  variant = "primary",
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  onClick,
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <motion.button
      type={type}
      disabled={inactive}
      aria-busy={loading}
      onClick={onClick}
      whileTap={inactive ? undefined : { x: 3, y: 3 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 border-2 border-ink px-4 py-3 font-headline text-sm font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
    >
      {loading ? "Working" : children}
    </motion.button>
  );
}
