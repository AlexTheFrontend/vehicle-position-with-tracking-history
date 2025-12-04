"use client";

import { Toaster } from "react-hot-toast";
import { useAuth } from "@/application/hooks/useAuth";
import { useVehicles } from "@/application/hooks/useVehicles";
import { useVehicleSocket } from "@/application/hooks/useVehicleSocket";
import { useTrackHistory } from "@/application/hooks/useTrackHistory";
import { VehicleMap } from "@/presentation/components/Map/VehicleMap";
import { VehicleDetailsPanel } from "@/presentation/components/VehicleDetails/VehicleDetailsPanel";
import { TimeRangeSelector } from "@/presentation/components/Map/TimeRangeSelector";

export default function Home() {
  const { isAuthenticated, isLoading: authLoading, error: authError } = useAuth();
  const { vehicles, selectedVehicle, isLoading: vehiclesLoading, selectVehicle } = useVehicles();
  const { trackPoints, isLoading: trackLoading, timeRange, setTimeRange } = useTrackHistory();
  
  // Subscribe to WebSocket updates for all visible vehicles
  const vehicleIds = vehicles.map((v) => v.id);
  const { isConnected } = useVehicleSocket(vehicleIds);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Authentication Error</p>
          <p className="text-gray-600">{authError}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Not authenticated</p>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen">
      {/* <Toaster position="top-center" /> */}
      
      {/* Status Bar */}
      <div className="absolute top-4 left-4 z-10 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center space-x-4">
        <div className="flex items-center">
          <span
            className={`inline-block w-3 h-3 rounded-full mr-2 ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm font-medium">
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}
        </div>
        {vehiclesLoading && (
          <div className="text-sm text-gray-500">Loading...</div>
        )}
      </div>

      {/* Time Range Selector - shown when vehicle is selected */}
      {selectedVehicle && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          {trackLoading && (
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
                Loading track...
              </span>
            </div>
          )}
        </div>
      )}

      {/* Map */}
      <VehicleMap
        vehicles={vehicles}
        selectedVehicleId={selectedVehicle?.id || null}
        onVehicleSelect={selectVehicle}
        trackPoints={trackPoints}
      />

      {/* Vehicle Details Panel */}
      <VehicleDetailsPanel
        vehicle={selectedVehicle}
        onClose={() => selectVehicle(null)}
      />
    </div>
  );
}
