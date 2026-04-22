"use client";

import { useState } from "react";
import { Vessel } from "@/types/vessel";
import { Anomaly } from "@/types/anomaly";
import { AlertItem } from "@/types/alert";
import { useThemeMode } from "@/context/ThemeContext";
import VesselTimeline from "./VesselTimeline";

type Props = {
  vessels: Vessel[];
  anomalies: Anomaly[];
  alerts: AlertItem[];
};

type TabType = "ais" | "satellite" | "timeline";

export default function DataTabsPanel({ vessels, anomalies, alerts }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("ais");
  const { theme } = useThemeMode();
  const isDark = theme === "dark";

  const tabs = [
    { key: "ais" as TabType, label: "AIS Data" },
    { key: "satellite" as TabType, label: "Satellite" },
    { key: "timeline" as TabType, label: "Timeline" },
  ];

  return (
    <div
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--highlight)' }}
      className="rounded-[28px] border p-5 shadow-sm min-h-[400px]"
    >
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{ 
                backgroundColor: active ? 'var(--secondary)' : 'var(--highlight)',
                color: active ? '#ffffff' : 'var(--text-primary)'
              }}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                active ? "shadow-lg shadow-[var(--secondary)]/20" : "opacity-70 hover:opacity-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="max-h-[380px] overflow-y-auto pr-1">
        {activeTab === "ais" && (
          <div className="space-y-4">
            {vessels.slice(0, 5).map((vessel) => (
              <div
                key={`ais-${vessel.vessel_id}`}
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--highlight)' }}
                className="group rounded-2xl border p-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div style={{ color: 'var(--secondary)' }} className="text-xs font-black tracking-tight">{vessel.name}</div>
                  <span style={{ color: 'var(--text-muted)' }} className="text-[9px] font-bold uppercase">
                    {vessel.sog} KN
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span style={{ color: 'var(--text-muted)' }} className="text-[8px] font-black uppercase tracking-tighter opacity-80">IMO Number</span>
                    <span style={{ color: 'var(--text-primary)' }} className="text-xs font-bold mt-0.5">{vessel.imo_number}</span>
                  </div>
                  <div className="flex flex-col">
                    <span style={{ color: 'var(--text-muted)' }} className="text-[8px] font-black uppercase tracking-tighter opacity-80">Vessel Type</span>
                    <span style={{ color: 'var(--text-primary)' }} className="text-xs font-bold mt-0.5">{vessel.type}</span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span style={{ color: 'var(--text-muted)' }} className="text-[8px] font-black uppercase tracking-tighter opacity-80">Last Known Position</span>
                    <span style={{ color: 'var(--text-primary)' }} className="text-xs font-bold mt-0.5">{vessel.latitude.toFixed(4)}, {vessel.longitude.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "satellite" && (
          <div className="grid grid-cols-1 gap-4">
            {anomalies.filter(a => a.anomaly_score > 50).slice(0, 3).map((anomaly, idx) => (
              <div key={`sat-${idx}`} style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--highlight)' }} className="rounded-2xl border p-4">
                <div className="flex items-center gap-3 mb-3">
                   <div style={{ backgroundColor: 'var(--highlight)' }} className="h-10 w-10 rounded-xl flex items-center justify-center text-lg">🛰️</div>
                   <div>
                     <div style={{ color: 'var(--secondary)' }} className="text-[10px] font-black tracking-widest uppercase">SAR VERIFICATION</div>
                     <div style={{ color: 'var(--text-muted)' }} className="text-[9px] font-bold">SCAN_{anomaly.vessel_id} • {new Date(anomaly.timestamp).toLocaleDateString()}</div>
                   </div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--highlight)' }} className="h-40 w-full rounded-2xl flex items-center justify-center border relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://api.planet.com/data/v1/layers/global_monthly_2023_01_mosaic/tiles/14/8381/5471.png')] bg-cover opacity-30"></div>
                   <div className="relative z-10 text-[9px] font-black bg-black/60 text-white px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 uppercase tracking-widest">REAL-TIME PLANET_API SCAN</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "timeline" && (
          <VesselTimeline anomalies={anomalies} alerts={alerts} />
        )}
      </div>
    </div>
  );
}