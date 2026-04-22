import { apiGet } from "./api";
import { RiskZone } from "@/types/riskZone";

export async function fetchRiskZones(): Promise<RiskZone[]> {
  return apiGet<RiskZone[]>("/risk-zones/");
}