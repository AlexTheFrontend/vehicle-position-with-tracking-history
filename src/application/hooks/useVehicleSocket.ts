import { useEffect } from "react";
import { useAuthStore } from "@/application/stores/auth.store";
import { useVehicleStore } from "@/application/stores/vehicle.store";
import { vehicleSocketService } from "@/infrastructure/websocket/vehicle-socket.service";

export const useVehicleSocket = (vehicleIds: string[]) => {
  const { token, isAuthenticated } = useAuthStore();
  const { updateVehiclePosition } = useVehicleStore();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    // Connect to WebSocket
    vehicleSocketService.connect(token);

    // Subscribe to position updates
    const unsubscribe = vehicleSocketService.onPositionUpdate((update) => {
      updateVehiclePosition(update);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, token, updateVehiclePosition]);

  useEffect(() => {
    if (!isAuthenticated || vehicleIds.length === 0) {
      return;
    }

    // Subscribe to specific vehicles
    vehicleSocketService.subscribe(vehicleIds);
  }, [isAuthenticated, vehicleIds]);

  return {
    isConnected: vehicleSocketService.isConnected(),
  };
};

