import { apiGet } from "./api";
import { Anomaly } from "@/types/anomaly";

export async function fetchAnomalies(): Promise<Anomaly[]> {
  return apiGet<Anomaly[]>("/anomalies/");
}