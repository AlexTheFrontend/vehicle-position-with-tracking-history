# Setup Instructions

## Quick Start

1. **Add Google Maps API Key**

   You need to add your Google Maps API key. Create a `.env.local` file:

   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key
   NEXT_PUBLIC_API_BASE_URL=https://api-dev.carbn.nz
   ```

2. **Run the Development Server**

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## How It Works

### Authentication
- The app automatically logs in with hardcoded credentials when it loads
- JWT token is stored in localStorage and Zustand store
- Token is used for all API requests and WebSocket connection

### Vehicle Display
- On initial load, the map fetches vehicles within the visible bounds
- Vehicles are displayed as markers with:
  - Green circle = ignition on
  - Red circle = ignition off
  - Arrow pointing in the vehicle's heading direction
  - Selected vehicle has larger, blue-outlined marker

### Real-Time Updates
- Native WebSocket connection is established after authentication
- Connects to: `ws://api-dev.carbn.nz/api/v1/fleet/live?token=<JWT>`
- The app subscribes to all visible vehicles by sending JSON messages
- Position updates are received in real-time and the map updates smoothly
- Connection status is shown in the top-left corner
- Auto-reconnects on disconnect (up to 5 attempts with exponential backoff)

### Vehicle Selection
- Click any vehicle marker to select it
- A details panel appears showing:
  - Vehicle name and registration
  - Ignition status
  - Speed and heading
  - Current position coordinates
  - Last update timestamp
- Click the X button to deselect

### Track History
- When a vehicle is selected, its historical track is automatically displayed
- Time range selector appears at the top center (1h, 6h, 24h, 7d)
- Click different time ranges to see more or less history
- The track line shows where the vehicle has been
- **Live Extension**: As the vehicle moves, new positions are added to the track in real-time
- Historical data + live WebSocket updates = continuous growing track

### Map Interaction
- Pan and zoom the map to see different areas
- When the map bounds change, vehicles are re-fetched for the new area
- The status bar shows the number of vehicles currently displayed

## Troubleshooting

### TypeScript Path Errors
If you see TypeScript errors about `@/` imports:
1. Make sure you're in the project root directory
2. Try restarting your IDE/editor
3. The paths are correctly configured in `tsconfig.json`

### WebSocket Connection Issues
- Check that the API base URL is correct in `.env.local`
- The app converts `https://` to `wss://` for WebSocket connections
- Check browser console for connection errors

### Google Maps Not Loading
- Verify your API key is valid
- Make sure the API key is in `.env.local` (not `.env.example`)
- The Maps JavaScript API must be enabled in your Google Cloud Console

## Architecture Notes

The project follows Light DDD principles:

- **Domain**: Core business models and types (Vehicle, Position)
- **Infrastructure**: External integrations (API services, WebSocket)
- **Application**: Business logic and state (Zustand stores, custom hooks)
- **Presentation**: UI components (React components)

This separation makes the code:
- Easier to test
- More maintainable
- Better organized
- Less coupled to external dependencies

