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

// Factory function to create a vehicle
export const createVehicle = (
  id: string,
  registration: string,
  name: string,
  position: { lat: number; lng: number },
  speed: number,
  heading: number,
  ignitionOn: boolean,
  timestamp: string,
): Vehicle => ({
  id,
  registration,
  name,
  position,
  speed,
  heading,
  ignitionOn,
  timestamp,
});

// Pure function to update vehicle position
export const updateVehiclePosition = (
  vehicle: Vehicle,
  lat: number,
  lng: number,
  speed: number,
  heading: number,
  timestamp: string,
): Vehicle => ({
  ...vehicle,
  position: { lat, lng },
  speed,
  heading,
  timestamp,
});

// Factory function from API response
export const createVehicleFromApiResponse = (data: {
  vehicle_id: string;
  registration: string;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  ignition_on: boolean;
  timestamp: string;
}): Vehicle =>
  createVehicle(
    data.vehicle_id,
    data.registration,
    data.name,
    { lat: data.lat, lng: data.lng },
    data.speed,
    data.heading,
    data.ignition_on,
    data.timestamp,
  );

