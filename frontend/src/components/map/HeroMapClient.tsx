"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Vessel } from "@/types/vessel";
import { RiskZone } from "@/types/riskZone";
import { useThemeMode } from "@/context/ThemeContext";

type Props = {
  vessels: Vessel[];
  riskZones: RiskZone[];
  selectedVessel: Vessel | null;
};

export default function HeroMapClient({ vessels, riskZones, selectedVessel }: Props) {
  const { theme } = useThemeMode();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const zonesLayer = useRef<L.LayerGroup | null>(null);

  const getMarkerColor = (vessel: Vessel) => {
    if (vessel.sog < 1) return "#ef4444";
    if (vessel.sog < 5) return "#f59e0b";
    return "#22c55e";
  };

  const getMarkerSize = (vessel: Vessel) => {
    if (vessel.sog < 1) return 18;
    if (vessel.sog < 5) return 16;
    return 14;
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "#991b1b"; // dark red
    if (score >= 60) return "#ef4444"; // red
    if (score >= 40) return "#f59e0b"; // amber
    return "#3b82f6"; // blue
  };

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Initialize map
    leafletMap.current = L.map(mapRef.current, {
      zoomControl: true,
      fadeAnimation: true,
      markerZoomAnimation: true
    }).setView([1.29027, 103.851959], 8);

    // Using a more reliable tile provider
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(leafletMap.current);

    markersLayer.current = L.layerGroup().addTo(leafletMap.current);
    zonesLayer.current = L.layerGroup().addTo(leafletMap.current);

    // CRITICAL: Invalidate size after a short delay to fix grey tile issue
    setTimeout(() => {
      leafletMap.current?.invalidateSize();
    }, 500);

    return () => {
      markersLayer.current?.clearLayers();
      zonesLayer.current?.clearLayers();
      leafletMap.current?.remove();
      markersLayer.current = null;
      zonesLayer.current = null;
      leafletMap.current = null;
    };
  }, []);

  // Handle Risk Zones
  useEffect(() => {
    if (!leafletMap.current || !zonesLayer.current) return;
    zonesLayer.current.clearLayers();

    riskZones.forEach((zone) => {
      const color = getRiskColor(zone.risk_score);
      const circle = L.circle([zone.latitude, zone.longitude], {
        color: color,
        fillColor: color,
        fillOpacity: 0.25,
        radius: zone.risk_score * 50,
        weight: 2,
        dashArray: '5, 10'
      });

      circle.bindPopup(`
        <div style="font-size:12px;line-height:1.4;">
          <strong style="color:${color}">⚠️ SUSPICIOUS SPILL ZONE</strong><br/>
          Intensity: <b>${zone.risk_score}%</b><br/>
          Pos: ${zone.latitude.toFixed(4)}, ${zone.longitude.toFixed(4)}
        </div>
      `);
      circle.addTo(zonesLayer.current!);
    });
  }, [riskZones]);

  // Handle Vessel Markers
  useEffect(() => {
    if (!leafletMap.current || !markersLayer.current) return;
    markersLayer.current.clearLayers();

    vessels.forEach((vessel) => {
      const color = getMarkerColor(vessel);
      const size = getMarkerSize(vessel);
      const isHighRisk = vessel.sog < 1;

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            background:${color};
            width:${size}px;
            height:${size}px;
            border-radius:999px;
            border:2px solid white;
            box-shadow:0 0 12px ${color};
            ${isHighRisk ? "animation: pulse 1.2s infinite;" : ""}
          "></div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([vessel.latitude, vessel.longitude], { icon });
      marker.bindPopup(`<strong>${vessel.name}</strong><br/>Type: ${vessel.type}<br/>Speed: ${vessel.sog} KN`);
      marker.addTo(markersLayer.current!);
    });
  }, [vessels]);

  useEffect(() => {
    if (!leafletMap.current || !selectedVessel) return;
    leafletMap.current.setView([selectedVessel.latitude, selectedVessel.longitude], 12);
  }, [selectedVessel]);

  return (
    <section className="overflow-hidden rounded-[32px] border border-[var(--highlight)] bg-[var(--bg-card)] shadow-sm">
      <div className="relative h-[420px] w-full">
        <div ref={mapRef} className="h-full w-full" />
        
        {/* Map UI Overlays */}
        <div className="absolute left-6 top-6 z-[1000] rounded-full bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl backdrop-blur-md border border-white/20">
          Live Risk Monitoring Map
        </div>

        <div className="absolute right-6 top-6 z-[1000] flex gap-2">
            <div className="rounded-full bg-slate-900/80 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-xl backdrop-blur-md border border-white/10">
              Vessels: {vessels.length}
            </div>
            <div className="rounded-full bg-blue-900/80 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-xl backdrop-blur-md border border-white/10">
              Risks: {riskZones.length}
            </div>
        </div>
      </div>
    </section>
  );
}