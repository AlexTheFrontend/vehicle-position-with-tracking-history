export interface Vehicle {
  id: string;
  registration: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  speed: number;
  heading: number;
  ignitionOn: boolean;
  timestamp: string;
}

export class VehicleModel {
  constructor(
    public readonly id: string,
    public readonly registration: string,
    public readonly name: string,
    public position: { lat: number; lng: number },
    public speed: number,
    public heading: number,
    public ignitionOn: boolean,
    public timestamp: string,
  ) {}

  updatePosition(
    lat: number,
    lng: number,
    speed: number,
    heading: number,
    timestamp: string,
  ): VehicleModel {
    return new VehicleModel(
      this.id,
      this.registration,
      this.name,
      { lat, lng },
      speed,
      heading,
      this.ignitionOn,
      timestamp,
    );
  }

  static fromApiResponse(data: {
    vehicle_id: string;
    registration: string;
    name: string;
    lat: number;
    lng: number;
    speed: number;
    heading: number;
    ignition_on: boolean;
    timestamp: string;
  }): VehicleModel {
    return new VehicleModel(
      data.vehicle_id,
      data.registration,
      data.name,
      { lat: data.lat, lng: data.lng },
      data.speed,
      data.heading,
      data.ignition_on,
      data.timestamp,
    );
  }

  toJson(): Vehicle {
    return {
      id: this.id,
      registration: this.registration,
      name: this.name,
      position: this.position,
      speed: this.speed,
      heading: this.heading,
      ignitionOn: this.ignitionOn,
      timestamp: this.timestamp,
    };
  }
}

