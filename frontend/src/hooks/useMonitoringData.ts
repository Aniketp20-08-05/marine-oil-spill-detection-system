"use client";

import { useEffect, useState } from "react";
import { Vessel } from "@/types/vessel";
import { Anomaly } from "@/types/anomaly";
import { AlertItem } from "@/types/alert";
import { RiskZone } from "@/types/riskZone";

const BASE_URL = "http://localhost:8000";

export function useMonitoringData() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [anomalyCount, setAnomalyCount] = useState<number>(0);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchJson = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  };

  const runPipeline = async () => {
    try {
      await fetch(`${BASE_URL}/pipeline/run`);
    } catch (err) {
      console.error("Pipeline error:", err);
    }
  };

  const loadAllData = async () => {
    try {
      const [vesselsData, anomaliesData, anomalyCountData, alertsData, riskZonesData] =
        await Promise.all([
          fetchJson<Vessel[]>(`${BASE_URL}/vessels/`),
          fetchJson<Anomaly[]>(`${BASE_URL}/anomalies/?limit=50`),
          fetchJson<{ count: number }>(`${BASE_URL}/anomalies/count`),
          fetchJson<AlertItem[]>(`${BASE_URL}/alerts/`),
          fetchJson<RiskZone[]>(`${BASE_URL}/risk-zones/?limit=20`),
        ]);

      setVessels(vesselsData);
      setAnomalies(anomaliesData);
      setAnomalyCount(anomalyCountData.count);
      setAlerts(alertsData);
      setRiskZones(riskZonesData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      console.error("Monitoring data error:", err);
      setError(err.message || "Failed to load monitoring data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();

    let timeoutId: NodeJS.Timeout;

    const loop = async () => {
      await runPipeline();
      await loadAllData();
      timeoutId = setTimeout(loop, 10000); // 10 seconds between runs
    };

    loop();

    return () => clearTimeout(timeoutId);
  }, []);

  return {
    vessels,
    anomalies,
    anomalyCount,
    alerts,
    riskZones,
    loading,
    error,
    lastUpdated,
    refresh: loadAllData,
  };
}