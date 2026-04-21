"use client";

import { useEffect, useState } from "react";
import { fetchVessels } from "@/services/vesselService";
import { Vessel } from "@/types/vessel";

export function useVessels() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVessels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchVessels();
      setVessels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vessels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVessels();
  }, []);

  return {
    vessels,
    loading,
    error,
    reload: loadVessels,
  };
}
