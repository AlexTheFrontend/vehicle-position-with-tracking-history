// Auth API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
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
  success: boolean;
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

// Track History Types (placeholder for future endpoint)
export interface TrackHistoryPoint {
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: string;
}

export interface GetTrackHistoryResponse {
  success: boolean;
  data: {
    vehicle_id: string;
    points: TrackHistoryPoint[];
  };
}

