"use client";

import dynamic from "next/dynamic";
import { Vessel } from "@/types/vessel";

const ClientMap = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-2xl bg-slate-800 text-white">
      Loading map...
    </div>
  ),
});

type Props = {
  vessels: Vessel[];
  selectedVessel: Vessel | null;
};

export default function LiveRiskMap({ vessels, selectedVessel }: Props) {
  return <ClientMap vessels={vessels} selectedVessel={selectedVessel} />;
}