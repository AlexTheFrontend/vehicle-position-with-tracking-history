// Auth API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  data: {
    token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    user: {
      id: string;
      email: string;
      first_name?: string;
      last_name?: string;
      role?: string;
    };
  };
}

// Fleet API Types
export interface VehicleApiResponse {
  vehicle_id: string;
  registration: string;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  ignition_on: boolean;
  timestamp: string;
}

export interface GetVehiclesResponse {
  data: {
    vehicles: VehicleApiResponse[];
    count: number;
  };
}

export interface MapBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

// WebSocket Types
export interface WebSocketSubscribeMessage {
  action: "subscribe";
  vehicle_ids: string[];
}

export interface WebSocketPositionUpdate {
  type: "position_update";
  vehicle_id: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: string;
}

export type WebSocketMessage =
  | WebSocketSubscribeMessage
  | WebSocketPositionUpdate;

// Track History Types
export interface TrackHistoryPoint {
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: string;
}

export type TimeRange = "now-1h" | "now-6h" | "now-24h" | "now-7d";

export interface GetTrackHistoryParams {
  vehicleId: string;
  from: TimeRange | string;
  to?: string;
}

export interface GetTrackHistoryResponse {
  data: {
    vehicle_id: string;
    vehicle: {
      registration: string;
      name: string;
    };
    points: TrackHistoryPoint[];
    point_count: number;
  };
}

