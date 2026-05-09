"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Vessel } from "@/types/vessel";
import { RiskZone } from "@/types/riskZone";
import { Anomaly } from "@/types/anomaly";
import { useThemeMode } from "@/context/ThemeContext";
import { fetchDriftPrediction } from "@/services/anomalyService";
import { DriftPrediction } from "@/types/drift";
import { useState } from "react";

type Props = {
  vessels: Vessel[];
  riskZones: RiskZone[];
  anomalies: Anomaly[];
  selectedVessel: Vessel | null;
  selectedRegionBounds?: { minLat: number; maxLat: number; minLon: number; maxLon: number } | null;
};

// Persistent state across component remounts (navigation)
let globalHasFitted = false;

export default function HeroMapClient({ vessels, riskZones, anomalies, selectedVessel, selectedRegionBounds }: Props) {
  const { theme } = useThemeMode();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const zonesLayer = useRef<L.LayerGroup | null>(null);
  const driftLayer = useRef<L.LayerGroup | null>(null);
  const [activeDrift, setActiveDrift] = useState<DriftPrediction | null>(null);
  const [loadingDrift, setLoadingDrift] = useState(false);

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
    }).setView([15, 60], 3);

    L.control.zoom({ position: 'bottomright' }).addTo(leafletMap.current);

    // Using CartoDB Dark Matter for dark mode and OSM for light mode
    // Use Esri World Imagery (Satellite View) for a realistic marine monitoring feel
    const tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

    L.tileLayer(tileUrl, {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19,
    }).addTo(leafletMap.current);

    markersLayer.current = L.layerGroup().addTo(leafletMap.current);
    zonesLayer.current = L.layerGroup().addTo(leafletMap.current);
    driftLayer.current = L.layerGroup().addTo(leafletMap.current);

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

  // Dedicated function for drift prediction
  const handleDriftPrediction = async (anomalyId: number) => {
    console.log("Predicting drift for anomaly:", anomalyId);
    setLoadingDrift(true);
    try {
      const prediction = await fetchDriftPrediction(anomalyId);
      console.log("Drift prediction result:", prediction);
      setActiveDrift(prediction);
    } catch (err) {
      console.error("Failed to fetch drift prediction", err);
      alert("Failed to fetch drift prediction. Make sure the backend is running at " + process.env.NEXT_PUBLIC_API_BASE_URL);
    } finally {
      setLoadingDrift(false);
    }
  };

  // Attach a delegated listener to the map container for clicks on drift buttons
  useEffect(() => {
    if (!mapRef.current) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('.predict-drift-btn')) {
        const btn = target.closest('.predict-drift-btn') as HTMLElement;
        const id = btn.getAttribute('data-anomaly-id');
        console.log("Drift button clicked for anomaly ID:", id);
        if (id) {
          handleDriftPrediction(parseInt(id, 10));
        }
      }
    };

    const container = mapRef.current;
    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, []);

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
        fillOpacity: isConfirmed ? 0.4 : 0.25,
        radius: zone.risk_score * 50,
        weight: isConfirmed ? 4 : 2,
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

    // PERFORMANCE OPTIMIZATION: Prioritize anomalies, then show a limited number of normal vessels
    const anomalyVesselIds = new Set(anomalies.map(a => a.vessel_id));
    
    const anomalyVessels = vessels.filter(v => anomalyVesselIds.has(v.vessel_id));
    const normalVessels = vessels.filter(v => !anomalyVesselIds.has(v.vessel_id)).slice(0, 50);
    
    const displayVessels = [...anomalyVessels, ...normalVessels];

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
      const isAnomaly = anomalyVesselIds.has(vessel.vessel_id);
      const color = isAnomaly ? "#ef4444" : getMarkerColor(vessel);
      const size = isAnomaly ? 24 : 12; // Increased size for visibility on satellite
      const isHighRisk = vessel.sog < 1 || isAnomaly;

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            background:${color};
            width:${size}px;
            height:${size}px;
            border-radius:999px;
            border:2px solid white;
            ${isAnomaly ? `box-shadow: 0 0 15px ${color}, inset 0 0 5px rgba(0,0,0,0.5); z-index: 1000;` : "box-shadow: 0 2px 4px rgba(0,0,0,0.5);"}
            ${isHighRisk && !isAnomaly ? `box-shadow: 0 0 8px ${color}, 0 2px 4px rgba(0,0,0,0.5);` : ""}
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
        popupContent += `Time: ${new Date(anomaly.timestamp ?? new Date()).toLocaleString()}<br/>`;
        popupContent += `
          <button 
            class="predict-drift-btn"
            data-anomaly-id="${anomaly.anomaly_id}"
            style="
              margin-top: 8px;
              width: 100%;
              background: #ef4444;
              color: white;
              border: none;
              border-radius: 4px;
              padding: 4px 8px;
              font-size: 10px;
              font-weight: bold;
              cursor: pointer;
            "
          >
            PREDICT DRIFT PATH
          </button>
        `;
      }

      const marker = L.marker([vessel.latitude, vessel.longitude], { icon });
      marker.bindPopup(popupContent);
      marker.addTo(markersLayer.current!);
    });
  }, [vessels, anomalies]);

  // Handle Drift Path Rendering
  useEffect(() => {
    if (!leafletMap.current || !driftLayer.current || !activeDrift) return;
    driftLayer.current.clearLayers();

    const pathPoints = activeDrift.prediction_path.map(p => [p.latitude, p.longitude] as [number, number]);
    
    // Draw the path line
    const polyline = L.polyline(pathPoints, {
      color: '#ef4444',
      weight: 3,
      opacity: 0.7,
      dashArray: '5, 10'
    }).addTo(driftLayer.current);

    // Add markers for 12h and 24h marks
    activeDrift.prediction_path.forEach(p => {
      if (p.hour === 12 || p.hour === 24 || p.hour === 48) {
        const dot = L.circleMarker([p.latitude, p.longitude], {
          radius: 4,
          color: '#ef4444',
          fillColor: '#fff',
          fillOpacity: 1,
          weight: 2
        });
        dot.bindTooltip(`${p.hour}h prediction`, { permanent: false });
        dot.addTo(driftLayer.current!);
      }
    });

    // Zoom to show the path
    const bounds = polyline.getBounds();
    if (bounds.isValid()) {
      leafletMap.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }

  }, [activeDrift, theme]);

    useEffect(() => {
        if (!leafletMap.current || globalHasFitted) return;
        
        if (riskZones.length > 0) {
            const bounds = L.latLngBounds(riskZones.map(rz => [rz.latitude, rz.longitude]));
            leafletMap.current.fitBounds(bounds, { animate: true, padding: [50, 50], maxZoom: 6 });
            globalHasFitted = true;
        }
    }, [riskZones]);

    useEffect(() => {
        if (!leafletMap.current) return;
        
        // Manual region selection from UI
        if (selectedRegionBounds) {
            leafletMap.current.fitBounds([
                [selectedRegionBounds.minLat, selectedRegionBounds.minLon],
                [selectedRegionBounds.maxLat, selectedRegionBounds.maxLon]
            ], { animate: true, padding: [20, 20], maxZoom: 10 });
        }
        
        // Manual vessel selection from UI
        if (selectedVessel) {
            leafletMap.current.setView([selectedVessel.latitude, selectedVessel.longitude], 12, { animate: true });
        }
    }, [selectedRegionBounds, selectedVessel]);

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
            {activeDrift && (
              <button 
                onClick={() => {
                  setActiveDrift(null);
                  driftLayer.current?.clearLayers();
                }}
                className="rounded-full bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-red-700 transition-colors border border-white/20"
              >
                Clear Drift Path
              </button>
            )}
        </div>
      </div>
    </section>
  );
}