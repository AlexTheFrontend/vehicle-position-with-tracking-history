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

export class PositionModel {
  constructor(
    public readonly lat: number,
    public readonly lng: number,
    public readonly timestamp: string,
  ) {}

  static fromApiResponse(data: {
    lat: number;
    lng: number;
    timestamp: string;
  }): PositionModel {
    return new PositionModel(data.lat, data.lng, data.timestamp);
  }

  toJson(): Position {
    return {
      lat: this.lat,
      lng: this.lng,
      timestamp: this.timestamp,
    };
  }
}

export class PositionUpdateModel extends PositionModel {
  constructor(
    public readonly vehicleId: string,
    lat: number,
    lng: number,
    public readonly speed: number,
    public readonly heading: number,
    timestamp: string,
  ) {
    super(lat, lng, timestamp);
  }

  static fromWebSocketMessage(data: {
    vehicle_id: string;
    lat: number;
    lng: number;
    speed: number;
    heading: number;
    timestamp: string;
  }): PositionUpdateModel {
    return new PositionUpdateModel(
      data.vehicle_id,
      data.lat,
      data.lng,
      data.speed,
      data.heading,
      data.timestamp,
    );
  }

  toJson(): PositionUpdate {
    return {
      vehicleId: this.vehicleId,
      lat: this.lat,
      lng: this.lng,
      speed: this.speed,
      heading: this.heading,
      timestamp: this.timestamp,
    };
  }
}

