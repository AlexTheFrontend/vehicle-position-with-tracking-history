# Vehicle Position with Tracking History

(https://github.com/YOUR_USERNAME/vehicle-position-with-tracking-history/actions/workflows/test.yml/badge.svg)

Next.js app that shows live vehicle positions with historical tracks, built with Leaflet + OpenStreetMap tiles and Zustand state.

## Features

- 🗺️ Leaflet map with OSM tiles and custom vehicle markers
- 🔴 Real-time position updates via WebSocket (with reconnect + resubscribe)
- 📍 Vehicle selection with details panel (ignition, speed, heading, coords)
- 🧭 Directional arrow markers; ignition-aware coloring
- 📈 Track history with time ranges (1h, 6h, 24h, 7d) plus live extension
- 🔔 Toast errors for track history failures
- 🟢 Live/offline indicator + vehicle count badge

## Architecture (light DDD)

- **Domain**: `src/domain` models and API/WebSocket types.
- **Infrastructure**: `src/infrastructure/api/*` REST clients, `websocket/vehicle-socket.service.ts`.
- **Application**: Zustand stores (`auth.store.ts`, `vehicle.store.ts`, `map.store.ts`) and hooks (`useAuth`, `useVehicles`, `useTrackHistory`, `useVehicleSocket`).
- **Presentation**: Components under `src/presentation/components`, page in `app/page.tsx`.

Data flow: on load `useAuth` auto-logins with hardcoded creds -> `useVehicles` fetches visible vehicles for current map bounds -> `useVehicleSocket` streams live position updates into the vehicle store -> `useTrackHistory` fetches history for the selected vehicle and appends live points -> map + details render from store state.

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4, via `@tailwindcss/postcss`)
- **State**: Zustand
- **Maps**: Leaflet + React Leaflet with OSM tiles
- **Real-time**: Native WebSocket API
- **Notifications**: React Hot Toast
- **Package Manager**: Yarn

## Getting Started

### Prerequisites

- Node.js 22.x (see `engines` in `package.json`)
- Yarn

### Installation

```bash
yarn install
```

### Configuration

No `.env` needed today. API base and default login creds live in `src/infrastructure/api/config.ts`:
- `API_BASE_URL = https://api-dev.carbn.nz`
- `DEFAULT_AUTH_CREDENTIALS = { email: "sasha@bfsnz.co.nz", password: "NewPass@1976" }`

Change those if you need different environments or credentials.

### Development

```bash
yarn dev
```

Open http://localhost:3000

### Build & Run

```bash
yarn build
yarn start
```

### Tests

```bash
yarn test
```

### Lint

```bash
yarn lint
```

## CI/CD

GitHub Actions workflow runs on push/PR to `main` and `develop` branches:

1. **Lint** - ESLint with zero warnings tolerance
2. **Tests** - Jest test suite

See `.github/workflows/test.yml` for configuration.

## Linting

ESLint 9 (flat config) with TypeScript rules:

| Rule | Description |
|------|-------------|
| `@typescript-eslint/no-unused-vars` | Error on unused variables (allows `_` prefix) |
| `@typescript-eslint/no-explicit-any` | Warns on `any` usage |
| `@typescript-eslint/consistent-type-imports` | Enforces `import type` syntax |
| `@typescript-eslint/no-empty-object-type` | Prevents empty interfaces |
| `@typescript-eslint/no-require-imports` | Prevents `require()` calls |
| `prefer-const` | Enforces `const` over `let` when possible |

Test files (`__tests__/**`, `*.test.ts(x)`) have relaxed rules for pragmatic testing.

## Project Structure

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── src/
│   ├── domain/
│   │   ├── models/ (Vehicle, Position factories)
│   │   └── types/ (api + websocket contracts)
│   ├── infrastructure/
│   │   ├── api/ (auth, fleet REST clients)
│   │   └── websocket/ (vehicle-socket.service.ts)
│   ├── application/
│   │   ├── stores/ (auth, vehicle, map Zustand stores)
│   │   └── hooks/ (auth, vehicles, track history, socket)
│   └── presentation/
│       └── components/
│           ├── Map/ (VehicleMap, VehicleMapInner, TimeRangeSelector)
│           └── VehicleDetails/ (VehicleDetailsPanel)
```

## API & WebSocket

- **Base**: `https://api-dev.carbn.nz`
- **Login**: `POST /api/v1/auth/login` (hardcoded creds in `auth.service.ts`)
- **Vehicles (live)**: `GET /api/v1/fleet/vehicles/live?swLat&swLng&neLat&neLng` (auth bearer token)
- **Track history**: `GET /api/v1/fleet/vehicles/:vehicleId/track?from=now-24h&to=...`
- **WebSocket**: `wss://api-dev.carbn.nz/api/v1/fleet/live?token=<token>`

Subscribe:
```json
{"action": "subscribe", "vehicle_ids": ["uuid1", "uuid2"]}
```

Position update:
```json
{
  "type": "position_update",
  "vehicle_id": "uuid",
  "lat": -36.85,
  "lng": 174.76,
  "speed": 50.0,
  "heading": 90,
  "timestamp": "2025-10-18T08:01:00Z"
}
```

## Possible simplifications (not yet applied)

- Trim console noise in `useAuth` and websocket service for cleaner prod logs.
- Centralize `API_BASE_URL` and hardcoded creds into a single config file to swap environments quickly.
- Debounce/queue map move-triggered fetches in `useVehicles` to avoid rapid refetch on small pans.
- Add basic WebSocket lifecycle UI (connecting/retrying states) near the status badge for visibility.
- Memoize `VehicleMapInner` marker icons if perf becomes an issue with many vehicles.

## License

Proprietary
