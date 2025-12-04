# Vehicle Position with Tracking History

A Next.js application for tracking vehicle positions with historical data and real-time updates.

## Features

- 🗺️ Google Maps integration with vehicle markers
- 🔴 Real-time vehicle position updates via WebSocket
- 📍 Vehicle selection and detailed information panel
- 🎨 Color-coded markers (ignition on/off)
- 🧭 Directional arrows showing vehicle heading
- 📊 Live connection status indicator
- 📈 Track history with multiple time ranges (1h, 6h, 24h, 7d)
- 🔴 Live track extension - historical track + real-time updates
- 🔔 Toast notifications for errors

## Architecture

Built using Light DDD (Domain-Driven Design):

- **Domain Layer**: Models, types, interfaces
- **Infrastructure Layer**: API clients, WebSocket service
- **Application Layer**: Business logic, state management (Zustand)
- **Presentation Layer**: React components, pages

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Maps**: Google Maps (@googlemaps/js-api-loader)
- **Real-time**: Socket.IO Client
- **Notifications**: React Hot Toast
- **Package Manager**: Yarn

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn package manager
- Google Maps API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

3. Create `.env.local` file:

```bash
cp .env.example .env.local
```

4. Add your Google Maps API key to `.env.local`:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key
NEXT_PUBLIC_API_BASE_URL=https://api-dev.carbn.nz
```

### Development

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
yarn build
yarn start
```

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── src/
│   ├── domain/                   # Domain layer
│   │   ├── models/               # Domain models
│   │   │   ├── Vehicle.ts
│   │   │   └── Position.ts
│   │   └── types/                # Type definitions
│   │       └── api.types.ts
│   ├── infrastructure/           # Infrastructure layer
│   │   ├── api/                  # API services
│   │   │   ├── auth.service.ts
│   │   │   └── fleet.service.ts
│   │   └── websocket/            # WebSocket service
│   │       └── vehicle-socket.service.ts
│   ├── application/              # Application layer
│   │   ├── stores/               # Zustand stores
│   │   │   ├── auth.store.ts
│   │   │   ├── vehicle.store.ts
│   │   │   └── map.store.ts
│   │   └── hooks/                # Custom hooks
│   │       ├── useAuth.ts
│   │       ├── useVehicles.ts
│   │       └── useVehicleSocket.ts
│   └── presentation/             # Presentation layer
│       └── components/           # React components
│           ├── Map/
│           │   ├── VehicleMap.tsx
│           │   └── TrackHistory.tsx
│           └── VehicleDetails/
│               └── VehicleDetailsPanel.tsx
```

## API Integration

### Authentication

The app auto-authenticates with hardcoded credentials on load:
- Email: `sasha@bfsnz.co.nz`
- Password: `NewPass@1976`

### Endpoints

1. **Login**: `POST /api/v1/auth/login`
2. **Get Vehicles**: `GET /api/v1/fleet/vehicles/live`
3. **Get Track History**: `GET /api/v1/fleet/vehicles/:vehicle_id/track`
4. **WebSocket**: `ws://api-dev.carbn.nz/api/v1/fleet/live?token=<token>`

### WebSocket Messages

Subscribe to vehicles:
```json
{"action": "subscribe", "vehicle_ids": ["uuid1", "uuid2"]}
```

Receive updates:
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

## Future Enhancements

See `FUTURE_ENHANCEMENTS.md` for planned visual improvements to track history:
- Gradient colors based on speed
- Time markers at intervals
- Start/end markers with special styling
- Speed charts and playback controls

Other features:
- 🔍 Vehicle search and filtering
- 🕐 Time-based playback of vehicle movements
- 📱 Responsive mobile layout

## License

Proprietary
