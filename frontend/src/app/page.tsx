"use client";

import { useState } from "react";
import Header from "@/components/header/Header";
import MetricsRow from "@/components/cards/MetricsRow";
import LiveRiskMap from "@/components/map/LiveRiskMap";
import VesselList from "@/components/vessel-panel/VesselList";
import AlertPanel from "@/components/alerts/AlertPanel";
import PipelineControl from "@/components/controls/PipelineControl";
import { useVessels } from "@/hooks/useVessels";
import { usePipeline } from "@/hooks/usePipeline";
import { Vessel } from "@/types/vessel";

export default function HomePage() {
  const { vessels, loading, error } = useVessels();
  const {
    data: pipelineData,
    loading: pipelineLoading,
    error: pipelineError,
    executePipeline,
  } = usePipeline(true);

  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Header />

        {loading && (
          <div className="rounded-xl bg-slate-800 p-4 text-white">
            Loading vessel data...
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-600/20 p-4 text-red-200">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <MetricsRow vessels={vessels} />

            <PipelineControl
              onRun={executePipeline}
              loading={pipelineLoading}
            />

            {pipelineError && (
              <div className="rounded-xl bg-red-600/20 p-4 text-red-200">
                Pipeline Error: {pipelineError}
              </div>
            )}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="space-y-6 xl:col-span-4">
                <VesselList
                  vessels={vessels}
                  onSelect={setSelectedVessel}
                  selectedVessel={selectedVessel}
                />

                <AlertPanel results={pipelineData?.results ?? []} />
              </div>

              <div className="xl:col-span-8">
                <LiveRiskMap
                  vessels={vessels}
                  selectedVessel={selectedVessel}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}