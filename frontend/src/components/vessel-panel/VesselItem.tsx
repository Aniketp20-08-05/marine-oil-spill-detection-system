import { Vessel } from "@/types/vessel";
import VesselStatusBadge from "./VesselStatusBadge";

type Props = {
  vessel: Vessel;
  onSelect: (vessel: Vessel) => void;
  isSelected: boolean;
};

export default function VesselItem({ vessel, onSelect, isSelected }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(vessel)}
      className={`w-full rounded-xl border p-3 text-left transition ${
        isSelected
          ? "border-cyan-400 bg-slate-700"
          : "border-slate-700 bg-slate-900/40 hover:bg-slate-700/60"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-white">{vessel.name}</div>
          <div className="text-sm text-slate-300">
            IMO {vessel.imo_number} • {vessel.type}
          </div>
          <div className="text-xs text-slate-400">
            Speed: {vessel.sog} | Destination: {vessel.destination}
          </div>
        </div>

        <VesselStatusBadge sog={vessel.sog} />
      </div>
    </button>
  );
}