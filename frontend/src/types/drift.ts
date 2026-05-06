export interface DriftPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  type: "origin" | "prediction";
  hour?: number;
}

export interface DriftPrediction {
  anomaly_id: number;
  origin: {
    latitude: number;
    longitude: number;
  };
  prediction_path: DriftPoint[];
}
