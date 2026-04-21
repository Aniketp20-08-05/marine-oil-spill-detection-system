export type Vessel = {
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
