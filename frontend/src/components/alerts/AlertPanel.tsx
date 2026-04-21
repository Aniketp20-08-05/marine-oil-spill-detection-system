import { PipelineResult } from "@/types/pipeline";

type Props = {
  results: PipelineResult[];
};

export default function AlertPanel({ results }: Props) {
  const alertResults = results.filter((item) => item.status === "alert_generated");

  return (
    <div className="rounded-2xl bg-slate-800 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Active Alerts</h2>
        <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
          {alertResults.length}
        </span>
      </div>

      {alertResults.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-slate-300">
          No active high-risk alerts.
        </div>
      ) : (
        <div className="space-y-3">
          {alertResults.map((item) => (
            <div
              key={`${item.vessel.vessel_id}-${item.alert?.alert_id ?? item.vessel.imo_number}`}
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{item.vessel.name}</div>
                  <div className="text-sm text-slate-300">
                    IMO {item.vessel.imo_number} • {item.vessel.type}
                  </div>
                </div>

                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                  HIGH RISK
                </span>
              </div>

              <div className="mt-3 space-y-1 text-sm text-slate-300">
                <div>Risk Score: {item.risk?.risk_score ?? "N/A"}</div>
                <div>Anomaly Score: {item.anomaly.anomaly_score}</div>
                <div>Reason: {item.anomaly.reason}</div>
                <div>Alert: {item.alert?.message ?? "Generated"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}