import { create } from "zustand";
import { updateVehiclePosition, type Vehicle } from "@/domain/models";
import type { PositionUpdate } from "@/domain/models";

interface VehicleState {
  vehicles: Map<string, Vehicle>;
  selectedVehicleId: string | null;
  isLoading: boolean;
  error: string | null;
  setVehicles: (vehicles: Vehicle[]) => void;
  updateVehiclePosition: (update: PositionUpdate) => void;
  selectVehicle: (vehicleId: string | null) => void;
  getSelectedVehicle: () => Vehicle | null;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: new Map(),
  selectedVehicleId: null,
  isLoading: false,
  error: null,

  setVehicles: (vehicles: Vehicle[]) => {
    const vehicleMap = new Map<string, Vehicle>();
    vehicles.forEach((vehicle) => {
      vehicleMap.set(vehicle.id, vehicle);
    });
    set({ vehicles: vehicleMap });
  },

  updateVehiclePosition: (update: PositionUpdate) => {
    const { vehicles } = get();
    const vehicle = vehicles.get(update.vehicleId);
    
    if (vehicle) {
      const updatedVehicle = updateVehiclePosition(
        vehicle,
        update.lat,
        update.lng,
        update.speed,
        update.heading,
        update.timestamp
      );
      
      const newVehicles = new Map(vehicles);
      newVehicles.set(vehicle.id, updatedVehicle);
      set({ vehicles: newVehicles });
    }
  },

  selectVehicle: (vehicleId: string | null) => {
    set({ selectedVehicleId: vehicleId });
  },

  getSelectedVehicle: () => {
    const { vehicles, selectedVehicleId } = get();
    if (!selectedVehicleId) return null;
    return vehicles.get(selectedVehicleId) || null;
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

