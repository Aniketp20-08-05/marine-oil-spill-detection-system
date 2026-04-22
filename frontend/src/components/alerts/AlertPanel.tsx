"use client";

import { AlertItem } from "@/types/alert";
import { useThemeMode } from "@/context/ThemeContext";

type Props = {
  alerts: AlertItem[];
};

export default function AlertPanel({ alerts }: Props) {
  const { theme } = useThemeMode();
  const isDark = theme === "dark";

  const latestAlerts = [...alerts].slice(-5).reverse();

  return (
    <div
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--highlight)' }}
      className="rounded-[28px] border p-5 shadow-sm min-h-[400px]"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold uppercase tracking-tight">Active Alerts</h2>
        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white shadow-lg shadow-red-600/20">
          {alerts.length}
        </span>
      </div>

      {latestAlerts.length === 0 ? (
        <div
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--highlight)' }}
          className="rounded-2xl border p-6 text-center text-xs font-medium opacity-50 italic"
        >
          System scanning for potential risks...
        </div>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {latestAlerts.map((alert) => (
            <div
              key={`${alert.alert_id}-${alert.timestamp ?? "no-time"}`}
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
              className="rounded-[22px] border p-4 transition-all hover:scale-[1.01]"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="rounded-lg bg-red-600 px-2 py-0.5 text-[9px] font-black tracking-tighter text-white">
                  HIGH RISK INCIDENT
                </span>
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                  {new Date(alert.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p style={{ color: 'var(--text-primary)' }} className="text-xs font-medium leading-relaxed">
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}