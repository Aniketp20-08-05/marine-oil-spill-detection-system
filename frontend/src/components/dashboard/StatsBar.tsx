"use client";

import { Vessel } from "@/types/vessel";
import { RiskZone } from "@/types/riskZone";
import { AlertItem } from "@/types/alert";

type Props = {
  vessels: Vessel[];
  anomalyCount: number;
  riskZones: RiskZone[];
  alerts: AlertItem[];
};

export default function StatsBar({ vessels, anomalyCount, riskZones, alerts }: Props) {
  const stats = [
    {
      label: "Vessels Monitored",
      value: vessels.length,
      sub: "AIS Coverage Active",
      icon: "((📡))",
      color: "var(--secondary)"
    },
    {
      label: "Active Anomalies",
      value: anomalyCount,
      sub: "Detected by pipeline",
      icon: "⚠️",
      color: "var(--primary)"
    },
    {
      label: "Potential Risk Zones",
      value: riskZones.length,
      sub: "Aggregated anomalies",
      icon: "🎯",
      color: "var(--accent)"
    },
    {
      label: "Alerts Dispatched",
      value: alerts.length,
      sub: "Local Response",
      icon: "🔔",
      color: "var(--danger)"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div 
          key={i}
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--highlight)' }}
          className="flex items-center justify-between rounded-[24px] border p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-60">{stat.label}</div>
            <div className="my-1 text-2xl font-black">{stat.value}</div>
            <div className="text-[10px] font-medium opacity-50">{stat.sub}</div>
          </div>
          <div 
            style={{ backgroundColor: 'var(--highlight)', color: stat.color }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-inner"
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
