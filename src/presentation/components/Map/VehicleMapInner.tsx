"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useMapStore } from "@/application/stores/map.store";
import type { MapBounds, TrackHistoryPoint } from "@/domain/types";
import type { Vehicle } from "@/domain/models";
import "leaflet/dist/leaflet.css";

interface VehicleMapInnerProps {
    vehicles: Vehicle[];
    selectedVehicleId: string | null;
    onVehicleSelect: (vehicleId: string) => void;
    trackPoints?: TrackHistoryPoint[];
}

// Component to handle map events
const MapEventHandler = () => {
    const { setBounds } = useMapStore();

    useMapEvents({
        moveend: (e) => {
            const map = e.target;
            const bounds = map.getBounds();
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();

            const mapBounds: MapBounds = {
                neLat: ne.lat,
                neLng: ne.lng,
                swLat: sw.lat,
                swLng: sw.lng,
            };

            setBounds(mapBounds);
        },
    });

    return null;
};

// Component to set initial bounds on mount
const InitialBoundsHandler = () => {
    const map = useMap();
    const { setBounds } = useMapStore();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            const bounds = map.getBounds();
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();

            setBounds({
                neLat: ne.lat,
                neLng: ne.lng,
                swLat: sw.lat,
                swLng: sw.lng,
            });
        }
    }, [map, setBounds]);

    return null;
};

// Create a custom icon for vehicles
const createVehicleIcon = (vehicle: Vehicle, isSelected: boolean) => {
    const color = vehicle.ignitionOn ? "#22c55e" : "#ef4444"; // green : red
    const scale = isSelected ? 1.3 : 1;
    const size = 40 * scale;

    // Create an arrow SVG that points in the vehicle's heading direction
    const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(${vehicle.heading} 20 20)">
        <circle cx="20" cy="20" r="12" fill="${color}" stroke="${isSelected ? '#3b82f6' : '#fff'}" stroke-width="${isSelected ? '3' : '2'}"/>
        <path d="M 20 10 L 25 25 L 20 22 L 15 25 Z" fill="#fff"/>
      </g>
    </svg>
  `;

    return L.divIcon({
        html: svg,
        className: "vehicle-marker",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
};

const VehicleMapInner = ({
    vehicles,
    selectedVehicleId,
    onVehicleSelect,
    trackPoints = [],
}: VehicleMapInnerProps) => {
    const { center, zoom } = useMapStore();

    // Convert track points to Leaflet format
    const trackPath = useMemo(
        () => trackPoints.map((point) => [point.lat, point.lng] as [number, number]),
        [trackPoints]
    );

    return (
        <MapContainer
            center={[center.lat, center.lng]}
            zoom={zoom}
            className="w-full h-full"
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapEventHandler />
            <InitialBoundsHandler />

            {/* Track history polyline */}
            {trackPath.length > 0 && (
                <Polyline
                    positions={trackPath}
                    pathOptions={{
                        color: "#3b82f6",
                        weight: 3,
                        opacity: 0.8,
                    }}
                />
            )}

            {/* Vehicle markers */}
            {vehicles.map((vehicle) => (
                <Marker
                    key={vehicle.id}
                    position={[vehicle.position.lat, vehicle.position.lng]}
                    icon={createVehicleIcon(vehicle, vehicle.id === selectedVehicleId)}
                    eventHandlers={{
                        click: () => onVehicleSelect(vehicle.id),
                    }}
                />
            ))}
        </MapContainer>
    );
};

export default VehicleMapInner;
