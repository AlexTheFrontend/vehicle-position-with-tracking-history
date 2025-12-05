import { useEffect } from "react";
import { useAuthStore } from "@/application/stores/auth.store";
import { useVehicleStore } from "@/application/stores/vehicle.store";
import { vehicleSocketService } from "@/infrastructure/websocket/vehicle-socket.service";

export const useVehicleSocket = (vehicleIds: string[]) => {
  const { token, isAuthenticated } = useAuthStore();
  const { updateVehiclePosition } = useVehicleStore();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    vehicleSocketService.connect(token);
    const stopListening = vehicleSocketService.onPositionUpdate(updateVehiclePosition);

    return () => {
      stopListening();
      vehicleSocketService.unsubscribe();
      vehicleSocketService.disconnect();
    };
  }, [isAuthenticated, token, updateVehiclePosition]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (vehicleIds.length === 0) {
      vehicleSocketService.unsubscribe();
      return;
    }

    vehicleSocketService.subscribe(vehicleIds);
  }, [isAuthenticated, vehicleIds]);

  return {
    isConnected: vehicleSocketService.isConnected(),
  };
};

