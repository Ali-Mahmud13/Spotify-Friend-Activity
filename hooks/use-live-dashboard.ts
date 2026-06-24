"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DashboardData } from "@/lib/types";

const DASHBOARD_REFRESH_MS = 15_000;

export function useLiveDashboard(
  initialData: DashboardData,
  initialRefreshedAt: string
) {
  const [data, setData] = useState(initialData);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(initialRefreshedAt);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const inFlightRequest = useRef<AbortController | null>(null);

  const refreshDashboardData = useCallback(async () => {
    inFlightRequest.current?.abort();

    const controller = new AbortController();
    inFlightRequest.current = controller;

    try {
      const response = await fetch("/api/dashboard", {
        cache: "no-store",
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Refresh failed with ${response.status}`);
      }

      const nextData = (await response.json()) as DashboardData;

      setData(nextData);
      setLastRefreshedAt(new Date().toISOString());
      setRefreshError(null);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setRefreshError("Refresh paused. Retrying automatically.");
    } finally {
      if (inFlightRequest.current === controller) {
        inFlightRequest.current = null;
      }
    }
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(
      refreshDashboardData,
      DASHBOARD_REFRESH_MS
    );

    return () => {
      window.clearInterval(intervalId);
      inFlightRequest.current?.abort();
    };
  }, [refreshDashboardData]);

  return {
    data,
    lastRefreshedAt,
    refreshError
  };
}
