"use client";

import dynamic from "next/dynamic";
import { Vessel } from "@/types/vessel";
import { RiskZone } from "@/types/riskZone";

import { Anomaly } from "@/types/anomaly";

const HeroMapClient = dynamic(() => import("./HeroMapClient"), {
  ssr: false,
  loading: () => (
    <section className="overflow-hidden rounded-[34px] border border-slate-700 bg-[#0f1720] shadow-sm">
      <div className="flex h-[420px] items-center justify-center text-white">
        Loading live map...
      </div>
    </section>
  ),
});

type Props = {
  vessels: Vessel[];
  riskZones: RiskZone[];
  anomalies: Anomaly[];
  selectedVessel: Vessel | null;
  selectedRegionBounds: { minLat: number; maxLat: number; minLon: number; maxLon: number } | null;
};

export default function LiveHeroMap({ vessels, riskZones, anomalies, selectedVessel, selectedRegionBounds }: Props) {
  return <HeroMapClient vessels={vessels} riskZones={riskZones} anomalies={anomalies} selectedVessel={selectedVessel} selectedRegionBounds={selectedRegionBounds} />;
}