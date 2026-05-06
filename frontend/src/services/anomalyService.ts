import { apiGet } from "./api";
import { Anomaly } from "@/types/anomaly";
import { DriftPrediction } from "@/types/drift";

export async function fetchAnomalies(): Promise<Anomaly[]> {
  return apiGet<Anomaly[]>("/anomalies/");
}

export async function fetchDriftPrediction(anomalyId: number): Promise<DriftPrediction> {
  return apiGet<DriftPrediction>(`/anomalies/${anomalyId}/drift`);
}