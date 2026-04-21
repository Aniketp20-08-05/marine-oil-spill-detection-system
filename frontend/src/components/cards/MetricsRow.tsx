import { Vessel } from "@/types/vessel";
import MetricCard from "./MetricCard";

type Props = {
  vessels: Vessel[];
};

export default function MetricsRow({ vessels }: Props) {
  const alertCount = vessels.filter((v) => v.sog < 1).length;
  const monitorCount = vessels.filter((v) => v.sog >= 1 && v.sog < 2).length;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Vessels Monitored"
        value={vessels.length}
        subtitle="AIS coverage active"
      />
      <MetricCard
        title="Alert Vessels"
        value={alertCount}
        subtitle="Very low speed detected"
      />
      <MetricCard
        title="Monitor Vessels"
        value={monitorCount}
        subtitle="Need closer observation"
      />
      <MetricCard
        title="Map Status"
        value="Online"
        subtitle="Frontend connected to backend"
      />
    </section>
  );
}