"use client";

import { useThemeMode } from "@/context/ThemeContext";

type Props = {
  lastUpdated: Date | null;
};

export default function LastUpdated({ lastUpdated }: Props) {
  const { theme } = useThemeMode();
  const isDark = theme === "dark";

  const text = lastUpdated
    ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
    : "Last updated: --";

  return (
    <div
      className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm ${
        isDark
          ? "border-slate-700 bg-[#121d26] text-slate-200"
          : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      {text}
    </div>
  );
}