import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/90 p-6 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="h-2 w-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-70" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

