import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function Card({
  children,
  className = "",
  hoverEffect = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/50 ${
        hoverEffect
          ? "hover:shadow-md hover:border-slate-300 transition-all duration-200"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
