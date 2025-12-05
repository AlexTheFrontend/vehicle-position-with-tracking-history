import { renderHook } from "@testing-library/react";
import { useVehicleSocket } from "@/application/hooks/useVehicleSocket";
import { useAuthStore } from "@/application/stores/auth.store";
import { useVehicleStore } from "@/application/stores/vehicle.store";

jest.mock("@/infrastructure/websocket/vehicle-socket.service", () => {
  const mock = {
    connect: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    disconnect: jest.fn(),
    onPositionUpdate: jest.fn().mockReturnValue(jest.fn()),
    isConnected: jest.fn().mockReturnValue(true),
  };
  return { vehicleSocketService: mock, __mockSocketService: mock };
});

const { __mockSocketService: socketMock } = jest.requireMock(
  "@/infrastructure/websocket/vehicle-socket.service"
) as {
  __mockSocketService: {
    connect: jest.Mock;
    subscribe: jest.Mock;
    unsubscribe: jest.Mock;
    disconnect: jest.Mock;
    onPositionUpdate: jest.Mock;
    isConnected: jest.Mock;
  };
};

const resetAuth = () =>
  useAuthStore.setState({
    token: "token-123",
    userId: "user-1",
    email: "u@example.com",
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });

const resetVehicles = () =>
  useVehicleStore.setState({
    vehicles: new Map(),
    selectedVehicleId: null,
    isLoading: false,
    error: null,
  });

describe("useVehicleSocket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAuth();
    resetVehicles();
  });

  it("connects and subscribes when authenticated with vehicle ids", () => {
    const { unmount } = renderHook(() => useVehicleSocket(["veh-1", "veh-2"]));

    expect(socketMock.connect).toHaveBeenCalledWith("token-123");
    expect(socketMock.onPositionUpdate).toHaveBeenCalled();
    expect(socketMock.subscribe).toHaveBeenCalledWith(["veh-1", "veh-2"]);

    unmount();
    expect(socketMock.unsubscribe).toHaveBeenCalled();
    expect(socketMock.disconnect).toHaveBeenCalled();
  });

  it("unsubscribes when vehicleIds become empty", () => {
    const { rerender } = renderHook(
      ({ ids }) => useVehicleSocket(ids),
      { initialProps: { ids: ["veh-1"] } }
    );

    expect(socketMock.subscribe).toHaveBeenCalledWith(["veh-1"]);

    rerender({ ids: [] });
    expect(socketMock.unsubscribe).toHaveBeenCalled();
  });

  it("does nothing when not authenticated", () => {
    useAuthStore.setState({ isAuthenticated: false, token: null });

    renderHook(() => useVehicleSocket(["veh-1"]));

    expect(socketMock.connect).not.toHaveBeenCalled();
    expect(socketMock.subscribe).not.toHaveBeenCalled();
  });
});
