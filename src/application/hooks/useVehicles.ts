import { useEffect, useCallback } from "react";
import { useVehicleStore } from "@/application/stores/vehicle.store";
import { useMapStore } from "@/application/stores/map.store";
import { useAuthStore } from "@/application/stores/auth.store";
import { fleetService } from "@/infrastructure/api/fleet.service";

export const useVehicles = () => {
  const { vehicles, selectedVehicleId, isLoading, error, setVehicles, selectVehicle, setLoading, setError } = useVehicleStore();
  const { bounds } = useMapStore();
  const { token } = useAuthStore();

  const fetchVehicles = useCallback(async () => {
    if (!bounds || !token) return;

    setLoading(true);
    setError(null);

    try {
      const vehiclesList = await fleetService.getVehicles(bounds, token);
      setVehicles(vehiclesList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch vehicles";
      setError(errorMessage);
      console.error("Failed to fetch vehicles:", err);
    } finally {
      setLoading(false);
    }
  }, [bounds, token, setVehicles, setLoading, setError]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const vehiclesList = Array.from(vehicles.values());
  const selectedVehicle = selectedVehicleId ? vehicles.get(selectedVehicleId) || null : null;

  return {
    vehicles: vehiclesList,
    selectedVehicle,
    isLoading,
    error,
    selectVehicle,
    refreshVehicles: fetchVehicles,
  };
};

