import { apiGet } from "./api";
import { AlertItem } from "@/types/alert";

export async function fetchAlerts(): Promise<AlertItem[]> {
  return apiGet<AlertItem[]>("/alerts/");
}