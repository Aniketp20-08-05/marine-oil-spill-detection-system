export type Anomaly = {
  anomaly_id: number;
  vessel_id: number;
  anomaly_score: number;
  reason: string;
  timestamp?: string;
  vessel?: {
    vessel_id: number;
    name: string;
    type: string;
  };
};