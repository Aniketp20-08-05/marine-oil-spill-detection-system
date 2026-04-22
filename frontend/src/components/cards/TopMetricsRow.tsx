"use client";

import TopMetricCard from "./TopMetricCard";
import { Vessel } from "@/types/vessel";
import { Anomaly } from "@/types/anomaly";
import { AlertItem } from "@/types/alert";
import { RiskZone } from "@/types/riskZone";

type Props = {
  vessels: Vessel[];
  anomalies: Anomaly[];
  alerts: AlertItem[];
  riskZones: RiskZone[];
};

export default function TopMetricsRow({
  vessels,
  anomalies,
  alerts,
  riskZones,
}: Props) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <TopMetricCard
        icon="vessel"
        title="Vessels Monitored"
        value={vessels.length}
      />
      <TopMetricCard
        icon="alert"
        title="Active Anomalies"
        value={anomalies.length}
      />
      <TopMetricCard
        icon="zone"
        title="Spill Suspicion Zones"
        value={riskZones.length}
      />
      <TopMetricCard
        icon="bell"
        title="Alerts Dispatched"
        value={alerts.length}
      />
    </section>
  );
}