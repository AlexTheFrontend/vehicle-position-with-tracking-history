"use client";

import dynamic from "next/dynamic";
import type { TrackHistoryPoint } from "@/domain/types";
import type { Vehicle } from "@/domain/models";

interface VehicleMapProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleSelect: (vehicleId: string) => void;
  trackPoints?: TrackHistoryPoint[];
}

// Dynamically import the map component with SSR disabled
const VehicleMapInner = dynamic(() => import("./VehicleMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export const VehicleMap = (props: VehicleMapProps) => {
  return <VehicleMapInner {...props} />;
};
