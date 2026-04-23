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
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--highlight)', color: 'var(--text-primary)' }}
      className="rounded-[24px] border px-5 py-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
        </div>

        <div
          style={{ backgroundColor: 'var(--highlight)' }}
          className="rounded-2xl p-3"
        >
          <AppIcon name={icon} alt={title} size={28} />
        </div>
      </div>
    </div>
  );
}