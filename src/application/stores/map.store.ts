import { create } from "zustand";
import type { MapBounds } from "@/domain/types";

interface MapState {
  bounds: MapBounds | null;
  center: { lat: number; lng: number };
  zoom: number;
  setBounds: (bounds: MapBounds) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
}

// Default center: New Zealand
const DEFAULT_CENTER = { lat: -41.2865, lng: 174.7762 };
const DEFAULT_ZOOM = 6;

export const useMapStore = create<MapState>((set) => ({
  bounds: null,
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,

  setBounds: (bounds: MapBounds) => {
    set({ bounds });
  },

  setCenter: (center: { lat: number; lng: number }) => {
    set({ center });
  },

  setZoom: (zoom: number) => {
    set({ zoom });
  },
}));

