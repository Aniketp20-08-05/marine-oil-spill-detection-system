"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Vessel } from "@/types/vessel";

type Props = {
  vessels: Vessel[];
  selectedVessel: Vessel | null;
};

export default function MapClient({ vessels, selectedVessel }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  const getMarkerColor = (vessel: Vessel) => {
    if (vessel.sog < 1) return "#ef4444"; // red
    if (vessel.sog < 5) return "#f59e0b"; // orange
    return "#22c55e"; // green
  };

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    leafletMap.current = L.map(mapRef.current).setView([19.076, 72.8777], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(leafletMap.current);

    markersLayer.current = L.layerGroup().addTo(leafletMap.current);

    return () => {
      markersLayer.current?.clearLayers();
      leafletMap.current?.remove();
      markersLayer.current = null;
      leafletMap.current = null;
    };
  }, []);

  useEffect(() => {
    if (!leafletMap.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    vessels.forEach((vessel) => {
      const color = getMarkerColor(vessel);

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            background:${color};
            width:14px;
            height:14px;
            border-radius:50%;
            border:2px solid white;
            box-shadow:0 0 6px rgba(0,0,0,0.5);
          "></div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([vessel.latitude, vessel.longitude], {
        icon,
      });

      marker.bindPopup(`
        <div style="font-size: 14px; line-height: 1.5;">
          <strong>${vessel.name}</strong><br/>
          IMO: ${vessel.imo_number}<br/>
          Type: ${vessel.type}<br/>
          Speed: ${vessel.sog}<br/>
          Heading: ${vessel.heading}<br/>
          Destination: ${vessel.destination}
        </div>
      `);

      marker.addTo(markersLayer.current!);
    });
  }, [vessels]);

  useEffect(() => {
    if (!leafletMap.current || !selectedVessel) return;

    leafletMap.current.setView(
      [selectedVessel.latitude, selectedVessel.longitude],
      10,
      { animate: true }
    );
  }, [selectedVessel]);

  return (
    <div className="rounded-2xl bg-slate-800 p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Live Marine Map</h2>
        <span className="text-sm text-slate-300">Vessels: {vessels.length}</span>
      </div>

      <div
        ref={mapRef}
        style={{ height: "500px", width: "100%" }}
        className="rounded-2xl"
      />
    </div>
  );
}