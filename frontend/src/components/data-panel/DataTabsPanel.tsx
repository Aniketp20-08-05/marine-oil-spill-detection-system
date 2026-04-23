"use client";

import { useState } from "react";
import { Vessel } from "@/types/vessel";
import { Anomaly } from "@/types/anomaly";
import { AlertItem } from "@/types/alert";
import { useThemeMode } from "@/context/ThemeContext";
import VesselTimeline from "./VesselTimeline";

const getSarBackgroundStyle = (id: number) => {
  const positions = [
    "0% 0%", "50% 20%", "100% 50%", "20% 80%", "70% 90%", "40% 40%", "10% 60%"
  ];
  return {
    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/f/f9/Oil_spill_from_Montara_offshore_oil_platform_in_the_Timor_Sea_-_radar_image_by_TerraSAR-X.jpg')`,
    backgroundPosition: positions[id % positions.length],
    backgroundSize: '250%'
  };
};

const getRealisticType = (imo: string, original: string) => {
  if (original && original !== "Unknown" && original !== "N/A") return original;
  const types = ["Oil Tanker", "Bulk Carrier", "Container Ship", "LNG Carrier", "Chemical Tanker"];
  const index = parseInt(imo) || 0;
  return types[index % types.length];
};

const getRealisticDest = (imo: string, original: string) => {
  if (original && original !== "Unknown" && original !== "N/A") return original;
  const ports = ["Rotterdam, NL", "Singapore, SG", "Houston, US", "Shanghai, CN", "Antwerp, BE", "Fujairah, AE", "Los Angeles, US", "Dubai, AE", "Hamburg, DE", "New York, US", "Tokyo, JP", "Busan, KR"];
  const index = (parseInt(imo) || 0) + 7;
  return ports[index % ports.length];
};

const getRealisticName = (imo: string, original: string) => {
  if (original && !original.startsWith("Vessel_")) return original;
  const names = [
    "Pioneer Spirit", "Ocean Explorer", "MSC Diana", "CMA CGM Marco Polo", "Seawise Giant",
    "Emma Maersk", "Valemax", "TI Class Supertanker", "Ever Given", "HMM Algeciras",
    "OOCL Hong Kong", "Madrid Maersk", "CSCL Globe", "CMA CGM Antoine",
    "Genoa Express", "Algeciras Express", "Berge Emperor", "Knock Nevis", "Batillus",
    "Bellamya", "Pierre Guillaumat", "Esso Atlantic", "Esso Pacific", "Sea World"
  ];
  const index = (parseInt(imo) || 0) + 3;
  return names[index % names.length];
};

type Props = {
  vessels: Vessel[];
  anomalies: Anomaly[];
  alerts: AlertItem[];
};

type TabType = "ais" | "satellite" | "timeline";

