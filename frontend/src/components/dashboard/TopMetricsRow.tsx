"use client";

import { Vessel } from "@/types/vessel";
import TopMetricCard from "./TopMetricCard";

type Props = {
  vessels: Vessel[];
};

export default function TopMetricsRow({ vessels }: Props) {
  const anomalyCount = vessels.filter((v) => v.sog < 1).length;
  const zoneCount = vessels.filter((v) => v.sog < 5).length;
  const alertCount = vessels.filter((v) => v.sog < 1).length;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <TopMetricCard icon="vessel" title="Vessels Monitored" value={vessels.length} />
      <TopMetricCard icon="alert" title="Active Anomalies" value={anomalyCount} />
      <TopMetricCard icon="zone" title="Spill Suspicion Zones" value={zoneCount} />
      <TopMetricCard icon="bell" title="Alerts Dispatched" value={alertCount} />
    </section>
  );
}