"use client";

import { useCallback, useEffect, useState } from "react";
import { runPipeline } from "@/services/pipelineService";
import { PipelineResponse } from "@/types/pipeline";

export function usePipeline(autoRefresh = false) {
  const [data, setData] = useState<PipelineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executePipeline = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await runPipeline();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run pipeline");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    executePipeline();
  }, [executePipeline]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      executePipeline();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, executePipeline]);

  return {
    data,
    loading,
    error,
    executePipeline,
  };
}