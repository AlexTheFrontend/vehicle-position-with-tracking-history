import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/application/stores/auth.store";
import { useVehicleStore } from "@/application/stores/vehicle.store";
import { fleetService } from "@/infrastructure/api/fleet.service";
import type { TrackHistoryPoint, TimeRange } from "@/domain/types";
import toast from "react-hot-toast";

export const useTrackHistory = () => {
  const [trackPoints, setTrackPoints] = useState<TrackHistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("now-24h");
  const { token } = useAuthStore();
  const { selectedVehicleId, vehicles } = useVehicleStore();

  const fetchTrackHistory = useCallback(async () => {
    if (!selectedVehicleId || !token) {
      setTrackPoints([]);
      return;
    }

    setIsLoading(true);
    try {
      const points = await fleetService.getTrackHistory(
        {
          vehicleId: selectedVehicleId,
          from: timeRange,
        },
        token
      );
      setTrackPoints(points);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch track history";
      toast.error(errorMessage);
      console.error("Failed to fetch track history:", err);
      setTrackPoints([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVehicleId, token, timeRange]);

  // Fetch track history when vehicle is selected or time range changes
  useEffect(() => {
    fetchTrackHistory();
  }, [fetchTrackHistory]);

  // Add live position updates to the track
  const addLivePoint = useCallback((point: TrackHistoryPoint) => {
    setTrackPoints((prev) => [...prev, point]);
  }, []);

  // Listen to vehicle position updates and add them to the track
  // Use a ref to track last timestamp to avoid infinite loops
  const lastTimestampRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedVehicleId) {
      lastTimestampRef.current = null;
      return;
    }

    // When vehicle changes, we'll refetch above
    // This effect just handles adding new points as they come in via WebSocket
    const vehicle = vehicles.get(selectedVehicleId);
    if (!vehicle) return;

    // Check if this is a new position (timestamp changed)
    if (lastTimestampRef.current !== vehicle.timestamp) {
      const isNewer = !lastTimestampRef.current ||
        new Date(vehicle.timestamp) > new Date(lastTimestampRef.current);

      if (isNewer) {
        lastTimestampRef.current = vehicle.timestamp;
        const newPoint: TrackHistoryPoint = {
          lat: vehicle.position.lat,
          lng: vehicle.position.lng,
          speed: vehicle.speed,
          heading: vehicle.heading,
          timestamp: vehicle.timestamp,
        };
        addLivePoint(newPoint);
      }
    }
  }, [selectedVehicleId, vehicles, addLivePoint]);

  return {
    trackPoints,
    isLoading,
    timeRange,
    setTimeRange,
    refreshTrack: fetchTrackHistory,
  };
};

