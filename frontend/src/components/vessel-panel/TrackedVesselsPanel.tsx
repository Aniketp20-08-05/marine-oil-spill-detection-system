"use client";

import { Vessel } from "@/types/vessel";
import { useThemeMode } from "@/context/ThemeContext";

type Props = {
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  onSelect: (vessel: Vessel) => void;
};

export default function TrackedVesselsPanel({
  vessels,
  selectedVessel,
  onSelect,
}: Props) {
  const { theme } = useThemeMode();
  const isDark = theme === "dark";

  const getStatus = (sog: number) => {
    if (sog < 1) return { label: "ALERT", cls: "bg-red-600 text-white" };
    if (sog < 5) return { label: "MONITOR", cls: "bg-amber-500 text-black" };
    return { label: "NORMAL", cls: "bg-green-600 text-white" };
  };

  return (
    <div
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--highlight)' }}
      className="rounded-[28px] border p-5 shadow-sm min-h-[400px]"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 style={{ color: 'var(--text-primary)' }} className="text-lg font-bold uppercase tracking-tight">Tracked Vessels</h2>
        <div style={{ backgroundColor: 'var(--highlight)', color: 'var(--text-secondary)' }} className="rounded-full px-3 py-1 text-[9px] font-black uppercase">
          LIVE {vessels.length}
        </div>
      </div>

      <div className="max-h-[380px] grid grid-cols-2 gap-2 overflow-y-auto pr-1">
        {vessels.map((vessel) => {
          const status = getStatus(vessel.sog);
          const active = selectedVessel?.vessel_id === vessel.vessel_id;

          return (
            <button
              key={`${vessel.vessel_id}-${vessel.imo_number}`}
              type="button"
              onClick={() => onSelect(vessel)}
              style={{ 
                borderColor: active ? 'var(--secondary)' : 'var(--highlight)',
                backgroundColor: active ? 'rgba(0,180,216,0.1)' : 'var(--bg-primary)'
              }}
              className={`relative w-full rounded-[20px] border p-3 text-left transition-all hover:scale-[1.01] overflow-hidden ${
                active ? "ring-2 ring-[var(--secondary)] shadow-lg" : "hover:border-[var(--secondary)]"
              }`}
            >
              <div className={`absolute top-0 right-0 rounded-bl-lg px-2 py-0.5 text-[8px] font-black uppercase shadow-sm ${status.cls}`}>
                {status.label}
              </div>

              <div className="flex flex-col h-full justify-between">
                <div>
                  <div style={{ color: active ? 'var(--secondary)' : 'var(--text-primary)' }} className="text-xs font-bold truncate pr-8 tracking-tight">
                    {vessel.name}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }} className="text-[9px] font-semibold uppercase mt-0.5 truncate tracking-wider">
                    IMO {vessel.imo_number} • {vessel.type}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                      <span style={{ color: 'var(--text-muted)' }} className="text-[8px] font-black uppercase leading-none opacity-80">Speed</span>
                      <span style={{ color: 'var(--text-primary)' }} className="text-[10px] font-black mt-1">{vessel.sog} KN</span>
                  </div>
                  <div className="flex flex-col">
                      <span style={{ color: 'var(--text-muted)' }} className="text-[8px] font-black uppercase leading-none opacity-80">Dest</span>
                      <span style={{ color: 'var(--text-primary)' }} className="text-[10px] font-black mt-1 truncate">{vessel.destination === 'Unknown' ? 'N/A' : vessel.destination}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}