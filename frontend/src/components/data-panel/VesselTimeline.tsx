"use client";

import { useThemeMode } from "@/context/ThemeContext";
import { Anomaly } from "@/types/anomaly";
import { AlertItem } from "@/types/alert";

type TimelineEvent = {
  id: string | number;
  type: 'anomaly' | 'alert' | 'satellite' | 'action';
  title: string;
  description: string;
  timestamp: string;
  vessel_name?: string;
};

type Props = {
  vesselId?: number;
  anomalies: Anomaly[];
  alerts: AlertItem[];
};

export default function VesselTimeline({ anomalies, alerts }: Props) {
  const { theme } = useThemeMode();
  const isDark = theme === "dark";

  const events: TimelineEvent[] = [
    ...anomalies.map(a => ({
      id: `anomaly-${a.event_id}`,
      type: 'anomaly' as const,
      title: "Anomaly Detected",
      description: a.reason,
      timestamp: a.timestamp,
      vessel_name: a.vessel?.name
    })),
    ...alerts.map(a => ({
      id: `alert-${a.alert_id}`,
      type: 'alert' as const,
      title: "Emergency Alert Sent",
      description: a.message,
      timestamp: a.timestamp || new Date().toISOString()
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return "🔍";
      case 'alert': return "🚨";
      case 'satellite': return "🛰️";
      case 'action': return "✅";
      default: return "📌";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'anomaly': return "var(--warning)";
      case 'alert': return "var(--danger)";
      case 'satellite': return "var(--primary)";
      case 'action': return "var(--success)";
      default: return "var(--secondary)";
    }
  };

  if (events.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-xs opacity-50 italic">
        No events recorded for this vessel yet.
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pl-6 before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-slate-700/30">
      {events.map((event) => (
        <div key={event.id} className="relative">
          <div 
            style={{ backgroundColor: getEventColor(event.type) }}
            className={`absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-white ring-4 ring-slate-900/5`}
          ></div>
          
          <div 
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--highlight)' }}
            className="rounded-xl border p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base">{getEventIcon(event.type)}</span>
                <h4 style={{ color: 'var(--text-primary)' }} className="text-sm font-bold">{event.title}</h4>
              </div>
              <span className="whitespace-nowrap text-[10px] font-medium opacity-50">
                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <p className="mt-1 text-xs leading-relaxed opacity-70">
              {event.description}
            </p>
            
            {event.vessel_name && (
              <div className="mt-2 flex items-center gap-1.5">
                <div style={{ backgroundColor: 'var(--accent)' }} className="h-1.5 w-1.5 rounded-full"></div>
                <span style={{ color: 'var(--accent)' }} className="text-[10px] font-bold uppercase">{event.vessel_name}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
