import { renderHook, waitFor, act } from "@testing-library/react";
import { useVehicles } from "@/application/hooks/useVehicles";
import { useAuthStore } from "@/application/stores/auth.store";
import { useMapStore } from "@/application/stores/map.store";
import { useVehicleStore } from "@/application/stores/vehicle.store";

const getVehicles = jest.fn();

jest.mock("@/infrastructure/api/fleet.service", () => ({
  fleetService: {
    getVehicles: (...args: unknown[]) => getVehicles(...args),
  },
}));

const resetAuth = () =>
  useAuthStore.setState({
    token: "token-123",
    userId: "user-1",
    email: "u@example.com",
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });

const resetMap = () =>
  useMapStore.setState({
    bounds: {
      swLat: -1,
      swLng: -1,
      neLat: 1,
      neLng: 1,
    },
    center: { lat: 0, lng: 0 },
    zoom: 6,
  });

const resetVehicles = () =>
  useVehicleStore.setState({
    vehicles: new Map(),
    selectedVehicleId: null,
    isLoading: false,
    error: null,
  });

describe("useVehicles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAuth();
    resetMap();
    resetVehicles();
  });

  it("fetches vehicles when bounds and token are available", async () => {
    const vehicle = {
      id: "veh-1",
      registration: "ABC123",
      name: "Truck",
      position: { lat: 0, lng: 0 },
      speed: 10,
      heading: 90,
      ignitionOn: true,
      timestamp: "t",
    };
    getVehicles.mockResolvedValue([vehicle]);

    const { result } = renderHook(() => useVehicles());

    await waitFor(() => expect(getVehicles).toHaveBeenCalled());
    expect(result.current.vehicles).toHaveLength(1);
    expect(result.current.selectedVehicle).toBeNull();

    act(() => result.current.selectVehicle("veh-1"));
    expect(result.current.selectedVehicle?.id).toBe("veh-1");
  });

  it("does not fetch when no bounds", async () => {
    useMapStore.setState({ bounds: null });

    renderHook(() => useVehicles());

    await new Promise((r) => setTimeout(r, 10));
    expect(getVehicles).not.toHaveBeenCalled();
  });
});
