import type {
  GetVehiclesResponse,
  MapBounds,
  GetTrackHistoryParams,
  GetTrackHistoryResponse,
  TrackHistoryPoint,
} from "@/domain/types";
import { createVehicleFromApiResponse } from "@/domain/models";
import { API_BASE_URL } from "./config";

const getVehicles = async (bounds: MapBounds, token: string) => {
  const params = new URLSearchParams({
    swLat: bounds.swLat.toString(),
    swLng: bounds.swLng.toString(),
    neLat: bounds.neLat.toString(),
    neLng: bounds.neLng.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/fleet/vehicles/live?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
  }

  const data: GetVehiclesResponse = await response.json();

  return data.data.vehicles.map((vehicle) =>
    createVehicleFromApiResponse(vehicle)
  );
};

const getTrackHistory = async (
  params: GetTrackHistoryParams,
  token: string
): Promise<TrackHistoryPoint[]> => {
  const queryParams = new URLSearchParams({
    from: params.from,
  });

  if (params.to) {
    queryParams.append("to", params.to);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/fleet/vehicles/${params.vehicleId}/track?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch track history: ${response.statusText}${errorText ? ` - ${errorText}` : ""}`
    );
  }

  const data: GetTrackHistoryResponse = await response.json();

  return data.data.points;
};

export const fleetService = {
  getVehicles,
  getTrackHistory,
};

