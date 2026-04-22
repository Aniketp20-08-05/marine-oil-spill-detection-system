"use client";

import { useState } from "react";
import Header from "@/components/header/Header";
import StatsBar from "@/components/dashboard/StatsBar";
import LiveHeroMap from "@/components/map/LiveHeroMap";
import TrackedVesselsPanel from "@/components/vessel-panel/TrackedVesselsPanel";
import DataTabsPanel from "@/components/data-panel/DataTabsPanel";
import ResponseActionsPanel from "@/components/response-panel/ResponseActionsPanel";
import AlertPanel from "@/components/alerts/AlertPanel";
import LastUpdated from "@/components/common/LastUpdated";
import { useMonitoringData } from "@/hooks/useMonitoringData";
import { Vessel } from "@/types/vessel";
import { useThemeMode } from "@/context/ThemeContext";

export default function HomePage() {
  const {
    vessels,
    anomalies,
    alerts,
    riskZones,
    loading,
    error,
    lastUpdated,
  } = useMonitoringData();

  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const { theme } = useThemeMode();

  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen p-6 transition ${
        isDark ? "bg-[#08121a]" : "bg-[#f2f6fb]"
      }`}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <Header />

        {!loading && !error && (
          <div className="flex justify-end">
            <LastUpdated lastUpdated={lastUpdated} />
          </div>
        )}

        {loading && (
          <div
            className={`rounded-[24px] border p-5 ${
              isDark
                ? "border-slate-700 bg-[#121d26] text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            Loading monitoring data...
          </div>
        )}

        {error && (
          <div className="rounded-[24px] border border-red-400 bg-red-500/10 p-5 text-red-300">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <StatsBar
              vessels={vessels}
              anomalies={anomalies}
              alerts={alerts}
              riskZones={riskZones}
            />

            <LiveHeroMap vessels={vessels} riskZones={riskZones} selectedVessel={selectedVessel} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <TrackedVesselsPanel
                vessels={vessels}
                selectedVessel={selectedVessel}
                onSelect={setSelectedVessel}
              />
              <DataTabsPanel vessels={vessels} anomalies={anomalies} alerts={alerts} />
              <ResponseActionsPanel alerts={alerts} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}