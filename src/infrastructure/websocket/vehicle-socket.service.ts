import type { WebSocketPositionUpdate } from "@/domain/types";
import { createPositionUpdateFromWebSocket } from "@/domain/models";

const API_BASE_URL = "https://api-dev.carbn.nz";

type PositionUpdateCallback = (update: ReturnType<typeof createPositionUpdateFromWebSocket>) => void;

// Module-level state (closure)
const state = {
  socket: null as WebSocket | null,
  callbacks: new Set<PositionUpdateCallback>(),
  subscribedVehicleIds: [] as string[],
  token: null as string | null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  reconnectTimeout: null as NodeJS.Timeout | null,
  isIntentionalClose: false,
};

const connect = (token: string): void => {
  if (state.socket?.readyState === WebSocket.OPEN) {
    console.log("[WEBSOCKET] Already connected");
    return;
  }

  state.token = token;
  state.isIntentionalClose = false;

  // Convert https to wss (secure), http to ws
  const wsUrl = API_BASE_URL.replace(/^https/, "wss").replace(/^http/, "ws");
  const fullUrl = `${wsUrl}/api/v1/fleet/live?token=${token}`;

  console.log("[WEBSOCKET] 🔌 Connecting to:", fullUrl.replace(token, "***TOKEN***"));

  try {
    state.socket = new WebSocket(fullUrl);

    state.socket.onopen = () => {
      console.log("[WEBSOCKET] ✅ Connected successfully");
      state.reconnectAttempts = 0;

      // Resubscribe to vehicles after reconnection
      if (state.subscribedVehicleIds.length > 0) {
        console.log("[WEBSOCKET] 🔄 Resubscribing to vehicles:", state.subscribedVehicleIds);
        subscribe(state.subscribedVehicleIds);
      }
    };

    state.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketPositionUpdate;
        
        console.log("[WEBSOCKET] 📨 Received message:", {
          type: data.type,
          vehicle_id: data.vehicle_id,
          lat: data.lat,
          lng: data.lng,
        });

        if (data.type === "position_update") {
          const update = createPositionUpdateFromWebSocket(data);
          state.callbacks.forEach((callback) => callback(update));
        }
      } catch (error) {
        console.error("[WEBSOCKET] ❌ Failed to parse message:", error);
      }
    };

    state.socket.onerror = (error) => {
      console.error("[WEBSOCKET] ❌ WebSocket error:", error);
    };

    state.socket.onclose = (event) => {
      console.log("[WEBSOCKET] 🔌 Disconnected:", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });

      state.socket = null;

      // Auto-reconnect if not intentional
      if (!state.isIntentionalClose && state.reconnectAttempts < state.maxReconnectAttempts) {
        state.reconnectAttempts++;
        const delay = state.reconnectDelay * state.reconnectAttempts;
        
        console.log(
          `[WEBSOCKET] 🔄 Reconnecting in ${delay}ms (attempt ${state.reconnectAttempts}/${state.maxReconnectAttempts})`
        );

        state.reconnectTimeout = setTimeout(() => {
          if (state.token) {
            connect(state.token);
          }
        }, delay);
      } else if (state.reconnectAttempts >= state.maxReconnectAttempts) {
        console.error("[WEBSOCKET] ❌ Max reconnection attempts reached");
      }
    };
  } catch (error) {
    console.error("[WEBSOCKET] ❌ Failed to create WebSocket:", error);
  }
};

const disconnect = (): void => {
  console.log("[WEBSOCKET] 🔌 Disconnecting...");
  state.isIntentionalClose = true;
  
  if (state.reconnectTimeout) {
    clearTimeout(state.reconnectTimeout);
    state.reconnectTimeout = null;
  }

  if (state.socket) {
    state.socket.close();
    state.socket = null;
  }

  state.subscribedVehicleIds = [];
  state.token = null;
  state.reconnectAttempts = 0;
};

const subscribe = (vehicleIds: string[]): void => {
  if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
    console.warn("[WEBSOCKET] ⚠️  Cannot subscribe: WebSocket not connected");
    return;
  }

  state.subscribedVehicleIds = vehicleIds;

  const message = JSON.stringify({
    action: "subscribe",
    vehicle_ids: vehicleIds,
  });

  console.log("[WEBSOCKET] 📤 Subscribing to vehicles:", vehicleIds);
  state.socket.send(message);
};

const unsubscribe = (): void => {
  console.log("[WEBSOCKET] 🔕 Unsubscribing from all vehicles");
  state.subscribedVehicleIds = [];
};

const onPositionUpdate = (callback: PositionUpdateCallback): (() => void) => {
  state.callbacks.add(callback);
  console.log("[WEBSOCKET] 👂 Position update listener added. Total listeners:", state.callbacks.size);

  // Return cleanup function
  return () => {
    state.callbacks.delete(callback);
    console.log("[WEBSOCKET] 👋 Position update listener removed. Total listeners:", state.callbacks.size);
  };
};

const isConnected = (): boolean => {
  return state.socket?.readyState === WebSocket.OPEN;
};

export const vehicleSocketService = {
  connect,
  disconnect,
  subscribe,
  unsubscribe,
  onPositionUpdate,
  isConnected,
};

