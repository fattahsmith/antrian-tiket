import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  gradient?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  gradient = "from-blue-500 to-indigo-600",
  iconColor = "text-blue-500",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/90 p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-500">
            {title}
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
          {trend && (
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`text-xs font-semibold ${
                  trend.value >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={`rounded-xl bg-gradient-to-br ${gradient} p-3 shadow-lg shadow-blue-500/20 transition-transform duration-200 group-hover:scale-110`}
        >
          <Icon className={`h-6 w-6 ${iconColor.replace("text-", "text-white")}`} />
        </div>
      </div>
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-15 blur-3xl`}
      />
    </motion.div>
  );
}

