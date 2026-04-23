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

type Region = "Global" | "North America" | "Europe" | "Asia" | "South America" | "Africa" | "Oceania";

const REGION_BOUNDS: Record<Region, { minLat: number; maxLat: number; minLon: number; maxLon: number } | null> = {
  "Global": null,
  "North America": { minLat: 15, maxLat: 75, minLon: -170, maxLon: -50 },
  "South America": { minLat: -60, maxLat: 15, minLon: -90, maxLon: -30 },
  "Europe": { minLat: 35, maxLat: 75, minLon: -10, maxLon: 40 },
  "Africa": { minLat: -40, maxLat: 35, minLon: -20, maxLon: 55 },
  "Asia": { minLat: 5, maxLat: 75, minLon: 40, maxLon: 180 },
  "Oceania": { minLat: -50, maxLat: 5, minLon: 110, maxLon: 180 },
};

export default function HomePage() {
  const {
    vessels,
    anomalies,
    anomalyCount,
    alerts,
    riskZones,
    loading,
    error,
    lastUpdated,
  } = useMonitoringData();

  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region>("Global");
  const { theme } = useThemeMode();

  const isDark = theme === "dark";

  // Filter data based on selected region
  const filteredVessels = vessels.filter(v => {
    const bounds = REGION_BOUNDS[selectedRegion];
    if (!bounds) return true;
    return v.latitude >= bounds.minLat && v.latitude <= bounds.maxLat && 
           v.longitude >= bounds.minLon && v.longitude <= bounds.maxLon;
  });

  const filteredRiskZones = riskZones.filter(rz => {
    const bounds = REGION_BOUNDS[selectedRegion];
    if (!bounds) return true;
    return rz.latitude >= bounds.minLat && rz.latitude <= bounds.maxLat && 
           rz.longitude >= bounds.minLon && rz.longitude <= bounds.maxLon;
  });

  const filteredAnomalies = anomalies.filter(a => {
    const bounds = REGION_BOUNDS[selectedRegion];
    if (!bounds) return true;
    const v = vessels.find(v => v.vessel_id === a.vessel_id);
    if (!v) return true; // Keep anomaly if vessel unknown just in case
    return v.latitude >= bounds.minLat && v.latitude <= bounds.maxLat && 
           v.longitude >= bounds.minLon && v.longitude <= bounds.maxLon;
  });

  const filteredAlerts = alerts.filter(al => {
    const bounds = REGION_BOUNDS[selectedRegion];
    if (!bounds) return true;
    const rz = riskZones.find(z => z.zone_id === al.risk_zone_id);
    if (!rz) return true;
    return rz.latitude >= bounds.minLat && rz.latitude <= bounds.maxLat && 
           rz.longitude >= bounds.minLon && rz.longitude <= bounds.maxLon;
  });

  return (
    <main
      className="min-h-screen p-6 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <Header />

        {!loading && !error && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Filter Region</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region)}
                className="rounded-full px-4 py-2 text-xs font-bold shadow-sm outline-none transition-all focus:ring-2"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  color: 'var(--text-primary)',
                  borderColor: 'var(--highlight)',
                  borderWidth: '1px'
                }}
              >
                {Object.keys(REGION_BOUNDS).map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {selectedRegion !== "Global" && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--highlight)] text-[var(--text-primary)]">
                  {filteredVessels.length} Vessels
                </span>
              )}
            </div>
            <LastUpdated lastUpdated={lastUpdated} />
          </div>
        )}

        {loading && (
          <div
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--highlight)',
              color: 'var(--text-primary)'
            }}
            className="rounded-[24px] border p-5 shadow-sm"
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
              vessels={filteredVessels}
              anomalyCount={filteredAnomalies.length}
              alerts={filteredAlerts}
              riskZones={filteredRiskZones}
            />

            <LiveHeroMap vessels={filteredVessels} riskZones={filteredRiskZones} anomalies={filteredAnomalies} selectedVessel={selectedVessel} selectedRegionBounds={REGION_BOUNDS[selectedRegion]} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <TrackedVesselsPanel
                vessels={filteredVessels}
                selectedVessel={selectedVessel}
                onSelect={setSelectedVessel}
              />
              <DataTabsPanel vessels={filteredVessels} anomalies={filteredAnomalies} alerts={filteredAlerts} />
              <ResponseActionsPanel alerts={filteredAlerts} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}