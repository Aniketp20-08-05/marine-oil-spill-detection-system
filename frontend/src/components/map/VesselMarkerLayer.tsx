"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Vessel } from "@/types/vessel";

type Props = {
  vessels: Vessel[];
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function VesselMarkerLayer({ vessels }: Props) {
  return (
    <>
      {vessels.map((vessel) => (
        <Marker
          key={`${vessel.vessel_id}-${vessel.imo_number}`}
          position={[vessel.latitude, vessel.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <div><strong>{vessel.name}</strong></div>
              <div>IMO: {vessel.imo_number}</div>
              <div>Type: {vessel.type}</div>
              <div>Lat: {vessel.latitude}</div>
              <div>Lng: {vessel.longitude}</div>
              <div>SOG: {vessel.sog}</div>
              <div>COG: {vessel.cog}</div>
              <div>Heading: {vessel.heading}</div>
              <div>Destination: {vessel.destination}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}