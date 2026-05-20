"use client";

import type { ButtonHTMLAttributes, CSSProperties } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  type = "button",
  className,
  style,
  ...props
}: ButtonProps) {
  const mergedStyle: CSSProperties = {
    background: "var(--buttonBg)",
    ...style,
  };

  return (
    <button
      type={type}
      className={[
        "w-full cursor-pointer rounded-xl px-4 py-3 text-lg font-semibold text-white disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={mergedStyle}
      {...props}
    />
  );
}
