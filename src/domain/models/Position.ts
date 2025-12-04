export interface Position {
  lat: number;
  lng: number;
  timestamp: string;
}

export interface PositionUpdate extends Position {
  vehicleId: string;
  speed: number;
  heading: number;
}

// Factory function to create position
export const createPosition = (
  lat: number,
  lng: number,
  timestamp: string,
): Position => ({
  lat,
  lng,
  timestamp,
});

// Factory function from API response
export const createPositionFromApiResponse = (data: {
  lat: number;
  lng: number;
  timestamp: string;
}): Position => createPosition(data.lat, data.lng, data.timestamp);

// Factory function to create position update
export const createPositionUpdate = (
  vehicleId: string,
  lat: number,
  lng: number,
  speed: number,
  heading: number,
  timestamp: string,
): PositionUpdate => ({
  vehicleId,
  lat,
  lng,
  speed,
  heading,
  timestamp,
});

// Factory function from WebSocket message
export const createPositionUpdateFromWebSocket = (data: {
  vehicle_id: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: string;
}): PositionUpdate =>
  createPositionUpdate(
    data.vehicle_id,
    data.lat,
    data.lng,
    data.speed,
    data.heading,
    data.timestamp,
  );

