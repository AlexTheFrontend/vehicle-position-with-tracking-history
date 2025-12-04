"use client";

import type { Vehicle } from "@/domain/models";

interface VehicleDetailsPanelProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const VehicleDetailsPanel = ({
  vehicle,
  onClose,
}: VehicleDetailsPanelProps) => {
  if (!vehicle) {
    return null;
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="absolute top-4 right-4 w-80 bg-white shadow-lg rounded-lg p-6 z-[1000]">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {vehicle.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Registration</p>
          <p className="text-base font-medium text-gray-900">
            {vehicle.registration}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${vehicle.ignitionOn ? "bg-green-500" : "bg-red-500"
                }`}
            />
            <p className="text-base font-medium text-gray-900">
              {vehicle.ignitionOn ? "Ignition On" : "Ignition Off"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Speed</p>
          <p className="text-base font-medium text-gray-900">
            {vehicle.speed != null ? `${vehicle.speed.toFixed(1)} km/h` : 'N/A'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Heading</p>
          <p className="text-base font-medium text-gray-900">
            {vehicle.heading != null ? `${vehicle.heading}°` : 'N/A'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Position</p>
          <p className="text-base font-medium text-gray-900">
            {vehicle.position?.lat != null && vehicle.position?.lng != null
              ? `${vehicle.position.lat.toFixed(6)}, ${vehicle.position.lng.toFixed(6)}`
              : 'N/A'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Last Update</p>
          <p className="text-base font-medium text-gray-900">
            {formatTimestamp(vehicle.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

