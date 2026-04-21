import { Vessel } from "@/types/vessel";
import VesselItem from "./VesselItem";

type Props = {
  vessels: Vessel[];
  onSelect: (vessel: Vessel) => void;
  selectedVessel: Vessel | null;
};

export default function VesselList({
  vessels,
  onSelect,
  selectedVessel,
}: Props) {
  return (
    <div className="rounded-2xl bg-slate-800 p-4 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-white">Tracked Vessels</h2>

      <div className="space-y-3">
        {vessels.map((vessel) => (
          <VesselItem
            key={`${vessel.vessel_id}-${vessel.imo_number}`}
            vessel={vessel}
            onSelect={onSelect}
            isSelected={selectedVessel?.vessel_id === vessel.vessel_id}
          />
        ))}
      </div>
    </div>
  );
}