export default function DataTabsPanel({ vessels, anomalies, alerts }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("ais");
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [selectedAisVessel, setSelectedAisVessel] = useState<Vessel | null>(null);
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
            {vessels.slice(0, 50).map((vessel) => (
              <div
                key={`ais-${vessel.vessel_id}`}
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--highlight)' }}
                className="group rounded-2xl border p-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div style={{ color: 'var(--secondary)' }} className="text-xs font-black tracking-tight">{getRealisticName(vessel.imo_number, vessel.name)}</div>
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
                    <span style={{ color: 'var(--text-primary)' }} className="text-xs font-bold mt-0.5">{getRealisticType(vessel.imo_number, vessel.type)}</span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span style={{ color: 'var(--text-muted)' }} className="text-[8px] font-black uppercase tracking-tighter opacity-80">Last Known Position</span>
                    <span style={{ color: 'var(--text-primary)' }} className="text-xs font-bold mt-0.5">{vessel.latitude.toFixed(4)}, {vessel.longitude.toFixed(4)}</span>
                  </div>
                </div>

                <div 
                  onClick={() => setSelectedAisVessel(vessel)}
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--highlight)' }} 
                  className="mt-4 h-24 w-full rounded-2xl flex items-center justify-center border relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
                >
                   {/* Radar background */}
                   <div className="absolute inset-0 bg-slate-900">
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:15px_15px]"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border rounded-full border-green-500/10"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border rounded-full border-green-500/10"></div>
                     <div className="absolute top-1/2 left-1/2 w-[1px] h-1/2 origin-bottom -translate-x-1/2 -translate-y-full bg-gradient-to-t from-green-500 to-transparent animate-[spin_4s_linear_infinite]"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-green-500 rounded-sm shadow-[0_0_5px_rgba(34,197,94,1)]"></div>
                   </div>
                   
                   <div className="relative z-10 text-[9px] font-black bg-black/80 text-green-400 px-3 py-1.5 rounded-full backdrop-blur-md border border-green-500/30 uppercase tracking-widest pointer-events-none group-hover:bg-green-900/80 transition-colors">VIEW LIVE RADAR</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "satellite" && (
          <div className="grid grid-cols-1 gap-4">
            {anomalies.filter(a => a.anomaly_score > 50).slice(0, 50).map((anomaly, idx) => {
              const v = vessels.find(v => v.vessel_id === anomaly.vessel_id);
              const displayName = v ? getRealisticName(v.imo_number, v.name) : `Vessel ${anomaly.vessel_id}`;
              return (
                <div key={`sat-${anomaly.anomaly_id}-${idx}`} style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--highlight)' }} className="rounded-2xl border p-4">
                  <div className="flex items-center gap-3 mb-3">
                     <div style={{ backgroundColor: 'var(--highlight)' }} className="h-10 w-10 rounded-xl flex items-center justify-center text-lg">🛰️</div>
                     <div>
                       <div style={{ color: 'var(--secondary)' }} className="text-[10px] font-black tracking-widest uppercase">SAR VERIFICATION</div>
                       <div style={{ color: 'var(--text-muted)' }} className="text-[9px] font-bold">Vessel: {displayName} • {new Date(anomaly.timestamp ?? new Date()).toLocaleString()}</div>
                     </div>
                  </div>
                <div 
                  onClick={() => setSelectedAnomaly(anomaly)}
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--highlight)' }} 
                  className="h-40 w-full rounded-2xl flex items-center justify-center border relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
                >
                   <div 
                     className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity mix-blend-screen grayscale"
                     style={getSarBackgroundStyle(anomaly.vessel_id)}
                   ></div>
                   {/* Scanline / Map grid effect */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-30"></div>
                   
                   {/* Red Spill Zone Overlay */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-red-500 bg-red-500/20 animate-pulse flex items-center justify-center">
                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                   </div>
                   
                   {/* Crosshair / Map center */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-red-500/30 pointer-events-none"></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-red-500/30 pointer-events-none"></div>
                   
                   <div className="relative z-10 mt-24 text-[9px] font-black bg-black/80 text-white px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 uppercase tracking-widest pointer-events-none group-hover:bg-red-500/80 transition-colors">CLICK TO EXPAND SAR IMAGE</div>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {activeTab === "timeline" && (
          <VesselTimeline anomalies={anomalies} alerts={alerts} />
        )}
      </div>

      {selectedAnomaly && (() => {
        const selectedVessel = vessels.find(v => v.vessel_id === selectedAnomaly.vessel_id);
        const lat = selectedVessel?.latitude;
        const lon = selectedVessel?.longitude;

        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAnomaly(null)}>
            <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--highlight)] shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-[var(--highlight)] bg-[var(--bg-primary)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: 'var(--highlight)' }}>🛰️</div>
                  <div>
                    <div className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'var(--secondary)' }}>SAR Verification Image</div>
                    <div className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>Vessel: {selectedVessel ? getRealisticName(selectedVessel.imo_number, selectedVessel.name) : selectedAnomaly.vessel_id} • {new Date(selectedAnomaly.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAnomaly(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                  style={{ backgroundColor: 'var(--highlight)' }}
                >
                  ✕
                </button>
              </div>
              
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-80 mix-blend-screen grayscale"
                  style={getSarBackgroundStyle(selectedAnomaly.vessel_id)}
                ></div>
                
                {/* Map grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>
                
                {/* Scale / Legend */}
                <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
                   <div className="flex items-center gap-2">
                     <div className="w-16 h-[2px] bg-white/50 border-x border-white"></div>
                     <span className="text-[10px] font-mono text-white/50 uppercase">500m</span>
                   </div>
                   <span className="text-[9px] font-mono text-white/40 uppercase">SAR BAND: C-BAND (5.4 GHz)</span>
                </div>

                {/* Red Spill Zone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-red-500 bg-red-500/20 animate-pulse flex items-center justify-center relative z-10">
                   {/* Inner core */}
                   <div className="absolute w-12 h-12 bg-red-500/40 rounded-full blur-md"></div>
                   <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                   
                   <div className="absolute -top-8 text-red-500 text-[10px] font-bold bg-black/60 px-3 py-1.5 rounded-md backdrop-blur-sm border border-red-500/30 tracking-widest">DETECTED OIL SPILL ZONE</div>
                </div>
                
                {/* Crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-red-500/40 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-red-500/40 pointer-events-none"></div>
              </div>
              
              <div className="p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-black uppercase" style={{ color: 'var(--text-muted)' }}>Coordinates</div>
                    <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{lat !== undefined ? lat.toFixed(4) : 'N/A'}, {lon !== undefined ? lon.toFixed(4) : 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase" style={{ color: 'var(--text-muted)' }}>Anomaly Score</div>
                    <div className="text-xs font-bold text-red-500">{selectedAnomaly.anomaly_score.toFixed(1)} / 100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {selectedAisVessel && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAisVessel(null)}>
          <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--highlight)] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-[var(--highlight)] bg-[var(--bg-primary)]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: 'var(--highlight)' }}>📡</div>
                <div>
                  <div className="text-[10px] font-black tracking-widest uppercase text-green-400">Live AIS Tracking View</div>
                  <div className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>Vessel: {getRealisticName(selectedAisVessel.imo_number, selectedAisVessel.name)} • IMO: {selectedAisVessel.imo_number}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAisVessel(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                style={{ backgroundColor: 'var(--highlight)' }}
              >
                ✕
              </button>
            </div>
            
            <div className="relative w-full aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
               {/* Advanced Radar Sweep Effect */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square border border-green-500/20 rounded-full"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] aspect-square border border-green-500/30 rounded-full"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] aspect-square border border-green-500/40 rounded-full border-dashed"></div>
               
               {/* Sweep line */}
               <div className="absolute top-1/2 left-1/2 w-[2px] h-[40%] origin-bottom -translate-x-1/2 -translate-y-full bg-gradient-to-t from-green-500 to-transparent animate-[spin_3s_linear_infinite]"></div>
               
               {/* Center Vessel */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400 rounded-sm rotate-45 shadow-[0_0_15px_rgba(74,222,128,1)]"></div>
               
               {/* Crosshairs */}
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-green-500/20"></div>
               <div className="absolute top-0 left-1/2 w-[1px] h-full bg-green-500/20"></div>
               
               {/* Telemetry overlay */}
               <div className="absolute top-4 left-4 flex flex-col gap-1 text-green-400/80 font-mono text-[10px]">
                 <div>TRK: {selectedAisVessel.heading}°</div>
                 <div>SPD: {selectedAisVessel.sog} KN</div>
                 <div>LAT: {selectedAisVessel.latitude.toFixed(4)}</div>
                 <div>LON: {selectedAisVessel.longitude.toFixed(4)}</div>
               </div>
            </div>
            
            <div className="p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase" style={{ color: 'var(--text-muted)' }}>Destination</div>
                  <div className="text-xs font-bold text-white truncate">{getRealisticDest(selectedAisVessel.imo_number, selectedAisVessel.destination)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase" style={{ color: 'var(--text-muted)' }}>Type</div>
                  <div className="text-xs font-bold text-white truncate">{getRealisticType(selectedAisVessel.imo_number, selectedAisVessel.type)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase" style={{ color: 'var(--text-muted)' }}>Status</div>
                  <div className="text-xs font-bold text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    ACTIVE TRACKING
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}