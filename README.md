# LiftX Mobile 🏋️

Multi-Branch Gym Management & Fitness Platform — React Native + Expo

## 🚀 Run in 3 steps

```bash
# 1. Install dependencies
npm install

# 2. Start Expo
npx expo start

# 3. Scan the QR code with Expo Go app on your phone
#    OR press 'a' for Android emulator / 'i' for iOS simulator / 'w' for web
```

## 📱 Install Expo Go

- **Android**: [Play Store → Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iPhone**: [App Store → Expo Go](https://apps.apple.com/app/expo-go/id982107779)

Then scan the QR code shown in terminal after `npx expo start`

## 🔐 Demo Login

| Role    | Email                | Password  |
|---------|----------------------|-----------|
| Member  | member@gymos.app     | demo123   |
| Trainer | trainer@gymos.app    | demo123   |

> Any password works — mock API accepts all credentials

## 📁 Project Structure

```
LiftX/
├── App.tsx                    # Entry point
├── app.json                   # Expo config
├── src/
│   ├── theme/                 # Colors, Typography, Spacing
│   ├── types/                 # TypeScript interfaces
│   ├── store/                 # Zustand auth store
│   ├── hooks/                 # React Query hooks (mock-powered)
│   ├── navigation/            # Stack + Tab navigators
│   ├── components/common/     # Button, Card, Input, Badge, Avatar...
│   ├── services/
│   │   ├── api/
│   │   │   ├── mockData.ts    # All mock data
│   │   │   └── mockApi.ts     # Mock API with realistic delays
│   │   └── firebase/          # Push notifications (expo-notifications)
│   └── screens/
│       ├── auth/              # Login
│       ├── member/            # Dashboard, Workout, Progress, Diet, QR, PT
│       ├── trainer/           # Dashboard, Members, Sessions, Calendar
│       └── shared/            # Notifications
```

## 🎨 Design

Dark elite-gym aesthetic — electric violet `#6C47FF` brand accent on deep `#0A0A0F` background.

## 🔌 Switching to real backend

1. Set `API_URL` in `.env`
2. In `src/hooks/index.ts`, replace `mockXxxApi` imports with `src/services/api/index.ts`
3. Configure Firebase / Expo push tokens

## 📦 Key packages

| Package | Purpose |
|---------|---------|
| `expo-camera` | QR code scanning |
| `expo-av` | Exercise video player |
| `expo-image-picker` | Progress & meal photos |
| `expo-notifications` | Push notifications |
| `expo-linear-gradient` | Brand gradients |
| `expo-haptics` | Haptic feedback |
| `@tanstack/react-query` | Data fetching & caching |
| `zustand` + `AsyncStorage` | Auth state persistence |
| `react-hook-form` + `zod` | Form validation |
| `react-native-chart-kit` | Weight progress charts |
| `date-fns` | Date formatting |
