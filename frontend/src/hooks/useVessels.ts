"use client";

import { useEffect, useState } from "react";
import { Vessel } from "@/types/vessel";

const BASE_URL = "http://127.0.0.1:8000";

export function useVessels() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch vessels from backend
  const fetchVessels = async () => {
    try {
      const res = await fetch(`${BASE_URL}/vessels/`);

      if (!res.ok) {
        throw new Error("Failed to fetch vessels");
      }

      const data = await res.json();
      setVessels(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching vessels:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Run backend pipeline
  const runPipeline = async () => {
    try {
      await fetch(`${BASE_URL}/pipeline/run`);
    } catch (err) {
      console.error("Pipeline error:", err);
    }
  };

  useEffect(() => {
    // Initial load
    fetchVessels();

    // Run every 5 seconds
    const interval = setInterval(() => {
      runPipeline();   // simulate detection
      fetchVessels();  // update UI
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    vessels,
    loading,
    error,
  };
}