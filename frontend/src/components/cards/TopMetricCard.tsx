"use client";

import AppIcon from "@/components/common/AppIcon";
import { useThemeMode } from "@/context/ThemeContext";

type Props = {
  icon: string;
  title: string;
  value: string | number;
};

export default function TopMetricCard({ icon, title, value }: Props) {
  const { theme } = useThemeMode();
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-[24px] border px-5 py-4 shadow-sm ${
        isDark
          ? "border-slate-700 bg-[#121d26] text-white"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-500"}`}>
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
        </div>

        <div
          className={`rounded-2xl p-3 ${
            isDark ? "bg-slate-800" : "bg-slate-100"
          }`}
        >
          <AppIcon name={icon} alt={title} size={28} />
        </div>
      </div>
    </div>
  );
}