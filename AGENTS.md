# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Project: AgriLink Mobile

Agriculture marketplace mobile app (Expo SDK 54) with 4 user roles: Buyer, Farmer, Cooperative, Coordinator.
UI/UX only — no backend, mock data only.

## Tech Stack
- Expo SDK 54, React Native
- `react-native-safe-area-context` for safe areas
- `react-native-svg` for wave effects
- `@expo/vector-icons` (Ionicons) for all icons
- Expo Router (file-based routing)

## Design System
- Primary green: `#1B6B43`, Background: `#F8FAF9`
- Floating pill tab bar: `borderRadius: 100`, `marginHorizontal: 16`, `marginBottom: 16`
- SVG wave transition between green headers and white content
- Light mode only, no emojis

## Commands
- Lint: `npx expo lint`

## Routes
- `app/index.tsx` — Get Started / landing page
- `app/(auth)/` — Login, Register
- `app/(buyer)/` — Browse, Orders, Notifications, Profile, Item details
- `app/(farmer)/` — Dashboard, Orders, Add Listing, Notifications, Profile
- `app/(coop)/` — Not yet built
- `app/(coordinator)/` — Not yet built

## Data
- `data/crops.ts` — 12 mock crops (CropType, Availability types)
- `data/buyerData.ts` — Buyer profile, orders, notifications
- `data/farmerData.ts` — Farmer profile, listings, incoming orders, notifications
