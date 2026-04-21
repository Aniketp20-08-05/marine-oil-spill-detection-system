export type PipelineAnomaly = {
  anomaly_detected: boolean;
  anomaly_score: number;
  reason: string;
};

export type PipelineRisk = {
  risk_score: number;
  risk_level: string;
};

export type PipelineAlert = {
  alert_id?: number;
  status: string;
  message: string;
};

export type PipelineResult = {
  vessel: {
    vessel_id: number;
    name: string;
    imo_number: string;
    type: string;
    latitude: number;
    longitude: number;
    sog: number;
    cog: number;
    heading: number;
    destination: string;
  };
  status: string;
  anomaly: PipelineAnomaly;
  satellite?: {
    status: string;
    latitude: number;
    longitude: number;
    source: string;
    priority: string;
    image_reference: string;
  };
  spill?: {
    spill_detected: boolean;
    confidence_score: number;
    message: string;
    image_reference: string;
  };
  risk?: PipelineRisk;
  alert?: PipelineAlert;
};

export type PipelineResponse = {
  message: string;
  total_vessels_processed: number;
  results: PipelineResult[];
};