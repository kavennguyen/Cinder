import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "ghost" | "quiet";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-ui font-medium " +
  "transition-colors duration-200 focus-ring disabled:opacity-50 " +
  "disabled:cursor-not-allowed whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper hover:bg-ember",
  accent: "bg-ember text-paper hover:bg-ember-deep",
  ghost: "border border-rule-strong text-ink-70 bg-paper hover:border-ink hover:text-ink",
  quiet: "text-ink-55 hover:text-ember",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-5 py-2.5",
};

/** Class string, so client managers can style their own handlers-bound elements. */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra = "",
) {
  const sizing =
    variant === "quiet" ? (size === "sm" ? "text-xs" : "text-sm") : sizes[size];
  return `${base} ${variants[variant]} ${sizing} ${extra}`.trim();
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
