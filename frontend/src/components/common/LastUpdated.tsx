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
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderColor: 'var(--highlight)', 
        color: 'var(--text-primary)' 
      }}
      className="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm"
    >
      {text}
    </div>
  );
}