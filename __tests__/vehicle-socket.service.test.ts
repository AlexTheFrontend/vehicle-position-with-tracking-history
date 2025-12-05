/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PositionUpdate } from "@/domain/models";

class MockWebSocket {
  static OPEN = 1;
  static CLOSED = 3;
  static instances: MockWebSocket[] = [];

  url: string;
  readyState = MockWebSocket.OPEN;
  sent: string[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  send(message: string) {
    this.sent.push(message);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.({ code: 1000, reason: "", wasClean: true });
  }
}

describe("vehicle-socket.service", () => {
  let vehicleSocketService: typeof import("@/infrastructure/websocket/vehicle-socket.service").vehicleSocketService;

  beforeEach(() => {
    jest.resetModules();
    MockWebSocket.instances = [];
    (global as any).WebSocket = MockWebSocket as any;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    vehicleSocketService = require("@/infrastructure/websocket/vehicle-socket.service").vehicleSocketService;
  });

  afterEach(() => {
    vehicleSocketService.disconnect();
  });

  it("connects and sends subscribe messages", () => {
    vehicleSocketService.connect("token-123");

    expect(MockWebSocket.instances).toHaveLength(1);

    vehicleSocketService.subscribe(["veh-1", "veh-2"]);
    const ws = MockWebSocket.instances[0];
    expect(ws.sent).toContain(
      JSON.stringify({ action: "subscribe", vehicle_ids: ["veh-1", "veh-2"] })
    );
  });

  it("invokes callbacks on position_update messages", () => {
    const callback = jest.fn();

    vehicleSocketService.connect("token-123");
    vehicleSocketService.onPositionUpdate(callback);

    const ws = MockWebSocket.instances[0];
    ws.onmessage?.({
      data: JSON.stringify({
        type: "position_update",
        vehicle_id: "veh-1",
        lat: 1,
        lng: 2,
        speed: 3,
        heading: 4,
        timestamp: "t",
      }),
    });

    expect(callback).toHaveBeenCalledTimes(1);
    const update = callback.mock.calls[0][0] as PositionUpdate;
    expect(update).toMatchObject({
      vehicleId: "veh-1",
      lat: 1,
      lng: 2,
      speed: 3,
      heading: 4,
      timestamp: "t",
    });
  });
});
