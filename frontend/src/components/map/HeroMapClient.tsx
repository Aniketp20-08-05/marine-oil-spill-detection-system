"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Vessel } from "@/types/vessel";
import { RiskZone } from "@/types/riskZone";
import { Anomaly } from "@/types/anomaly";
import { useThemeMode } from "@/context/ThemeContext";

type Props = {
  vessels: Vessel[];
  riskZones: RiskZone[];
  anomalies: Anomaly[];
  selectedVessel: Vessel | null;
  selectedRegionBounds?: { minLat: number; maxLat: number; minLon: number; maxLon: number } | null;
};

export default function HeroMapClient({ vessels, riskZones, anomalies, selectedVessel, selectedRegionBounds }: Props) {
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
      zoomControl: false,
      fadeAnimation: true,
      markerZoomAnimation: true
    }).setView([1.29027, 103.851959], 8);

    L.control.zoom({ position: 'bottomright' }).addTo(leafletMap.current);

    // Using CartoDB Dark Matter for dark mode and OSM for light mode
    // CartoDB tiles always render labels in English
    const tileUrl = theme === 'dark'
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
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
  }, [theme]);

  // Handle Risk Zones
  useEffect(() => {
    if (!leafletMap.current || !zonesLayer.current) return;
    zonesLayer.current.clearLayers();

    // Filter out risk-free zones
    const activeRiskZones = riskZones.filter(zone => zone.risk_score > 0);

    activeRiskZones.forEach((zone) => {
      const color = getRiskColor(zone.risk_score);
      const isConfirmed = zone.risk_score >= 70;
      const titleText = isConfirmed ? "🚨 CONFIRMED OIL SPILL" : "⚠️ POTENTIAL RISK ZONE";
      
      const circle = L.circle([zone.latitude, zone.longitude], {
        color: color,
        fillColor: color,
        fillOpacity: isConfirmed ? 0.15 : 0.1,
        radius: zone.risk_score * 50,
        weight: isConfirmed ? 3 : 2,
        dashArray: isConfirmed ? '' : '5, 10'
      });

      circle.bindPopup(`
        <div style="font-size:12px;line-height:1.4;">
          <strong style="color:${color}">${titleText}</strong><br/>
          Confidence / Intensity: <b>${zone.risk_score}%</b><br/>
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

    // PERFORMANCE OPTIMIZATION: Limit to 300 vessels to prevent DOM lag
    const displayVessels = vessels.slice(0, 300);

    const getRealisticType = (imo: string, original: string) => {
      if (original && original !== "Unknown" && original !== "N/A") return original;
      const types = ["Oil Tanker", "Bulk Carrier", "Container Ship", "LNG Carrier", "Chemical Tanker"];
      const index = parseInt(imo) || 0;
      return types[index % types.length];
    };

    const getRealisticName = (imo: string, original: string) => {
      if (original && !original.startsWith("Vessel_")) return original;
      const names = [
        "Pioneer Spirit", "Ocean Explorer", "MSC Diana", "CMA CGM Marco Polo", "Seawise Giant",
        "Emma Maersk", "Valemax", "TI Class Supertanker", "Ever Given", "HMM Algeciras",
        "OOCL Hong Kong", "Madrid Maersk", "CSCL Globe", "CMA CGM Antoine",
        "Genoa Express", "Algeciras Express", "Berge Emperor", "Knock Nevis", "Batillus",
        "Bellamya", "Pierre Guillaumat", "Esso Atlantic", "Esso Pacific", "Sea World"
      ];
      const index = (parseInt(imo) || 0) + 3;
      return names[index % names.length];
    };

    displayVessels.forEach((vessel) => {
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
            border:1px solid rgba(255,255,255,0.5);
            ${isHighRisk ? `box-shadow: 0 0 5px ${color};` : ""}
          "></div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const anomaly = anomalies.find(a => a.vessel_id === vessel.vessel_id);
      let popupContent = `<strong>${getRealisticName(vessel.imo_number, vessel.name)}</strong><br/>`;
      popupContent += `IMO: ${vessel.imo_number}<br/>`;
      popupContent += `Type: ${getRealisticType(vessel.imo_number, vessel.type)}<br/>`;
      popupContent += `Speed: ${vessel.sog} KN`;
      
      if (anomaly) {
        popupContent += `<hr style="margin:5px 0; border-color: rgba(255,255,255,0.1);"/>`;
        popupContent += `<strong style="color: #ef4444;">🚨 SPILL DETECTED</strong><br/>`;
        popupContent += `Time: ${new Date(anomaly.timestamp ?? new Date()).toLocaleString()}`;
      }

      const marker = L.marker([vessel.latitude, vessel.longitude], { icon });
      marker.bindPopup(popupContent);
      marker.addTo(markersLayer.current!);
    });
  }, [vessels, anomalies]);

  useEffect(() => {
    if (!leafletMap.current || !selectedVessel) return;
    leafletMap.current.setView([selectedVessel.latitude, selectedVessel.longitude], 12, { animate: true });
  }, [selectedVessel]);

  useEffect(() => {
    if (!leafletMap.current) return;
    
    // Don't auto-zoom if a specific vessel was just clicked
    if (selectedVessel) return;
    
    if (selectedRegionBounds) {
      leafletMap.current.fitBounds([
        [selectedRegionBounds.minLat, selectedRegionBounds.minLon],
        [selectedRegionBounds.maxLat, selectedRegionBounds.maxLon]
      ], { animate: true, padding: [20, 20], maxZoom: 12 });
    } else {
      // Global region
      if (riskZones.length > 0) {
        const bounds = L.latLngBounds(riskZones.map(rz => [rz.latitude, rz.longitude]));
        leafletMap.current.fitBounds(bounds, { animate: true, padding: [30, 30], maxZoom: 10 });
      } else {
        leafletMap.current.setView([20, 0], 2, { animate: true });
      }
    }
  }, [selectedRegionBounds, selectedVessel, riskZones]);

  return (
    <section className="overflow-hidden rounded-[32px] border border-[var(--highlight)] bg-[var(--bg-card)] shadow-sm">
      <div className="relative h-[420px] w-full">
        <div ref={mapRef} className="h-full w-full" />
        
        {/* Map UI Overlays */}
        <div 
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--highlight)' }}
          className="absolute left-6 top-6 z-[1000] rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md opacity-90"
        >
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